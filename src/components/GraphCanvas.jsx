import { motion } from "framer-motion";
import { Activity, ArrowDownRight, ArrowUpRight } from "lucide-react";

const WIDTH = 1000;
const HEIGHT = 540;
const PROCESS_Y = 145;
const RESOURCE_Y = 370;
const PROCESS_RADIUS = 48;
const RESOURCE_WIDTH = 118;
const RESOURCE_HEIGHT = 72;

function distribute(items, y) {
  if (!items.length) return new Map();
  const margin = items.length === 1 ? 500 : 150;
  const span = items.length === 1 ? 0 : WIDTH - margin * 2;

  return new Map(
    items.map((item, index) => [
      item.id,
      {
        x: items.length === 1 ? WIDTH / 2 : margin + (span / (items.length - 1)) * index,
        y,
      },
    ]),
  );
}

function edgePath(edge, positions) {
  const source = positions.get(edge.from);
  const target = positions.get(edge.to);
  if (!source || !target) return "";

  if (edge.type === "request") {
    const start = { x: source.x, y: source.y + PROCESS_RADIUS };
    const end = { x: target.x, y: target.y - RESOURCE_HEIGHT / 2 };
    return `M ${start.x} ${start.y} C ${start.x} ${start.y + 92}, ${end.x} ${end.y - 92}, ${end.x} ${end.y}`;
  }

  const start = { x: source.x, y: source.y - RESOURCE_HEIGHT / 2 };
  const end = { x: target.x, y: target.y + PROCESS_RADIUS };
  return `M ${start.x} ${start.y} C ${start.x} ${start.y - 92}, ${end.x} ${end.y + 92}, ${end.x} ${end.y}`;
}

function midpoint(edge, positions) {
  const source = positions.get(edge.from);
  const target = positions.get(edge.to);
  if (!source || !target) return { x: 0, y: 0 };
  return {
    x: (source.x + target.x) / 2,
    y: edge.type === "request" ? (source.y + target.y) / 2 + 20 : (source.y + target.y) / 2 - 20,
  };
}

