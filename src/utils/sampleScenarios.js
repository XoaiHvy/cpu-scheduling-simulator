const makeProcess = (id) => ({
  id,
  name: `Process ${id.slice(1)}`,
  status: "normal",
  heldResources: [],
  waitingFor: [],
});

const makeResource = (id) => ({
  id,
  name: `Resource ${id.slice(1)}`,
  instances: 1,
  allocatedTo: [],
  requestedBy: [],
});

export const sampleScenarios = [
  {
    id: "two-process-cycle",
    title: "Kịch bản 1",
    subtitle: "Deadlock vòng hai tiến trình",
    description: "P1 giữ R1 và chờ R2; P2 giữ R2 và chờ R1.",
    processes: ["P1", "P2"].map(makeProcess),
    resources: ["R1", "R2"].map(makeResource),
    edges: [
      { id: "S1-E1", type: "allocation", from: "R1", to: "P1" },
      { id: "S1-E2", type: "allocation", from: "R2", to: "P2" },
      { id: "S1-E3", type: "request", from: "P1", to: "R2" },
      { id: "S1-E4", type: "request", from: "P2", to: "R1" },
    ],
  },
  {
    id: "three-process-cycle",
    title: "Kịch bản 2",
    subtitle: "Deadlock vòng ba tiến trình",
    description: "P1 chờ P2, P2 chờ P3, P3 chờ P1 qua ba resource khác nhau.",
    processes: ["P1", "P2", "P3"].map(makeProcess),
    resources: ["R1", "R2", "R3"].map(makeResource),
    edges: [
      { id: "S2-E1", type: "allocation", from: "R1", to: "P1" },
      { id: "S2-E2", type: "allocation", from: "R2", to: "P2" },
      { id: "S2-E3", type: "allocation", from: "R3", to: "P3" },
      { id: "S2-E4", type: "request", from: "P1", to: "R2" },
      { id: "S2-E5", type: "request", from: "P2", to: "R3" },
      { id: "S2-E6", type: "request", from: "P3", to: "R1" },
    ],
  },
  {
    id: "waiting-no-cycle",
    title: "Kịch bản 3",
    subtitle: "Có chờ nhưng chưa deadlock",
    description: "P1 giữ R1; P2 yêu cầu R1. Wait-for Graph chưa có chu trình.",
    processes: ["P1", "P2"].map(makeProcess),
    resources: ["R1"].map(makeResource),
    edges: [
      { id: "S3-E1", type: "allocation", from: "R1", to: "P1" },
      { id: "S3-E2", type: "request", from: "P2", to: "R1" },
    ],
  },
];
