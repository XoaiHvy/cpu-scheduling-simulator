import { motion } from "framer-motion";
import { ListChecks } from "lucide-react";

const dotClass = {
  info: "bg-sky-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
};

export default function EventLog({ logs }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel">
      <div className="panel-heading">
        <p className="panel-kicker">Event Log</p>
        <div className="flex items-center gap-2">
          <ListChecks size={22} className="text-slate-500 dark:text-slate-300" />
          <h2 className="panel-title">Nhật ký thao tác</h2>
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto pr-1">
        <div className="grid gap-2">
          {[...logs].reverse().map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start gap-3">
                <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${dotClass[log.type] ?? dotClass.info}`} />
                <div>
                  <p className="text-xs font-bold text-slate-400">{log.time}</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{log.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
