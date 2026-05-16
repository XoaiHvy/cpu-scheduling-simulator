import { Database, Play, Plus, RotateCcw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProcessInputTable({
  processes,
  setProcesses,
  selectedAlgorithm,
  setSelectedAlgorithm,
  timeQuantum,
  setTimeQuantum,
  onRun,
  onLoadSample,
  onLoadRoundRobinSample,
  onReset,
}) {
  const updateProcess = (index, field, value) => {
    setProcesses((current) =>
      current.map((process, currentIndex) =>
        currentIndex === index
          ? {
              ...process,
              [field]: field === "id" ? value : Number(value),
            }
          : process
      )
    );
  };

  const addProcess = () => {
    setProcesses((current) => [
      ...current,
      {
        id: `P${current.length + 1}`,
        arrivalTime: 0,
        burstTime: 1,
      },
    ]);
  };

  const removeProcess = (index) => {
    setProcesses((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Khu vực nhập tiến trình</p>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Process Input Table</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Database size={16} />
            Tải dữ liệu mẫu
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedAlgorithm("RR");
              onLoadRoundRobinSample();
            }}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <RotateCcw size={16} />
            Mẫu Round Robin
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200"
          >
            <Trash2 size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <th className="px-3 py-2">Màu</th>
              <th className="px-3 py-2">Process ID</th>
              <th className="px-3 py-2">Arrival Time</th>
              <th className="px-3 py-2">Burst Time</th>
              <th className="px-3 py-2 text-right">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <motion.tr
                key={`${process.id}-${index}`}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 text-sm shadow-sm dark:bg-slate-900/80"
              >
                <td className="rounded-l-lg px-3 py-2">
                  <span className="block h-5 w-5 rounded-md" style={{ backgroundColor: process.color }} />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={process.id}
                    onChange={(event) => updateProcess(index, "id", event.target.value)}
                    className="w-28 rounded-md border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    value={process.arrivalTime}
                    onChange={(event) => updateProcess(index, "arrivalTime", event.target.value)}
                    className="w-32 rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="1"
                    value={process.burstTime}
                    onChange={(event) => updateProcess(index, "burstTime", event.target.value)}
                    className="w-32 rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </td>
                <td className="rounded-r-lg px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeProcess(index)}
                    className="inline-grid h-9 w-9 place-items-center rounded-md border border-rose-200 bg-white text-rose-600 transition hover:-translate-y-0.5 dark:border-rose-900 dark:bg-slate-950 dark:text-rose-300"
                    aria-label={`Xóa ${process.id}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addProcess}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
          >
            <Plus size={17} />
            Thêm tiến trình
          </button>
          <button
            type="button"
            onClick={onRun}
            className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-700"
          >
            <Play size={17} />
            Run Simulation
          </button>
        </div>

        {selectedAlgorithm === "RR" && (
          <label className="flex w-full flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 sm:max-w-xs">
            Time Quantum
            <input
              type="number"
              min="1"
              value={timeQuantum}
              onChange={(event) => setTimeQuantum(Number(event.target.value))}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        )}
      </div>
    </section>
  );
}
