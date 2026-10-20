# Phân công thực hiện PA1 CampusBorrow

Nhóm T09 • TetraBo • Introduction to Software Engineering • Ngày 18 tháng 10 năm 2026

Bảng phân công đề xuất để nhóm thống nhất trước khi thực hiện. Mỗi người phụ trách nội dung chính, phối hợp ở các phần liên quan và review chéo. Số mục bên dưới tương ứng với mẫu PA1 do TA cung cấp; thời hạn cụ thể sẽ được chốt trên task board.

| **Thành viên và vai trò** | **Phần việc chính** | **Đầu ra cần hoàn thành** | **Người review** |
|---|---|---|---|
| Nguyễn Hoàng Mỹ Trang<br>Team Lead / PM | 4.1 Quy trình và phase gates<br>4.4 Lịch thực hiện<br>4.5 Vai trò và trách nhiệm<br>4.6 Nhân lực và chi phí<br>Tổng hợp mục 1 về đóng góp | Bảng mốc PA và tiêu chí kết thúc từng giai đoạn; Gantt có phụ thuộc, milestone và đường găng; bảng người chính/dự phòng; năng lực từng người và chi phí từ tổng effort; bảng đóng góp cộng đủ 100% kèm minh chứng. | Đoàn Hồng Phúc<br>Review kế hoạch, phạm vi và tính nhất quán. |
| Đoàn Hồng Phúc<br>BA / Designer | Toàn bộ mục 2 — Vision<br>Điều phối mục 4.2 — WBS | Problem Statement; Product Position Statement; stakeholder; F01–F10 theo MoSCoW và phần ngoài phạm vi. WBS ít nhất 3 cấp, bao gồm tài liệu, triển khai, kiểm thử, review và bàn giao; mỗi gói có thể giao cho một owner. | Trang: phạm vi và kế hoạch.<br>Minh: tính khả thi kỹ thuật và độ đầy đủ của WBS. |
| Nguyễn Tiến Minh<br>Developer | Toàn bộ mục 3 — Proposed Solution<br>Phần kỹ thuật của mục 6 — Tools & Collaboration Setup | C4 System Context; bảng stack React, Node.js, PostgreSQL và lý do chọn; phương án hosting, test/CI và môi trường vận hành; repository, cấu trúc thư mục, bảo vệ main, quy trình PR và bằng chứng thiết lập. | Phan Nhật Anh<br>Review khả năng kiểm thử, môi trường và minh chứng công cụ. |
| Phan Nhật Anh<br>Tester | Mục 5 — Risk Management<br>Điều phối mục 4.3 — Estimation<br>Kiểm tra tính đầy đủ của PA1 | Ít nhất 5 rủi ro có loại, Probability, Loss, RE, mitigation/contingency và owner; bảng effort từng gói công việc, phương pháp và giả định; danh sách lỗi, thiếu sót và điểm chưa nhất quán của bản tổng hợp. | Minh: rủi ro kỹ thuật.<br>Trang: effort, năng lực và ảnh hưởng tiến độ. |

Người review kiểm tra phần của người khác và ghi phản hồi trên tài liệu hoặc PR. Người phụ trách sửa phản hồi trước khi đánh dấu hoàn tất; không tự review phần của mình.

## Phối hợp thực hiện và kiểm tra bàn giao

| **Hạng mục phối hợp** | **Phân công và đầu ra** |
|---|---|
| WBS và ước lượng | Mỗi người phân rã và ước lượng việc thuộc chuyên môn của mình. Phúc tổng hợp WBS; Nhật Anh tổng hợp person-hours, phương pháp và giả định; Trang đối chiếu với năng lực trước khi lập Gantt và chi phí. |
| Repository và công cụ | Minh thiết lập repo, README, cấu trúc thư mục, .gitignore, bảo vệ main và quy trình PR. Trang lập board, gán owner/hạn/mã WBS, quản lý Discord, quyền truy cập TA và lịch họp. Nhật Anh kiểm tra hoạt động và thu minh chứng; Phúc kiểm tra link trong báo cáo. |
| Đóng góp và AI Usage Log | Mỗi thành viên ghi task, commit, PR và các lần dùng AI của mình, kèm cách kiểm chứng. Trang tổng hợp mục 1 và ghép mục 7 từ nội dung từng người cung cấp. Tỷ lệ đóng góp dựa trên việc thực tế; không mặc định 25% mỗi người. |
| Ghép và nộp PA1 | Trang ghép bản cuối, kiểm tra phản hồi đã xử lý và điều phối nộp PDF cùng file nguồn lên Moodle, đồng thời commit vào /pa/PA1. Nhật Anh kiểm tra checklist; tất cả thành viên xác nhận phần mình phụ trách. |

### Thứ tự thực hiện

1. Cả nhóm chốt phạm vi F01–F09, quyền Admin, quy tắc còn mở và số giờ có thể dành cho dự án. Làm rõ mức 8–10 giờ hay 12 giờ/người/tuần trong giai đoạn triển khai đang khác nhau giữa các mục của PA0.

2. Phúc và Minh soạn Vision và Proposed Solution song song. Trang chuẩn bị mốc, vai trò và năng lực; Nhật Anh lập danh sách rủi ro.

3. Cả nhóm xây WBS và ước lượng. Sau khi Phúc và Nhật Anh tổng hợp, Trang lập Gantt, kiểm tra đường găng và tính chi phí.

4. Review chéo, sửa phản hồi và ghép bản cuối. Đề xuất hoàn thành bản nháp trước hạn nộp 48 giờ; nhóm cần thống nhất điều chỉnh so với hạn nội bộ 12 giờ đã ghi trong PA0.

### Checklist trước khi nộp

F01–F09 đều được bao phủ trong WBS; mỗi gói có owner và effort; WBS, bảng ước lượng, Gantt và chi phí khớp nhau; lịch phù hợp năng lực; ít nhất 5 rủi ro được tính RE theo thang đo bài giảng; đủ link công cụ và minh chứng; tỷ lệ đóng góp đủ 100%; AI log cập nhật; phản hồi review đã xử lý.

Tài liệu đối chiếu: T09-PA0.pdf và PA1-ProjectProposal-Plan.docx do nhóm cung cấp. Đây là phân công đề xuất; mỗi thành viên xác nhận phần việc và hạn trên task board trước khi bắt đầu.
