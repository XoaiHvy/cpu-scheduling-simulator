export default function ResultTable({ result }) {
  if (!result) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78">
        <p className="text-sm text-slate-500 dark:text-slate-400">Bảng kết quả sẽ hiển thị sau khi chạy mô phỏng.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78">
      <div className="mb-4">
        <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Bảng kết quả</p>
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Result Table</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-left text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <th className="px-3 py-2">Process</th>
              <th className="px-3 py-2">Arrival Time</th>
              <th className="px-3 py-2">Burst Time</th>
              <th className="px-3 py-2">Start Time</th>
              <th className="px-3 py-2">Completion Time</th>
              <th className="px-3 py-2">Turnaround Time</th>
              <th className="px-3 py-2">Waiting Time</th>
              <th className="px-3 py-2">Response Time</th>
            </tr>
          </thead>
          <tbody>
            {result.results.map((process) => (
              <tr key={process.id} className="bg-slate-50 shadow-sm dark:bg-slate-900/80">
                <td className="rounded-l-lg px-3 py-3">
                  <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                    <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: process.color }} />
                    {process.id}
                  </div>
                </td>
                <td className="px-3 py-3">{process.arrivalTime}</td>
                <td className="px-3 py-3">{process.burstTime}</td>
                <td className="px-3 py-3 font-semibold text-sky-700 dark:text-sky-300">{process.startTime}</td>
                <td className="px-3 py-3 font-semibold text-emerald-700 dark:text-emerald-300">
                  {process.completionTime}
                </td>
                <td className="px-3 py-3">{process.turnaroundTime}</td>
                <td className="px-3 py-3 font-semibold text-amber-700 dark:text-amber-300">
                  {process.waitingTime}
                </td>
                <td className="rounded-r-lg px-3 py-3">{process.responseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function renderResultTable(props) {
  return <ResultTable {...props} />;
}
