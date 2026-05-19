export function buildWaitForGraph(processes, resources, edges) {
  const processIds = new Set(processes.map((process) => process.id));
  const resourceIds = new Set(resources.map((resource) => resource.id));
  const holdersByResource = new Map(resources.map((resource) => [resource.id, []]));
  const waitFor = new Map(processes.map((process) => [process.id, []]));
  const waitForEdges = [];

  for (const edge of edges) {
    if (edge.type !== "allocation") continue;
    if (!resourceIds.has(edge.from) || !processIds.has(edge.to)) continue;
    holdersByResource.set(edge.from, [...(holdersByResource.get(edge.from) ?? []), edge.to]);
  }

  for (const edge of edges) {
    if (edge.type !== "request") continue;
    if (!processIds.has(edge.from) || !resourceIds.has(edge.to)) continue;

    const holders = holdersByResource.get(edge.to) ?? [];
    for (const holder of holders) {
      if (holder === edge.from) continue;
      const existing = waitFor.get(edge.from) ?? [];
      if (!existing.includes(holder)) {
        waitFor.set(edge.from, [...existing, holder]);
      }
      waitForEdges.push({
        from: edge.from,
        to: holder,
        resourceId: edge.to,
        requestEdgeId: edge.id,
        allocationEdgeId: edges.find(
          (candidate) => candidate.type === "allocation" && candidate.from === edge.to && candidate.to === holder,
        )?.id,
      });
    }
  }

  return { waitFor, waitForEdges };
}

function findCycle(processes, waitFor) {
  const color = new Map(processes.map((process) => [process.id, 0]));
  const stack = [];

  function dfs(processId) {
    color.set(processId, 1);
    stack.push(processId);

    for (const nextProcess of waitFor.get(processId) ?? []) {
      if (!color.has(nextProcess)) continue;

      if (color.get(nextProcess) === 0) {
        const cycle = dfs(nextProcess);
        if (cycle) return cycle;
      }

      if (color.get(nextProcess) === 1) {
        const start = stack.indexOf(nextProcess);
        return stack.slice(start);
      }
    }

    stack.pop();
    color.set(processId, 2);
    return null;
  }

  for (const process of processes) {
    if (color.get(process.id) !== 0) continue;
    const cycle = dfs(process.id);
    if (cycle) return cycle;
  }

  return [];
}

function edgeIdsForCycle(cycleProcesses, waitForEdges) {
  if (!cycleProcesses.length) return { cycleResources: [], cycleEdgeIds: [] };

  const cycleResources = [];
  const cycleEdgeIds = [];

  for (let index = 0; index < cycleProcesses.length; index += 1) {
    const from = cycleProcesses[index];
    const to = cycleProcesses[(index + 1) % cycleProcesses.length];
    const relation = waitForEdges.find((edge) => edge.from === from && edge.to === to);

    if (!relation) continue;
    cycleResources.push(relation.resourceId);
    if (relation.requestEdgeId) cycleEdgeIds.push(relation.requestEdgeId);
    if (relation.allocationEdgeId) cycleEdgeIds.push(relation.allocationEdgeId);
  }

  return {
    cycleResources: [...new Set(cycleResources)],
    cycleEdgeIds: [...new Set(cycleEdgeIds)],
  };
}

export function detectDeadlock(processes, resources, edges) {
  const { waitFor, waitForEdges } = buildWaitForGraph(processes, resources, edges);
  const cycleProcesses = findCycle(processes, waitFor);
  const hasDeadlock = cycleProcesses.length > 0;
  const { cycleResources, cycleEdgeIds } = edgeIdsForCycle(cycleProcesses, waitForEdges);

  if (hasDeadlock) {
    return {
      status: "deadlock",
      hasDeadlock: true,
      cycleProcesses,
      cycleResources,
      cycleEdgeIds,
      waitForEdges,
      message: `Deadlock detected: chu trình ${cycleProcesses.join(" -> ")} -> ${cycleProcesses[0]}.`,
    };
  }

  if (waitForEdges.length) {
    return {
      status: "waiting",
      hasDeadlock: false,
      cycleProcesses: [],
      cycleResources: [],
      cycleEdgeIds: [],
      waitForEdges,
      message: "No deadlock - có tiến trình đang chờ tài nguyên nhưng chưa tạo chu trình.",
    };
  }

  return {
    status: processes.length || resources.length ? "safe" : "idle",
    hasDeadlock: false,
    cycleProcesses: [],
    cycleResources: [],
    cycleEdgeIds: [],
    waitForEdges,
    message: processes.length || resources.length ? "No deadlock - trạng thái hiện tại an toàn." : "Chưa có dữ liệu mô phỏng.",
  };
}

export function enrichGraph(processes, resources, edges, analysis) {
  const heldByProcess = new Map(processes.map((process) => [process.id, []]));
  const waitingByProcess = new Map(processes.map((process) => [process.id, []]));
  const allocatedByResource = new Map(resources.map((resource) => [resource.id, []]));
  const requestedByResource = new Map(resources.map((resource) => [resource.id, []]));
  const deadlockedProcesses = new Set(analysis?.hasDeadlock ? analysis.cycleProcesses : []);
  const waitForSources = new Set((analysis?.waitForEdges ?? []).map((edge) => edge.from));

  for (const edge of edges) {
    if (edge.type === "allocation") {
      heldByProcess.set(edge.to, [...(heldByProcess.get(edge.to) ?? []), edge.from]);
      allocatedByResource.set(edge.from, [...(allocatedByResource.get(edge.from) ?? []), edge.to]);
    }

    if (edge.type === "request") {
      waitingByProcess.set(edge.from, [...(waitingByProcess.get(edge.from) ?? []), edge.to]);
      requestedByResource.set(edge.to, [...(requestedByResource.get(edge.to) ?? []), edge.from]);
    }
  }

  return {
    processes: processes.map((process) => ({
      ...process,
      heldResources: heldByProcess.get(process.id) ?? [],
      waitingFor: waitingByProcess.get(process.id) ?? [],
      status: deadlockedProcesses.has(process.id) ? "deadlocked" : waitForSources.has(process.id) ? "waiting" : "normal",
    })),
    resources: resources.map((resource) => ({
      ...resource,
      allocatedTo: allocatedByResource.get(resource.id) ?? [],
      requestedBy: requestedByResource.get(resource.id) ?? [],
    })),
  };
}
