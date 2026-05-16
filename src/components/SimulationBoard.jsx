import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Cpu, Gauge, ListTree, Pause, Play, SkipForward } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const speedOptions = {
  slow: { label: "Chậm", interval: 1400 },
  medium: { label: "Vừa", interval: 850 },
  fast: { label: "Nhanh", interval: 430 },
};

function buildFrames(result) {
  if (!result?.gantt?.length) return [];

  const frames = result.gantt.map((segment, index) => {
    const executedBefore = new Map();
    result.gantt.slice(0, index).forEach((item) => {
      if (item.type === "process") {
        executedBefore.set(item.processId, (executedBefore.get(item.processId) || 0) + item.duration);
      }
    });

    const completed = result.processes
      .filter((process) => (executedBefore.get(process.id) || 0) >= process.burstTime)
      .map((process) => process.id);

    const runningId = segment.type === "process" ? segment.processId : null;

    const readyQueue = result.processes
      .filter((process) => {
        const executed = executedBefore.get(process.id) || 0;
        return process.arrivalTime <= segment.start && executed < process.burstTime && process.id !== runningId;
      })
      .map((process) => process.id);

    return {
      time: segment.start,
      segment,
      readyQueue,
      runningId,
      completed,
      progressLabel: `${segment.start} → ${segment.end}`,
    };
  });

  const finalCompleted = result.processes.map((process) => process.id);
  const last = result.gantt[result.gantt.length - 1];

  return [
    ...frames,
    {
      time: last.end,
      segment: null,
      readyQueue: [],
      runningId: null,
      completed: finalCompleted,
      progressLabel: `Hoàn thành tại t=${last.end}`,
    },
  ];
}

export default function SimulationBoard({ result, runId }) {
  const [speed, setSpeed] = useState("medium");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frames = useMemo(() => buildFrames(result), [result]);
  const frame = frames[step];
  const colorMap = useMemo(
    () => new Map((result?.processes || []).map((process) => [process.id, process.color])),
    [result]
  );

  useEffect(() => {
    setStep(0);
    setPlaying(Boolean(result));
  }, [result, runId]);

  useEffect(() => {
    if (!playing || !frames.length) return undefined;

    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current >= frames.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, speedOptions[speed].interval);

    return () => window.clearInterval(timer);
  }, [playing, speed, frames.length]);

  const nextStep = () => {
    setPlaying(false);
    setStep((current) => Math.min(current + 1, frames.length - 1));
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Khu vực mô phỏng bằng animation</p>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Simulation Board</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(speedOptions).map(([key, option]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSpeed(key)}
              className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                speed === key
                  ? "border-sky-500 bg-sky-600 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              {option.label}
            </button>
          ))}
          <button
            type="button"
            disabled={!frames.length}
            onClick={() => setPlaying((current) => !current)}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? "Pause" : "Play Simulation"}
          </button>
          <button
            type="button"
            disabled={!frames.length}
            onClick={nextStep}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <SkipForward size={16} />
            Step Next
          </button>
        </div>
      </div>

      {!result ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Nhập dữ liệu rồi bấm Run Simulation để xem tiến trình di chuyển qua Ready Queue, CPU và Completed.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr_1fr]">
          <QueuePanel
            title="Ready Queue"
            icon={ListTree}
            items={frame?.readyQueue || []}
            colorMap={colorMap}
            badge="Waiting"
          />

          <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/40">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-sky-900 dark:text-sky-100">
                <Cpu size={18} />
                CPU
              </div>
              <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-sky-700 dark:bg-slate-950 dark:text-sky-200">
                {frame?.progressLabel}
              </span>
            </div>

            <div className="grid min-h-32 place-items-center rounded-lg border border-sky-200 bg-white p-3 dark:border-sky-800 dark:bg-slate-950">
              <AnimatePresence mode="wait">
                {frame?.runningId ? (
                  <motion.div
                    key={`${frame.runningId}-${step}`}
                    initial={{ opacity: 0, scale: 0.82, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full rounded-lg border p-4 text-center shadow-soft"
                    style={{
                      borderColor: colorMap.get(frame.runningId),
                      backgroundColor: `${colorMap.get(frame.runningId)}18`,
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 1.1 }}
                      className="text-2xl font-extrabold"
                      style={{ color: colorMap.get(frame.runningId) }}
                    >
                      {frame.runningId}
                    </motion.div>
                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Running</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`idle-${step}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-slate-500 dark:text-slate-400"
                  >
                    Idle
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-md bg-white dark:bg-slate-900">
              <motion.div
                key={`${step}-${playing}`}
                initial={{ width: "0%" }}
                animate={{ width: frame?.runningId || frame?.segment?.type === "idle" ? "100%" : "0%" }}
                transition={{ duration: playing ? speedOptions[speed].interval / 1000 : 0.35, ease: "linear" }}
                className="h-full bg-sky-500"
              />
            </div>
          </div>

          <QueuePanel
            title="Completed"
            icon={CheckCircle2}
            items={frame?.completed || []}
            colorMap={colorMap}
            badge="Completed"
          />
        </div>
      )}
    </section>
  );
}

function QueuePanel({ title, icon: Icon, items, colorMap, badge }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/72">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Icon size={18} />
          {title}
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-950 dark:text-slate-300">
          <Gauge size={13} />
          {badge}
        </span>
      </div>
      <div className="flex min-h-32 flex-wrap content-start gap-2 rounded-lg border border-dashed border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
        <AnimatePresence>
          {items.map((id) => (
            <motion.div
              key={`${title}-${id}`}
              layout
              initial={{ opacity: 0, x: -14, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 14, scale: 0.92 }}
              className="h-fit rounded-md px-3 py-2 text-sm font-extrabold text-white shadow-sm"
              style={{ backgroundColor: colorMap.get(id) || "#64748b" }}
            >
              {id}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function renderSimulationBoard(props) {
  return <SimulationBoard {...props} />;
}
