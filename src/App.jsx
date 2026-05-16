import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import AlgorithmSelector from "./components/AlgorithmSelector";
import ComparisonTable from "./components/ComparisonTable";
import ExplanationPanel from "./components/ExplanationPanel";
import GanttChart from "./components/GanttChart";
import Glossary from "./components/Glossary";
import Header from "./components/Header";
import ProcessInputTable from "./components/ProcessInputTable";
import ResultTable from "./components/ResultTable";
import SimulationBoard from "./components/SimulationBoard";
import StatsCards from "./components/StatsCards";
import { sampleProcesses, roundRobinSampleProcesses, withProcessColors } from "./data/sampleProcesses";
import { runSchedulingAlgorithm } from "./utils/schedulingAlgorithms";

function validateInputs(processes, algorithm, timeQuantum) {
  if (!processes.length) return "Cần có ít nhất một tiến trình.";

  const ids = new Set();
  for (const process of processes) {
    if (!String(process.id).trim()) return "Process ID không được để trống.";
    if (ids.has(process.id)) return `Process ID ${process.id} bị trùng.`;
    ids.add(process.id);
    if (Number(process.arrivalTime) < 0 || Number.isNaN(Number(process.arrivalTime))) {
      return `Arrival Time của ${process.id} phải >= 0.`;
    }
    if (Number(process.burstTime) <= 0 || Number.isNaN(Number(process.burstTime))) {
      return `Burst Time của ${process.id} phải > 0.`;
    }
  }

  if (algorithm === "RR" && (Number(timeQuantum) <= 0 || Number.isNaN(Number(timeQuantum)))) {
    return "Time Quantum phải > 0.";
  }

  return "";
}

function buildObservation(result) {
  if (!result) return [];

  const order = result.gantt.filter((segment) => segment.type === "process").map((segment) => segment.processId);
  const uniqueOrder = [...new Set(order)];
  const averageWaiting = result.stats.averageWaitingTime;
  const longestProcess = [...result.processes].sort((a, b) => b.burstTime - a.burstTime)[0];
  const switchCount = Math.max(0, result.gantt.filter((segment) => segment.type === "process").length - 1);

  if (result.algorithm === "FCFS") {
    return [
      `Thứ tự chạy: ${uniqueOrder.join(" → ")}.`,
      `${longestProcess.id} có Burst Time lớn nhất (${longestProcess.burstTime}), nên nếu đến sớm sẽ làm các tiến trình sau chờ lâu.`,
      averageWaiting >= 8
        ? "Average Waiting Time khá cao, đây là dấu hiệu của Convoy Effect."
        : "Average Waiting Time ở mức dễ chấp nhận với bộ dữ liệu hiện tại.",
    ];
  }

  if (result.algorithm === "SJF") {
    return [
      `Thứ tự chạy: ${uniqueOrder.join(" → ")}.`,
      "Các tiến trình ngắn được ưu tiên khi đã nằm trong Ready Queue, nên Waiting Time trung bình thường tốt hơn FCFS.",
      "Hạn chế chính: hệ thống cần biết hoặc dự đoán Burst Time trước khi lập lịch.",
    ];
  }

  return [
    `Time Quantum đang dùng: ${result.timeQuantum}.`,
    `Số lượt chuyển CPU trong Gantt Chart: ${switchCount}. Quantum nhỏ thường làm số lượt chuyển nhiều hơn.`,
    "Round Robin công bằng vì mỗi tiến trình đều được nhận CPU theo từng lát thời gian.",
    result.timeQuantum >= longestProcess.burstTime
      ? "Quantum khá lớn, hành vi có xu hướng gần giống FCFS."
      : "Quantum hiện tại giúp tiến trình ngắn có cơ hội phản hồi sớm.",
  ];
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onClose, 3600);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.96 }}
          className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-soft ${
            toast.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
              : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
          }`}
        >
          {toast.type === "error" ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
          <p className="text-sm font-semibold">{toast.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("FCFS");
  const [timeQuantum, setTimeQuantum] = useState(4);
  const [processes, setProcesses] = useState(() => withProcessColors(sampleProcesses));
  const [result, setResult] = useState(null);
  const [runId, setRunId] = useState(0);
  const [toast, setToast] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const coloredProcesses = useMemo(() => withProcessColors(processes), [processes]);

  useEffect(() => {
    setProcesses((current) => withProcessColors(current));
  }, []);

  const showToast = (message, type = "success") => setToast({ message, type });

  const runSimulation = () => {
    const nextProcesses = withProcessColors(processes).map((process) => ({
      ...process,
      id: String(process.id).trim(),
      arrivalTime: Number(process.arrivalTime),
      burstTime: Number(process.burstTime),
    }));

    const error = validateInputs(nextProcesses, selectedAlgorithm, timeQuantum);
    if (error) {
      showToast(error, "error");
      return;
    }

    const nextResult = runSchedulingAlgorithm(selectedAlgorithm, nextProcesses, timeQuantum);
    setProcesses(nextProcesses);
    setResult(nextResult);
    setRunId((current) => current + 1);
    showToast("Mô phỏng đã chạy xong.");

    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 180);
  };

  const loadSample = () => {
    setProcesses(withProcessColors(sampleProcesses));
    showToast("Đã tải dữ liệu mẫu.");
  };

  const loadRoundRobinSample = () => {
    setProcesses(withProcessColors(roundRobinSampleProcesses));
    setTimeQuantum(4);
    showToast("Đã tải dữ liệu mẫu Round Robin.");
  };

  const reset = () => {
    setProcesses([]);
    setResult(null);
    setRunId((current) => current + 1);
    showToast("Đã reset dữ liệu.");
  };

  const observations = buildObservation(result);

  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100">
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((current) => !current)} />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-5">
            <ProcessInputTable
              processes={coloredProcesses}
              setProcesses={setProcesses}
              selectedAlgorithm={selectedAlgorithm}
              setSelectedAlgorithm={setSelectedAlgorithm}
              timeQuantum={timeQuantum}
              setTimeQuantum={setTimeQuantum}
              onRun={runSimulation}
              onLoadSample={loadSample}
              onLoadRoundRobinSample={loadRoundRobinSample}
              onReset={reset}
            />
            <AlgorithmSelector selectedAlgorithm={selectedAlgorithm} onSelect={setSelectedAlgorithm} />
          </div>
          <ExplanationPanel selectedAlgorithm={selectedAlgorithm} />
        </section>

        <SimulationBoard result={result} runId={runId} />

        <div ref={resultRef} className="grid gap-5">
          <GanttChart result={result} />
          <StatsCards result={result} />
          <ResultTable result={result} />

          {result && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78"
            >
              <div className="mb-3">
                <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Nhận xét sau khi chạy</p>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">Giải thích kết quả</h2>
              </div>
              <ul className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                {observations.map((observation) => (
                  <li
                    key={observation}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/80"
                  >
                    {observation}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}
        </div>

        <ComparisonTable />
        <Glossary />
      </main>
    </div>
  );
}
