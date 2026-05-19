import { motion } from "framer-motion";
import { Cpu, Moon, Network, Sun } from "lucide-react";

export default function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950">
            <Network size={30} />
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <Cpu size={16} />
              <span>Hệ điều hành · Resource Allocation Graph</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white md:text-5xl">Deadlock Simulator</h1>
            <p className="mt-2 max-w-2xl text-base font-medium text-slate-600 dark:text-slate-300">
              Mô phỏng hiện tượng bế tắc tài nguyên trong hệ điều hành
            </p>
          </div>
        </motion.div>

        <button
          type="button"
          onClick={onToggleDarkMode}
          aria-label={darkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
          title={darkMode ? "Giao diện sáng" : "Giao diện tối"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
