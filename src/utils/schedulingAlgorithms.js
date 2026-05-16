import { calculateMetrics } from "./metrics";

function normalizeProcesses(processes) {
  return processes.map((process, order) => ({
    ...process,
    arrivalTime: Number(process.arrivalTime),
    burstTime: Number(process.burstTime),
    order,
  }));
}

function createIdleSegment(start, end) {
  return {
    id: `idle-${start}-${end}`,
    processId: "Idle",
    label: "Idle",
    start,
    end,
    duration: end - start,
    type: "idle",
    color: "#94a3b8",
  };
}

function createProcessSegment(process, start, end) {
  return {
    id: `${process.id}-${start}-${end}-${process.order}`,
    processId: process.id,
    label: process.id,
    start,
    end,
    duration: end - start,
    type: "process",
    color: process.color,
  };
}

function withMetrics(algorithm, processes, gantt, extra = {}) {
  const metrics = calculateMetrics(processes, gantt);
  return {
    algorithm,
    processes,
    gantt,
    ...metrics,
    ...extra,
  };
}

export function simulateFCFS(inputProcesses) {
  const processes = normalizeProcesses(inputProcesses);
  const ordered = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime || a.order - b.order);
  const gantt = [];
  let currentTime = 0;

  ordered.forEach((process) => {
    if (currentTime < process.arrivalTime) {
      gantt.push(createIdleSegment(currentTime, process.arrivalTime));
      currentTime = process.arrivalTime;
    }

    const start = currentTime;
    const end = start + process.burstTime;
    gantt.push(createProcessSegment(process, start, end));
    currentTime = end;
  });

  return withMetrics("FCFS", processes, gantt);
}

export function simulateSJF(inputProcesses) {
  const processes = normalizeProcesses(inputProcesses);
  const incomplete = new Set(processes.map((process) => process.id));
  const gantt = [];
  let currentTime = 0;

  while (incomplete.size > 0) {
    const readyQueue = processes
      .filter((process) => incomplete.has(process.id) && process.arrivalTime <= currentTime)
      .sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime || a.order - b.order);

    if (readyQueue.length === 0) {
      const nextArrival = Math.min(
        ...processes.filter((process) => incomplete.has(process.id)).map((process) => process.arrivalTime)
      );
      if (currentTime < nextArrival) {
        gantt.push(createIdleSegment(currentTime, nextArrival));
      }
      currentTime = nextArrival;
      continue;
    }

    const process = readyQueue[0];
    const start = currentTime;
    const end = start + process.burstTime;
    gantt.push(createProcessSegment(process, start, end));
    currentTime = end;
    incomplete.delete(process.id);
  }

  return withMetrics("SJF", processes, gantt);
}

export function simulateRoundRobin(inputProcesses, timeQuantum) {
  const quantum = Number(timeQuantum);
  const processes = normalizeProcesses(inputProcesses);
  const ordered = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime || a.order - b.order);
  const remainingTime = new Map(processes.map((process) => [process.id, process.burstTime]));
  const readyQueue = [];
  const gantt = [];
  let currentTime = 0;
  let index = 0;
  let completed = 0;

  const enqueueArrivals = () => {
    while (index < ordered.length && ordered[index].arrivalTime <= currentTime) {
      readyQueue.push(ordered[index]);
      index += 1;
    }
  };

  while (completed < processes.length) {
    enqueueArrivals();

    if (readyQueue.length === 0) {
      const nextProcess = ordered[index];
      if (!nextProcess) {
        break;
      }
      if (currentTime < nextProcess.arrivalTime) {
        gantt.push(createIdleSegment(currentTime, nextProcess.arrivalTime));
      }
      currentTime = nextProcess.arrivalTime;
      enqueueArrivals();
      continue;
    }

    const process = readyQueue.shift();
    const runTime = Math.min(quantum, remainingTime.get(process.id));
    const start = currentTime;
    const end = start + runTime;

    gantt.push(createProcessSegment(process, start, end));
    currentTime = end;
    remainingTime.set(process.id, remainingTime.get(process.id) - runTime);
    enqueueArrivals();

    if (remainingTime.get(process.id) > 0) {
      readyQueue.push(process);
    } else {
      completed += 1;
    }
  }

  return withMetrics("RR", processes, gantt, { timeQuantum: quantum });
}

export function runSchedulingAlgorithm(algorithm, processes, timeQuantum) {
  if (algorithm === "FCFS") return simulateFCFS(processes);
  if (algorithm === "SJF") return simulateSJF(processes);
  return simulateRoundRobin(processes, timeQuantum);
}
