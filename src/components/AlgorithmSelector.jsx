import { AlarmClock, ListChecks, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const algorithms = [
  {
    id: "FCFS",
    name: "FCFS",
    subtitle: "First Come First Served",
    type: "Non-preemptive",
    icon: ListChecks,
  },
  {
    id: "SJF",
    name: "SJF",
    subtitle: "Shortest Job First",
    type: "Non-preemptive",
    icon: AlarmClock,
  },
  {
    id: "RR",
    name: "Round Robin",
    subtitle: "Time Quantum",
    type: "Preemptive",
    icon: RotateCcw,
  },
];

export default function AlgorithmSelector({ selectedAlgorithm, onSelect }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Khu vực chọn thuật toán</p>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Algorithm Selector</h2>
        </div>
        <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {selectedAlgorithm}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {algorithms.map((algorithm) => {
          const Icon = algorithm.icon;
          const isActive = selectedAlgorithm === algorithm.id;

          return (
            <motion.button
              key={algorithm.id}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(algorithm.id)}
              className={`rounded-lg border p-4 text-left transition ${
                isActive
                  ? "border-sky-400 bg-sky-50 shadow-md dark:border-sky-500 dark:bg-sky-950/60"
                  : "border-slate-200 bg-slate-50 hover:border-sky-200 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-sky-700"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-lg ${
                    isActive ? "bg-sky-600 text-white" : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {algorithm.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">{algorithm.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{algorithm.subtitle}</p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
