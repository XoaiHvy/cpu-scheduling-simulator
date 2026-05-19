import { motion } from "framer-motion";
import { BookOpen, GitFork, ShieldAlert, SplitSquareHorizontal } from "lucide-react";

const cards = [
  {
    icon: ShieldAlert,
    title: "Deadlock là gì",
    body: "Deadlock là trạng thái nhiều process bị kẹt vì mỗi process đang giữ một tài nguyên và chờ tài nguyên khác do process còn lại giữ. Không process nào tự tiến tiếp được.",
  },
  {
    icon: GitFork,
    title: "Resource Allocation Graph",
    body: "Resource Allocation Graph biểu diễn quan hệ giữa process và resource. Process thường vẽ bằng hình tròn; resource vẽ bằng hình chữ nhật.",
  },
  {
    icon: SplitSquareHorizontal,
    title: "Request edge và allocation edge",
    body: "Request edge là mũi tên Process -> Resource, nghĩa là process đang yêu cầu tài nguyên. Allocation edge là mũi tên Resource -> Process, nghĩa là tài nguyên đã được cấp.",
  },
  {
    icon: BookOpen,
    title: "Detection và Recovery",
    body: "Từ Resource Allocation Graph tạo Wait-for Graph. Nếu Pi yêu cầu Rk và Rk đang do Pj giữ, thêm cạnh Pi -> Pj. DFS tìm chu trình để kết luận deadlock.",
  },
];

const conditions = [
  ["Mutual Exclusion", "Tài nguyên không chia sẻ đồng thời."],
  ["Hold and Wait", "Process giữ tài nguyên này và chờ tài nguyên khác."],
  ["No Preemption", "Hệ điều hành không cưỡng chế thu hồi tài nguyên."],
  ["Circular Wait", "Tồn tại vòng chờ giữa các process."],
];

const comparisons = [
  ["Deadlock", "Các process chờ nhau theo chu trình và không thể tự thoát."],
  ["Starvation", "Một process chờ quá lâu vì luôn bị process khác giành tài nguyên hoặc CPU."],
  ["Livelock", "Process vẫn đổi trạng thái liên tục nhưng không tạo tiến triển thực."],
];

const strategies = [
  ["Prevention", "Loại bỏ ít nhất một trong bốn điều kiện cần."],
  ["Avoidance", "Chỉ cấp tài nguyên nếu hệ thống vẫn ở safe state."],
  ["Detection", "Cho hệ thống chạy, sau đó phát hiện chu trình."],
  ["Recovery", "Kill process hoặc thu hồi resource để phá chu trình."],
];

export default function TheoryPanel() {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel">
      <div className="panel-heading">
        <p className="panel-kicker">Theory Panel</p>
        <h2 className="panel-title">Lý thuyết cần trình bày</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex items-center gap-2">
                <Icon size={20} className="text-sky-600 dark:text-sky-300" />
                <h3 className="text-base font-extrabold text-slate-950 dark:text-white">{card.title}</h3>
              </div>
              <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">{card.body}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <TheoryList title="Bốn điều kiện cần" items={conditions} />
        <TheoryList title="Phân biệt hiện tượng" items={comparisons} />
        <TheoryList title="Hướng xử lý" items={strategies} />
      </div>
    </motion.section>
  );
}

function TheoryList({ title, items }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <h3 className="mb-3 text-base font-extrabold text-slate-950 dark:text-white">{title}</h3>
      <div className="grid gap-3">
        {items.map(([name, description]) => (
          <div key={name}>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{name}</p>
            <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
