import { motion } from "framer-motion";
import { AlertOctagon, CheckCircle2, Clock3, HelpCircle, ShieldCheck } from "lucide-react";

const statusCopy = {
  idle: {
    label: "Idle",
    icon: HelpCircle,
    className: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
  },
  safe: {
    label: "No deadlock",
    icon: ShieldCheck,
    className: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
  },
  waiting: {
    label: "Waiting",
    icon: Clock3,
    className: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
  },
  deadlock: {
    label: "Deadlock detected",
    icon: AlertOctagon,
    className: "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100",
  },
  resolved: {
    label: "Deadlock resolved",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
  },
};

export default function StatusPanel({ detection, detectionIsCurrent, processCount, resourceCount, edgeCount }) {
  const copy = statusCopy[detection.status] ?? statusCopy.idle;
  const Icon = copy.icon;

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel">
      <div className="panel-heading">
        <p className="panel-kicker">Status Panel</p>
        <h2 className="panel-title">Trạng thái hệ thống</h2>
      </div>

      <div className={`rounded-lg border p-4 ${copy.className}`}>
        <div className="flex items-start gap-3">
          <Icon size={26} className={detection.status === "deadlock" ? "animate-pulse" : ""} />
          <div>
            <p className="text-lg font-extrabold">{copy.label}</p>
            <p className="mt-1 text-sm font-semibold opacity-90">{detection.message}</p>
          </div>
        </div>
      </div>

      {!detectionIsCurrent && (processCount > 0 || resourceCount > 0 || edgeCount > 0) && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          Graph đã thay đổi; kết quả Detect cũ không còn được dùng để highlight.
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric label="Process" value={processCount} />
        <Metric label="Resource" value={resourceCount} />
        <Metric label="Edge" value={edgeCount} />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Wait-for Graph</p>
        <div className="grid gap-2">
          {detection.waitForEdges.length ? (
            detection.waitForEdges.map((edge) => (
              <div
                key={`${edge.from}-${edge.to}-${edge.resourceId}`}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {edge.from} -&gt; {edge.to} <span className="text-slate-500 dark:text-slate-400">qua {edge.resourceId}</span>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              Không có cạnh chờ.
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xl font-extrabold text-slate-950 dark:text-white">{value}</p>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
