import { BookOpen, CheckCircle2, Lightbulb, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";

export const algorithmExplanations = {
  FCFS: {
    name: "FCFS - First Come First Served",
    type: "Non-preemptive",
    idea: "Tiến trình đến trước được phục vụ trước.",
    summary:
      "FCFS hoạt động theo nguyên tắc đến trước phục vụ trước. Thuật toán này đơn giản, dễ cài đặt nhưng có thể gây thời gian chờ lớn nếu một tiến trình dài đến trước.",
    steps: [
      "Sắp xếp tiến trình theo Arrival Time.",
      "Chọn tiến trình đến sớm nhất.",
      "Cho tiến trình chạy đến khi hoàn thành.",
      "Lặp lại cho đến khi tất cả tiến trình hoàn thành.",
    ],
    pros: ["Dễ hiểu.", "Dễ cài đặt.", "Công bằng theo thứ tự đến."],
    cons: [
      "Có thể gây Convoy Effect.",
      "Tiến trình ngắn có thể phải chờ lâu.",
      "Không phù hợp với hệ thống cần phản hồi nhanh.",
    ],
    useCase: "Hệ thống đơn giản, ít yêu cầu phản hồi tức thời.",
  },
  SJF: {
    name: "SJF - Shortest Job First",
    type: "Non-preemptive",
    idea: "Chọn tiến trình có Burst Time ngắn nhất trong Ready Queue.",
    summary:
      "SJF chọn tiến trình có thời gian xử lý ngắn nhất trong Ready Queue. Thuật toán này thường giảm thời gian chờ trung bình, nhưng trong thực tế khó biết chính xác Burst Time của tiến trình.",
    steps: [
      "Tại thời điểm CPU rảnh, lấy các tiến trình đã đến.",
      "Chọn tiến trình có Burst Time nhỏ nhất.",
      "Cho tiến trình chạy đến khi hoàn thành.",
      "Lặp lại cho đến khi tất cả tiến trình hoàn thành.",
    ],
    pros: ["Thường giảm Waiting Time trung bình.", "Tốt khi có nhiều tiến trình ngắn."],
    cons: [
      "Cần biết hoặc dự đoán Burst Time.",
      "Tiến trình dài có thể bị chờ lâu.",
      "Có thể gây starvation trong một số trường hợp.",
    ],
    useCase: "Batch system hoặc môi trường dự đoán được thời gian xử lý.",
  },
  RR: {
    name: "Round Robin",
    type: "Preemptive",
    idea: "Chia CPU theo Time Quantum.",
    summary:
      "Round Robin chia CPU thành các lát thời gian bằng nhau. Mỗi tiến trình được chạy trong một Time Quantum. Nếu chưa hoàn thành, tiến trình được đưa về cuối hàng đợi. Thuật toán này công bằng và phù hợp với hệ thống tương tác.",
    steps: [
      "Đưa tiến trình đã đến vào Ready Queue.",
      "Lấy tiến trình đầu hàng đợi.",
      "Chạy tối đa trong Time Quantum.",
      "Nếu chưa hoàn thành, đưa về cuối hàng đợi.",
      "Nếu hoàn thành, chuyển sang Completed.",
      "Lặp lại đến khi tất cả tiến trình hoàn thành.",
    ],
    pros: [
      "Công bằng.",
      "Mỗi tiến trình đều có cơ hội chạy.",
      "Phù hợp với hệ thống chia sẻ thời gian.",
      "Thời gian phản hồi thường tốt.",
    ],
    cons: [
      "Phụ thuộc vào Time Quantum.",
      "Quantum quá nhỏ làm tăng số lần chuyển ngữ cảnh.",
      "Quantum quá lớn làm thuật toán gần giống FCFS.",
    ],
    useCase: "Time-sharing system và hệ thống tương tác.",
  },
};

export default function ExplanationPanel({ selectedAlgorithm }) {
  const explanation = algorithmExplanations[selectedAlgorithm];

  return (
    <motion.section
      key={selectedAlgorithm}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-slate-200 bg-white/86 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/78"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200">
          <BookOpen size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Thuật toán đang chọn</p>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">{explanation.name}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Loại: {explanation.type}</p>
        </div>
      </div>

      <p className="rounded-lg border border-sky-100 bg-sky-50 p-3 text-sm leading-6 text-slate-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-slate-200">
        {explanation.summary}
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Lightbulb size={18} />
            Ý tưởng chính
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{explanation.idea}</p>
          <ol className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {explanation.steps.map((step, index) => (
              <li key={step} className="flex gap-2">
                <span className="font-bold text-sky-600">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-3">
          <InfoList icon={CheckCircle2} title="Ưu điểm" items={explanation.pros} color="emerald" />
          <InfoList icon={TriangleAlert} title="Nhược điểm" items={explanation.cons} color="rose" />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white">Khi nào nên dùng: </span>
            {explanation.useCase}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function InfoList({ icon: Icon, title, items, color }) {
  const colorClass =
    color === "emerald"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900"
      : "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900";

  return (
    <div className={`rounded-lg border p-3 ${colorClass}`}>
      <div className="mb-2 flex items-center gap-2 text-sm font-bold">
        <Icon size={17} />
        {title}
      </div>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export function renderExplanation(props) {
  return <ExplanationPanel {...props} />;
}
