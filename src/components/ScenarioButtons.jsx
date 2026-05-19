import { motion } from "framer-motion";
import { Boxes, GitCompareArrows, Route } from "lucide-react";

const icons = [GitCompareArrows, Route, Boxes];

export default function ScenarioButtons({ scenarios, onLoadScenario }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 md:grid-cols-3">
      {scenarios.map((scenario, index) => {
        const Icon = icons[index] ?? Boxes;
        return (
          <button
            key={scenario.id}
            type="button"
            onClick={() => onLoadScenario(scenario.id)}
            className="group rounded-lg border border-slate-200 bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-700 dark:hover:bg-slate-900"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-extrabold text-slate-950 dark:text-white">{scenario.title}</p>
                <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">{scenario.subtitle}</p>
              </div>
            </div>
            <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">{scenario.description}</p>
          </button>
        );
      })}
    </motion.section>
  );
}
