# Deadlock Simulator

Website demo mô phỏng hiện tượng **Deadlock** trong môn Hệ điều hành bằng **React + Vite + Tailwind CSS + Framer Motion**.

Ứng dụng tập trung vào trải nghiệm trình chiếu: trực quan, dễ thao tác, có animation, có lý thuyết, có nhật ký thao tác và mô phỏng bằng **Resource Allocation Graph**.

## Mục Tiêu

- Minh họa cách Deadlock hình thành khi các process giữ tài nguyên và chờ lẫn nhau.
- Biểu diễn quan hệ bằng Resource Allocation Graph.
- Chuyển Resource Allocation Graph thành Wait-for Graph.
- Phát hiện chu trình bằng DFS.
- Highlight chu trình deadlock bằng màu đỏ, pulse và glow.
- Hỗ trợ recovery bằng kill process hoặc release resource.

## Công Nghệ

- React
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Không backend
- Không database
- Toàn bộ dữ liệu mô phỏng xử lý ở frontend bằng JavaScript

## Chức Năng Chính

- Tạo process mới: P1, P2, P3...
- Tạo resource mới: R1, R2, R3...
- Tạo allocation edge: Resource -> Process.
- Tạo request edge: Process -> Resource.
- Detect Deadlock bằng Wait-for Graph.
- Highlight process, resource và edge nằm trong chu trình deadlock.
- Hiển thị trạng thái: Idle, Waiting, No deadlock, Deadlock detected, Deadlock resolved.
- Event Log ghi lại từng thao tác.
- Reset mô phỏng.
- Load 3 kịch bản mẫu.
- Recovery Panel cho phép kill process hoặc release resource.

## Cài Đặt Và Chạy

Cài dependencies:

```bash
npm install
```

Chạy dev server:

```bash
npm run dev
```

Mở trình duyệt tại địa chỉ Vite in ra, thường là:

```text
http://localhost:5173/
```

Nếu PowerShell chặn `npm.ps1`, dùng:

```bash
cmd /c npm run dev
```

Build production:

```bash
npm run build
```

Preview bản build:

```bash
npm run preview
```

## Cách Demo Trên Lớp

1. Bấm **Kịch bản 1** để load deadlock vòng hai tiến trình.
2. Bấm **Detect**.
3. Quan sát P1, P2, R1, R2 và các cạnh trong chu trình được highlight đỏ.
4. Giải thích Wait-for Graph: P1 -> P2 và P2 -> P1.
5. Vào **Recovery Panel**, chọn release resource hoặc kill process.
6. Quan sát hệ thống tự detect lại và báo **Deadlock resolved**.

## Kịch Bản Mẫu

### Kịch Bản 1: Deadlock Vòng Hai Tiến Trình

- Tạo P1, P2, R1, R2.
- Cấp R1 cho P1.
- Cấp R2 cho P2.
- P1 yêu cầu R2.
- P2 yêu cầu R1.
- Kết luận: deadlock vì P1 chờ P2 và P2 chờ P1.

### Kịch Bản 2: Deadlock Vòng Ba Tiến Trình

- Tạo P1, P2, P3, R1, R2, R3.
- Cấp R1 cho P1.
- Cấp R2 cho P2.
- Cấp R3 cho P3.
- P1 yêu cầu R2.
- P2 yêu cầu R3.
- P3 yêu cầu R1.
- Kết luận: deadlock vòng ba tiến trình.

### Kịch Bản 3: Chờ Tài Nguyên Nhưng Chưa Deadlock

- Tạo P1, P2, R1.
- Cấp R1 cho P1.
- P2 yêu cầu R1.
- Kết luận: chưa deadlock vì Wait-for Graph chưa có chu trình.

## Logic Phát Hiện Deadlock

Từ Resource Allocation Graph, hệ thống tạo Wait-for Graph theo quy tắc:

- Nếu process `Pi` yêu cầu resource `Rk`.
- Và `Rk` đang được giữ bởi process `Pj`.
- Thì tạo cạnh `Pi -> Pj` trong Wait-for Graph.

Sau đó chạy DFS:

- Nếu DFS phát hiện cạnh quay lại process đang nằm trong stack, hệ thống tìm thấy chu trình.
- Nếu có chu trình, kết luận **Deadlock detected**.
- Nếu không có chu trình nhưng có cạnh chờ, kết luận **No deadlock** nhưng hệ thống đang ở trạng thái waiting.

## Cấu Trúc Project

```text
src/
  App.jsx
  main.jsx
  index.css
  components/
    Header.jsx
    ControlPanel.jsx
    GraphCanvas.jsx
    StatusPanel.jsx
    EventLog.jsx
    TheoryPanel.jsx
    RecoveryPanel.jsx
    ScenarioButtons.jsx
  utils/
    deadlockDetection.js
    sampleScenarios.js
```

## Thành Phần Giao Diện

- **Header**: tiêu đề Deadlock Simulator và mô tả ngắn.
- **Control Panel**: tạo process, resource, request edge, allocation edge, detect, reset.
- **Graph Canvas**: hiển thị Resource Allocation Graph.
- **Status Panel**: hiển thị kết quả phân tích và Wait-for Graph.
- **Event Log**: ghi lại thao tác người dùng.
- **Theory Panel**: giải thích lý thuyết Deadlock.
- **Recovery Panel**: xử lý deadlock bằng kill process hoặc release resource.

## Nội Dung Lý Thuyết Có Trong Website

- Deadlock là gì.
- Resource Allocation Graph là gì.
- Request edge và allocation edge là gì.
- Bốn điều kiện cần:
  - Mutual Exclusion
  - Hold and Wait
  - No Preemption
  - Circular Wait
- Phân biệt Deadlock, Starvation và Livelock.
- Các hướng xử lý:
  - Prevention
  - Avoidance
  - Detection
  - Recovery

## Ghi Chú

- App ưu tiên demo trực quan hơn mô phỏng mọi chi tiết phức tạp của hệ điều hành thật.
- Mỗi resource trong demo mặc định có 1 instance.
- Khi tạo allocation edge cho resource đã được cấp, app sẽ chặn để tránh trạng thái không hợp lệ.
