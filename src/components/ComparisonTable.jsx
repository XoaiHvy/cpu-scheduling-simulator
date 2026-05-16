const rows = [
  {
    algorithm: "FCFS",
    type: "Non-preemptive",
    strength: "Đơn giản, dễ cài đặt",
    weakness: "Có thể chờ lâu, Convoy Effect",
    fit: "Hệ thống đơn giản",
  },
  {
    algorithm: "SJF",
    type: "Non-preemptive",
    strength: "Giảm Waiting Time trung bình",
    weakness: "Cần biết Burst Time, có thể starvation",
    fit: "Batch system",
  },
  {
    algorithm: "Round Robin",
    type: "Preemptive",
    strength: "Công bằng, phản hồi tốt",
    weakness: "Phụ thuộc Time Quantum",
    fit: "Time-sharing system",
  },
];

export default function ComparisonTable() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78">
      <div className="mb-4">
        <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Khu vực nhận xét và so sánh</p>
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">So sánh 3 thuật toán</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-left text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <th className="px-3 py-2">Thuật toán</th>
              <th className="px-3 py-2">Loại</th>
              <th className="px-3 py-2">Điểm mạnh</th>
              <th className="px-3 py-2">Điểm yếu</th>
              <th className="px-3 py-2">Phù hợp với</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.algorithm} className="bg-slate-50 shadow-sm dark:bg-slate-900/80">
                <td className="rounded-l-lg px-3 py-3 font-extrabold text-slate-950 dark:text-white">
                  {row.algorithm}
                </td>
                <td className="px-3 py-3">{row.type}</td>
                <td className="px-3 py-3 text-emerald-700 dark:text-emerald-300">{row.strength}</td>
                <td className="px-3 py-3 text-rose-700 dark:text-rose-300">{row.weakness}</td>
                <td className="rounded-r-lg px-3 py-3">{row.fit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
