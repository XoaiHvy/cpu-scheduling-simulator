export function calculateMetrics(processes, gantt) {
  const processSegments = gantt.filter((segment) => segment.type !== "idle");
  const firstStart = new Map();
  const completion = new Map();

  processSegments.forEach((segment) => {
    if (!firstStart.has(segment.processId)) {
      firstStart.set(segment.processId, segment.start);
    }
    completion.set(segment.processId, segment.end);
  });

  const results = processes.map((process) => {
    const startTime = firstStart.get(process.id) ?? process.arrivalTime;
    const completionTime = completion.get(process.id) ?? process.arrivalTime;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;
    const responseTime = startTime - process.arrivalTime;

    return {
      ...process,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    };
  });

  const count = results.length || 1;
  const totalWaitingTime = results.reduce((sum, item) => sum + item.waitingTime, 0);
  const totalTurnaroundTime = results.reduce((sum, item) => sum + item.turnaroundTime, 0);
  const totalResponseTime = results.reduce((sum, item) => sum + item.responseTime, 0);
  const totalCpuTime = processes.reduce((sum, item) => sum + item.burstTime, 0);
  const totalSimulationTime = gantt.length ? gantt[gantt.length - 1].end - gantt[0].start : 0;
  const safeTotalTime = totalSimulationTime || 1;

  return {
    results,
    stats: {
      averageWaitingTime: totalWaitingTime / count,
      averageTurnaroundTime: totalTurnaroundTime / count,
      averageResponseTime: totalResponseTime / count,
      cpuUtilization: (totalCpuTime / safeTotalTime) * 100,
      throughput: processes.length / safeTotalTime,
      totalCpuTime,
      totalSimulationTime,
    },
  };
}
