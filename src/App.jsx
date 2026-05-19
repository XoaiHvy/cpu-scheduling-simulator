import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";
import GraphCanvas from "./components/GraphCanvas";
import StatusPanel from "./components/StatusPanel";
import EventLog from "./components/EventLog";
import TheoryPanel from "./components/TheoryPanel";
import RecoveryPanel from "./components/RecoveryPanel";
import ScenarioButtons from "./components/ScenarioButtons";
import { detectDeadlock, enrichGraph } from "./utils/deadlockDetection";
import { sampleScenarios } from "./utils/sampleScenarios";

const emptyDetection = {
  ...detectDeadlock([], [], []),
  checked: false,
  version: 0,
};

function makeLog(message, type = "info") {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    time: new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date()),
    message,
    type,
  };
}

function nextEntityId(prefix, items) {
  const pattern = new RegExp(`^${prefix}(\\d+)$`);
  const max = items.reduce((largest, item) => {
    const match = pattern.exec(item.id);
    return match ? Math.max(largest, Number(match[1])) : largest;
  }, 0);
  return `${prefix}${max + 1}`;
}

function makeEdgeId(type, from, to, index) {
  return `E${index + 1}-${type}-${from}-${to}`;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [model, setModel] = useState({
    processes: [],
    resources: [],
    edges: [],
    version: 0,
  });
  const [detection, setDetection] = useState(emptyDetection);
  const [eventLog, setEventLog] = useState(() => [
    makeLog("Sẵn sàng mô phỏng Deadlock bằng Resource Allocation Graph.", "info"),
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const addLog = (message, type = "info") => {
    setEventLog((current) => [...current, makeLog(message, type)].slice(-80));
  };

  const liveAnalysis = useMemo(
    () => detectDeadlock(model.processes, model.resources, model.edges),
    [model.processes, model.resources, model.edges],
  );

  const detectionIsCurrent = detection.checked && detection.version === model.version;

  const displayDetection = useMemo(() => {
    if (detectionIsCurrent) return detection;

    const hasData = model.processes.length > 0 || model.resources.length > 0;
    return {
      ...liveAnalysis,
      checked: false,
      hasDeadlock: false,
      cycleProcesses: [],
      cycleResources: [],
      cycleEdgeIds: [],
      status: hasData ? (liveAnalysis.waitForEdges.length ? "waiting" : "safe") : "idle",
      message: hasData ? "Chưa chạy Detect sau thay đổi." : "Chưa có dữ liệu mô phỏng.",
      version: model.version,
    };
  }, [detection, detectionIsCurrent, liveAnalysis, model.processes.length, model.resources.length, model.version]);

  const graphSnapshot = useMemo(
    () => enrichGraph(model.processes, model.resources, model.edges, displayDetection),
    [model.processes, model.resources, model.edges, displayDetection],
  );

  const markDirty = (nextModel) => {
    setModel(nextModel);
    setDetection((current) => ({ ...current, checked: false }));
  };

  const handleAddProcess = () => {
    const id = nextEntityId("P", model.processes);
    const nextVersion = model.version + 1;
    markDirty({
      ...model,
      processes: [
        ...model.processes,
        {
          id,
          name: `Process ${id.slice(1)}`,
          status: "normal",
          heldResources: [],
          waitingFor: [],
        },
      ],
      version: nextVersion,
    });
    addLog(`Tạo process ${id}.`, "success");
  };

  const handleAddResource = () => {
    const id = nextEntityId("R", model.resources);
    const nextVersion = model.version + 1;
    markDirty({
      ...model,
      resources: [
        ...model.resources,
        {
          id,
          name: `Resource ${id.slice(1)}`,
          instances: 1,
          allocatedTo: [],
          requestedBy: [],
        },
      ],
      version: nextVersion,
    });
    addLog(`Tạo resource ${id}.`, "success");
  };

  const handleAddEdge = ({ type, processId, resourceId }) => {
    if (!processId || !resourceId) {
      addLog("Cần có ít nhất một process và một resource để tạo cạnh.", "warning");
      return;
    }

    const from = type === "request" ? processId : resourceId;
    const to = type === "request" ? resourceId : processId;
    const edgeExists = model.edges.some((edge) => edge.type === type && edge.from === from && edge.to === to);

    if (edgeExists) {
      addLog(`Cạnh ${from} -> ${to} đã tồn tại.`, "warning");
      return;
    }

    if (type === "allocation") {
      const holder = model.edges.find((edge) => edge.type === "allocation" && edge.from === resourceId);
      if (holder) {
        addLog(`${resourceId} đã được cấp cho ${holder.to}; resource mẫu chỉ có 1 instance.`, "warning");
        return;
      }
    }

    if (type === "request") {
      const alreadyHeld = model.edges.some(
        (edge) => edge.type === "allocation" && edge.from === resourceId && edge.to === processId,
      );
      if (alreadyHeld) {
        addLog(`${processId} đang giữ ${resourceId}, không cần tạo request edge.`, "warning");
        return;
      }
    }

    const cleanedEdges =
      type === "allocation"
        ? model.edges.filter(
            (edge) => !(edge.type === "request" && edge.from === processId && edge.to === resourceId),
          )
        : model.edges;

    const edge = {
      id: makeEdgeId(type, from, to, cleanedEdges.length),
      type,
      from,
      to,
    };

    const nextVersion = model.version + 1;
    markDirty({
      ...model,
      edges: [...cleanedEdges, edge],
      version: nextVersion,
    });

    const label = type === "request" ? "request" : "allocation";
    addLog(`Tạo ${label} edge: ${from} -> ${to}.`, "info");
  };

  const handleDetect = () => {
    const result = detectDeadlock(model.processes, model.resources, model.edges);
    setDetection({
      ...result,
      checked: true,
      version: model.version,
    });

    const type = result.hasDeadlock ? "danger" : result.status === "waiting" ? "warning" : "success";
    addLog(result.message, type);
  };

  const handleReset = () => {
    const nextVersion = model.version + 1;
    setModel({
      processes: [],
      resources: [],
      edges: [],
      version: nextVersion,
    });
    setDetection({
      ...detectDeadlock([], [], []),
      checked: false,
      version: nextVersion,
    });
    addLog("Reset mô phỏng.", "info");
  };

  const handleLoadScenario = (scenarioId) => {
    const scenario = sampleScenarios.find((item) => item.id === scenarioId);
    if (!scenario) return;

    const nextVersion = model.version + 1;
    setModel({
      processes: scenario.processes,
      resources: scenario.resources,
      edges: scenario.edges,
      version: nextVersion,
    });
    setDetection({
      ...detectDeadlock(scenario.processes, scenario.resources, scenario.edges),
      checked: false,
      version: nextVersion,
    });
    addLog(`Load ${scenario.title}. Bấm Detect Deadlock để kiểm tra chu trình.`, "info");
  };

  const runRecoveryDetection = (nextModel, actionMessage) => {
    const result = detectDeadlock(nextModel.processes, nextModel.resources, nextModel.edges);
    const resolved = detectionIsCurrent && detection.hasDeadlock && !result.hasDeadlock;
    const finalResult = {
      ...result,
      checked: true,
      version: nextModel.version,
      status: resolved ? "resolved" : result.status,
      message: resolved ? "Deadlock resolved - không còn chu trình trong Wait-for Graph." : result.message,
    };

    setModel(nextModel);
    setDetection(finalResult);
    addLog(`${actionMessage} ${finalResult.message}`, resolved ? "success" : result.hasDeadlock ? "danger" : "warning");
  };

  const handleKillProcess = (processId) => {
    if (!processId) return;

    const nextModel = {
      ...model,
      processes: model.processes.filter((process) => process.id !== processId),
      edges: model.edges.filter((edge) => edge.from !== processId && edge.to !== processId),
      version: model.version + 1,
    };

    runRecoveryDetection(nextModel, `Kill ${processId}: thu hồi tài nguyên và xóa cạnh liên quan.`);
  };

  const handleReleaseResource = (resourceId) => {
    if (!resourceId) return;

    const releasedEdges = model.edges.filter((edge) => edge.type === "allocation" && edge.from === resourceId);
    if (!releasedEdges.length) {
      addLog(`${resourceId} chưa được cấp cho process nào.`, "warning");
      return;
    }

    const nextModel = {
      ...model,
      edges: model.edges.filter((edge) => !(edge.type === "allocation" && edge.from === resourceId)),
      version: model.version + 1,
    };

    runRecoveryDetection(nextModel, `Release ${resourceId}: gỡ allocation edge.`);
  };

  return (
    <div className="min-h-screen font-sans text-slate-950 dark:text-slate-100">
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((current) => !current)} />

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <ScenarioButtons scenarios={sampleScenarios} onLoadScenario={handleLoadScenario} />

        <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)_330px]">
          <ControlPanel
            processes={graphSnapshot.processes}
            resources={graphSnapshot.resources}
            nextProcessId={nextEntityId("P", model.processes)}
            nextResourceId={nextEntityId("R", model.resources)}
            onAddProcess={handleAddProcess}
            onAddResource={handleAddResource}
            onAddEdge={handleAddEdge}
            onDetect={handleDetect}
            onReset={handleReset}
          />

          <GraphCanvas
            processes={graphSnapshot.processes}
            resources={graphSnapshot.resources}
            edges={model.edges}
            detection={displayDetection}
            pending={!detectionIsCurrent}
          />

          <div className="grid gap-5">
            <StatusPanel
              detection={displayDetection}
              detectionIsCurrent={detectionIsCurrent}
              processCount={model.processes.length}
              resourceCount={model.resources.length}
              edgeCount={model.edges.length}
            />
            <RecoveryPanel
              processes={graphSnapshot.processes}
              resources={graphSnapshot.resources}
              edges={model.edges}
              detection={displayDetection}
              detectionIsCurrent={detectionIsCurrent}
              onKillProcess={handleKillProcess}
              onReleaseResource={handleReleaseResource}
            />
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <TheoryPanel />
          <EventLog logs={eventLog} />
        </section>
      </main>
    </div>
  );
}
