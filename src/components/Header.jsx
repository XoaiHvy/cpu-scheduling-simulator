import { Moon, Sun, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function Header({ darkMode, onToggleDarkMode }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-slate-200 bg-white/78 px-5 py-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/72"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-sky-600 text-white shadow-soft">
            <Cpu size={26} />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">Hệ điều hành</p>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white md:text-5xl">
              CPU Scheduling Simulator
            </h1>
            <p className="mt-2 max-w-3xl text-base text-slate-600 dark:text-slate-300">
              Mô phỏng các thuật toán lập lịch CPU trong hệ điều hành
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </motion.header>
  );
}
