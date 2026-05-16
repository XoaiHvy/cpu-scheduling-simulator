import { Activity, BarChart3, Cpu, Timer, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const statConfig = [
  { key: "averageWaitingTime", label: "Average Waiting Time", icon: Timer, suffix: "" },
  { key: "averageTurnaroundTime", label: "Average Turnaround Time", icon: BarChart3, suffix: "" },
  { key: "averageResponseTime", label: "Average Response Time", icon: Activity, suffix: "" },
  { key: "cpuUtilization", label: "CPU Utilization", icon: Cpu, suffix: "%" },
  { key: "throughput", label: "Throughput", icon: TrendingUp, suffix: "/time" },
];

export default function StatsCards({ result }) {
  if (!result) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78">
        <p className="text-sm text-slate-500 dark:text-slate-400">Thống kê trung bình sẽ xuất hiện sau khi chạy.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78">
      <div className="mb-4">
        <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Khu vực thống kê trung bình</p>
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Statistics</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {statConfig.map((stat, index) => {
          const Icon = stat.icon;
          const value = result.stats[stat.key];
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{stat.label}</span>
                <Icon size={18} className="text-sky-600 dark:text-sky-300" />
              </div>
              <div className="text-2xl font-extrabold text-slate-950 dark:text-white">
                {value.toFixed(2)}
                <span className="ml-1 text-sm font-bold text-slate-500">{stat.suffix}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export function renderStats(props) {
  return <StatsCards {...props} />;
}
