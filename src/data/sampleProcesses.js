export const PROCESS_COLORS = [
  "#0ea5e9",
  "#10b981",
  "#f97316",
  "#e11d48",
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
  "#6366f1",
];

export const sampleProcesses = [
  { id: "P1", arrivalTime: 0, burstTime: 8 },
  { id: "P2", arrivalTime: 1, burstTime: 4 },
  { id: "P3", arrivalTime: 2, burstTime: 9 },
  { id: "P4", arrivalTime: 3, burstTime: 5 },
];

export const roundRobinSampleProcesses = [
  { id: "P1", arrivalTime: 0, burstTime: 24 },
  { id: "P2", arrivalTime: 0, burstTime: 3 },
  { id: "P3", arrivalTime: 0, burstTime: 3 },
];

export function withProcessColors(processes) {
  return processes.map((process, index) => ({
    ...process,
    color: process.color || PROCESS_COLORS[index % PROCESS_COLORS.length],
  }));
}
