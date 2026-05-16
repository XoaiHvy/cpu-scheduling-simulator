import { Info } from "lucide-react";

const glossaryItems = [
  ["Arrival Time", "thời điểm tiến trình đi vào hệ thống."],
  ["Burst Time", "thời gian tiến trình cần CPU."],
  ["Ready Queue", "hàng đợi các tiến trình sẵn sàng chạy."],
  ["Completion Time", "thời điểm tiến trình hoàn thành."],
  ["Turnaround Time", "tổng thời gian từ lúc đến đến lúc hoàn thành."],
  ["Waiting Time", "tổng thời gian chờ trong Ready Queue."],
  ["Response Time", "thời gian từ lúc đến đến lần đầu được CPU chạy."],
  ["Time Quantum", "lát cắt thời gian trong Round Robin."],
  ["Preemptive", "hệ điều hành có thể thu hồi CPU."],
  ["Non-preemptive", "tiến trình đã chạy thì chạy đến khi xong hoặc tự nhường CPU."],
];

export default function Glossary() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78">
      <div className="mb-4 flex items-center gap-2">
        <Info size={19} className="text-sky-600 dark:text-sky-300" />
        <div>
          <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Chú thích nhanh</p>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Glossary</h2>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {glossaryItems.map(([term, description]) => (
          <div
            key={term}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/80"
          >
            <span className="font-extrabold text-slate-950 dark:text-white">{term}: </span>
            <span className="text-slate-600 dark:text-slate-300">{description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
