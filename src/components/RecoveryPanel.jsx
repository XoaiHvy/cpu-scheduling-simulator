import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Scissors, ShieldX, Unlock } from "lucide-react";

export default function RecoveryPanel({
  processes,
  resources,
  edges,
  detection,
  detectionIsCurrent,
  onKillProcess,
  onReleaseResource,
}) {
  const active = detectionIsCurrent && detection.hasDeadlock;
  const cycleProcesses = useMemo(
    () => processes.filter((process) => detection.cycleProcesses.includes(process.id)),
    [detection.cycleProcesses, processes],
  );
  const allocatedResources = useMemo(
    () => resources.filter((resource) => edges.some((edge) => edge.type === "allocation" && edge.from === resource.id)),
    [edges, resources],
  );

  const [selectedProcess, setSelectedProcess] = useState("");
  const [selectedResource, setSelectedResource] = useState("");

  useEffect(() => {
    const fallback = cycleProcesses[0]?.id ?? processes[0]?.id ?? "";
    if (!processes.some((process) => process.id === selectedProcess)) setSelectedProcess(fallback);
  }, [cycleProcesses, processes, selectedProcess]);

  useEffect(() => {
    const cycleResource = resources.find((resource) => detection.cycleResources.includes(resource.id));
    const fallback = cycleResource?.id ?? allocatedResources[0]?.id ?? "";
    if (!resources.some((resource) => resource.id === selectedResource)) setSelectedResource(fallback);
  }, [allocatedResources, detection.cycleResources, resources, selectedResource]);

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel">
      <div className="panel-heading">
        <p className="panel-kicker">Recovery Panel</p>
        <h2 className="panel-title">Khôi phục sau deadlock</h2>
      </div>

      <div className="mb-4 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <Unlock size={18} className="mt-0.5 shrink-0 text-emerald-600" />
        <p>
          {active
            ? "Deadlock đang tồn tại. Recovery sẽ tự chạy Detect lại sau mỗi thao tác."
            : detection.status === "resolved"
              ? "Deadlock resolved. Graph hiện không còn chu trình."
              : "Recovery bật sau khi Detect phát hiện deadlock."}
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="field-label" htmlFor="kill-process">
            Kill process
          </label>
          <div className="flex gap-2">
            <select
              id="kill-process"
              value={selectedProcess}
              disabled={!active}
              onChange={(event) => setSelectedProcess(event.target.value)}
              className="field disabled:opacity-50"
            >
              {(cycleProcesses.length ? cycleProcesses : processes).map((process) => (
                <option key={process.id} value={process.id}>
                  {process.id} · {process.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!active || !selectedProcess}
              onClick={() => onKillProcess(selectedProcess)}
              className="btn-danger w-12 justify-center px-0 disabled:cursor-not-allowed disabled:opacity-45"
              title="Kill process"
              aria-label="Kill process"
            >
              <ShieldX size={18} />
            </button>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="release-resource">
            Release resource
          </label>
          <div className="flex gap-2">
            <select
              id="release-resource"
              value={selectedResource}
              disabled={!active || !allocatedResources.length}
              onChange={(event) => setSelectedResource(event.target.value)}
              className="field disabled:opacity-50"
            >
              {allocatedResources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.id} · held by {resource.allocatedTo.join(", ")}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!active || !selectedResource}
              onClick={() => onReleaseResource(selectedResource)}
              className="btn-secondary w-12 justify-center px-0 disabled:cursor-not-allowed disabled:opacity-45"
              title="Release resource"
              aria-label="Release resource"
            >
              <Scissors size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