export default function GraphCanvas({ processes, resources, edges, detection, pending }) {
  const processPositions = distribute(processes, PROCESS_Y);
  const resourcePositions = distribute(resources, RESOURCE_Y);
  const positions = new Map([...processPositions, ...resourcePositions]);
  const highlightedEdges = new Set(detection.cycleEdgeIds);
  const highlightedProcesses = new Set(detection.cycleProcesses);
  const highlightedResources = new Set(detection.cycleResources);
  const hasGraph = processes.length > 0 || resources.length > 0;

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel min-h-[560px]">
      <div className="panel-heading">
        <p className="panel-kicker">Graph Canvas</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="panel-title">Resource Allocation Graph</h2>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ArrowDownRight size={14} className="text-amber-500" />
              Request
            </span>
            <span className="inline-flex items-center gap-1">
              <ArrowUpRight size={14} className="text-sky-500" />
              Allocation
            </span>
            {pending && hasGraph && (
              <span className="rounded-lg bg-amber-100 px-2 py-1 text-amber-800 dark:bg-amber-950 dark:text-amber-200">Pending detect</span>
            )}
          </div>
        </div>
      </div>

      <div className="graph-grid relative overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        {!hasGraph && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-center text-slate-500 dark:text-slate-400">
            <Activity size={34} />
            <p className="max-w-sm text-sm font-semibold">Tạo process/resource hoặc load sample scenario để bắt đầu mô phỏng.</p>
          </div>
        )}

        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-[500px] w-full" role="img" aria-label="Resource Allocation Graph">
          <defs>
            <marker id="arrow-normal" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
            <marker id="arrow-request" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
            <marker id="arrow-allocation" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
            </marker>
            <marker id="arrow-danger" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#e11d48" />
            </marker>
            <filter id="red-glow" x="-45%" y="-45%" width="190%" height="190%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#fb7185" floodOpacity="0.95" />
            </filter>
          </defs>

          {edges.map((edge) => {
            const isHighlighted = highlightedEdges.has(edge.id);
            const path = edgePath(edge, positions);
            const label = midpoint(edge, positions);
            const stroke = isHighlighted ? "#e11d48" : edge.type === "request" ? "#f59e0b" : "#0ea5e9";
            const marker = isHighlighted ? "url(#arrow-danger)" : edge.type === "request" ? "url(#arrow-request)" : "url(#arrow-allocation)";

            if (!path) return null;

            return (
              <g key={edge.id} filter={isHighlighted ? "url(#red-glow)" : undefined}>
                <motion.path
                  d={path}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={isHighlighted ? 5 : 3}
                  strokeLinecap="round"
                  markerEnd={marker}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.45 }}
                />
                <text x={label.x} y={label.y} textAnchor="middle" className="fill-slate-500 text-[22px] font-bold dark:fill-slate-300">
                  {edge.type === "request" ? "request" : "allocation"}
                </text>
              </g>
            );
          })}

          {processes.map((process) => {
            const position = processPositions.get(process.id);
            const isDeadlocked = highlightedProcesses.has(process.id);
            const isWaiting = process.status === "waiting";

            return (
              <motion.g
                key={process.id}
                initial={{ opacity: 0, scale: 0.86 }}
                animate={{ opacity: 1, scale: isDeadlocked ? [1, 1.07, 1] : 1 }}
                transition={isDeadlocked ? { repeat: Infinity, duration: 1.1 } : { duration: 0.25 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                filter={isDeadlocked ? "url(#red-glow)" : undefined}
              >
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={PROCESS_RADIUS}
                  fill={isDeadlocked ? "#fee2e2" : isWaiting ? "#fef3c7" : "#dbeafe"}
                  stroke={isDeadlocked ? "#e11d48" : isWaiting ? "#d97706" : "#2563eb"}
                  strokeWidth={isDeadlocked ? 5 : 3}
                />
                <text x={position.x} y={position.y - 8} textAnchor="middle" className="fill-slate-950 text-[30px] font-extrabold">
                  {process.id}
                </text>
                <text x={position.x} y={position.y + 22} textAnchor="middle" className="fill-slate-600 text-[18px] font-bold">
                  {process.status}
                </text>
              </motion.g>
            );
          })}

          {resources.map((resource) => {
            const position = resourcePositions.get(resource.id);
            const isDeadlocked = highlightedResources.has(resource.id);
            const isAllocated = resource.allocatedTo.length > 0;

            return (
              <motion.g
                key={resource.id}
                initial={{ opacity: 0, scale: 0.86 }}
                animate={{ opacity: 1, scale: isDeadlocked ? [1, 1.06, 1] : 1 }}
                transition={isDeadlocked ? { repeat: Infinity, duration: 1.1 } : { duration: 0.25 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                filter={isDeadlocked ? "url(#red-glow)" : undefined}
              >
                <rect
                  x={position.x - RESOURCE_WIDTH / 2}
                  y={position.y - RESOURCE_HEIGHT / 2}
                  width={RESOURCE_WIDTH}
                  height={RESOURCE_HEIGHT}
                  rx="8"
                  fill={isDeadlocked ? "#ffe4e6" : isAllocated ? "#dcfce7" : "#f8fafc"}
                  stroke={isDeadlocked ? "#e11d48" : isAllocated ? "#16a34a" : "#64748b"}
                  strokeWidth={isDeadlocked ? 5 : 3}
                />
                <text x={position.x} y={position.y - 5} textAnchor="middle" className="fill-slate-950 text-[30px] font-extrabold">
                  {resource.id}
                </text>
                <text x={position.x} y={position.y + 23} textAnchor="middle" className="fill-slate-600 text-[18px] font-bold">
                  {resource.allocatedTo.length ? `held by ${resource.allocatedTo.join(", ")}` : "free"}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </motion.section>
  );
}
