import { motion } from "framer-motion";

export default function GanttChart({ result }) {
  if (!result) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78">
        <p className="text-sm text-slate-500 dark:text-slate-400">Gantt Chart sẽ xuất hiện sau khi chạy mô phỏng.</p>
      </section>
    );
  }

  const totalTime = result.stats.totalSimulationTime || 1;
  const timeline = result.gantt.map((segment) => segment.start);
  timeline.push(result.gantt[result.gantt.length - 1].end);

  return (
    <section className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78">
      <div className="mb-4">
        <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Biểu đồ Gantt</p>
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Gantt Chart</h2>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[720px]">
          <div className="flex h-20 overflow-visible rounded-lg border border-slate-200 bg-slate-100 p-2 dark:border-slate-800 dark:bg-slate-900">
            {result.gantt.map((segment, index) => {
              const width = `${Math.max((segment.duration / totalTime) * 100, 5)}%`;
              return (
                <motion.div
                  key={segment.id}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: index * 0.08, duration: 0.35 }}
                  className="group relative flex origin-left items-center justify-center border-r border-white/60 px-2 text-center text-sm font-extrabold text-white last:border-r-0"
                  style={{
                    width,
                    backgroundColor: segment.color,
                  }}
                >
                  <span className="truncate">{segment.label}</span>
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-44 -translate-x-1/2 rounded-md bg-slate-950 px-3 py-2 text-left text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 dark:bg-white dark:text-slate-950">
                    <div>Process ID: {segment.label}</div>
                    <div>Start Time: {segment.start}</div>
                    <div>End Time: {segment.end}</div>
                    <div>Duration: {segment.duration}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="relative mt-3 h-8">
            {result.gantt.map((segment, index) => {
              const left = `${(segment.start / totalTime) * 100}%`;
              return (
                <span
                  key={`${segment.id}-time`}
                  className={`absolute top-0 text-xs font-semibold text-slate-500 dark:text-slate-400 ${
                    index === 0 ? "" : "-translate-x-1/2"
                  }`}
                  style={{ left: index === 0 ? "0%" : left }}
                >
                  {segment.start}
                </span>
              );
            })}
            <span className="absolute right-0 top-0 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {timeline[timeline.length - 1]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function renderGanttChart(props) {
  return <GanttChart {...props} />;
}
