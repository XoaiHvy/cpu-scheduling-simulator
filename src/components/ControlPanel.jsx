import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CircleDot, GitBranchPlus, PlayCircle, Plus, RotateCcw, Square } from "lucide-react";

export default function ControlPanel({
  processes,
  resources,
  nextProcessId,
  nextResourceId,
  onAddProcess,
  onAddResource,
  onAddEdge,
  onDetect,
  onReset,
}) {
  const [edgeType, setEdgeType] = useState("allocation");
  const [processId, setProcessId] = useState("");
  const [resourceId, setResourceId] = useState("");

  useEffect(() => {
    if (!processes.some((process) => process.id === processId)) {
      setProcessId(processes[0]?.id ?? "");
    }
  }, [processId, processes]);

  useEffect(() => {
    if (!resources.some((resource) => resource.id === resourceId)) {
      setResourceId(resources[0]?.id ?? "");
    }
  }, [resourceId, resources]);

  const canCreateEdge = processes.length > 0 && resources.length > 0;

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel">
      <div className="panel-heading">
        <p className="panel-kicker">Control Panel</p>
        <h2 className="panel-title">Điều khiển mô phỏng</h2>
      </div>

      <div className="grid gap-3">
        <button type="button" onClick={onAddProcess} className="btn-primary">
          <Plus size={18} />
          <span>Tạo process {nextProcessId}</span>
        </button>

        <button type="button" onClick={onAddResource} className="btn-secondary">
          <Plus size={18} />
          <span>Tạo resource {nextResourceId}</span>
        </button>
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 dark:border-slate-800">
        <div>
          <label className="field-label" htmlFor="edge-type">
            Loại cạnh
          </label>
          <div id="edge-type" className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setEdgeType("allocation")}
              className={edgeType === "allocation" ? "segmented-active" : "segmented"}
            >
              <Square size={16} />
              Allocation
            </button>
            <button
              type="button"
              onClick={() => setEdgeType("request")}
              className={edgeType === "request" ? "segmented-active" : "segmented"}
            >
              <CircleDot size={16} />
              Request
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div>
            <label className="field-label" htmlFor="process-select">
              Process
            </label>
            <select
              id="process-select"
              value={processId}
              onChange={(event) => setProcessId(event.target.value)}
              className="field"
            >
              {processes.length ? (
                processes.map((process) => (
                  <option key={process.id} value={process.id}>
                    {process.id} · {process.name}
                  </option>
                ))
              ) : (
                <option value="">Chưa có process</option>
              )}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="resource-select">
              Resource
            </label>
            <select
              id="resource-select"
              value={resourceId}
              onChange={(event) => setResourceId(event.target.value)}
              className="field"
            >
              {resources.length ? (
                resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.id} · {resource.name}
                  </option>
                ))
              ) : (
                <option value="">Chưa có resource</option>
              )}
            </select>
          </div>
        </div>

        <button
          type="button"
          disabled={!canCreateEdge}
          onClick={() => onAddEdge({ type: edgeType, processId, resourceId })}
          className="btn-dark disabled:cursor-not-allowed disabled:opacity-45"
        >
          <GitBranchPlus size={18} />
          <span>{edgeType === "allocation" ? "Cấp Resource -> Process" : "Tạo Process -> Resource"}</span>
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
        <button type="button" onClick={onDetect} className="btn-danger">
          <PlayCircle size={18} />
          <span>Detect</span>
        </button>
        <button type="button" onClick={onReset} className="btn-muted">
          <RotateCcw size={18} />
          <span>Reset</span>
        </button>
      </div>
    </motion.section>
  );
}
