# PA3 — Khung làm việc của Minh

**Bản nháp để tiếp tục hoàn thiện, chưa phải baseline được nhóm duyệt.** Ngày đối chiếu: 17/11/2026. Trang ghép phần được duyệt vào tài liệu PA3 cuối. Chỉ chuẩn bị phần Minh; Domain Model, ERD, State Machine và Deployment vẫn thuộc các task liên quan.

| Mục      | Tài liệu                                                                                                                                                                 | Issue                                                                                                                            | Tình trạng                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 3.3, 3.4 | [Bản tiếng Anh để ghép](3.3-3.4-drive-aligned.md); hình [C4-L2](../diagrams/C4-L2_container-2026-11-18.drawio) và [CMP-D](../diagrams/CMP-D_component-2026-11-18.drawio) | [#43](https://github.com/JuliaTrang/T09-CampusBorrow/issues/43), [#44](https://github.com/JuliaTrang/T09-CampusBorrow/issues/44) | XONG phần chữ và hình; #44 chờ nhóm duyệt chiều phụ thuộc module   |
| 4.2      | [Class Diagram](4.2-class-diagram.md) (tiếng Anh); hình CD-01, CD-02 bằng draw.io                                                                                        | [#48](https://github.com/JuliaTrang/T09-CampusBorrow/issues/48)                                                                  | Khung theo glossary kickoff; chờ DM-01 (#40) về cardinality và #44 |
| 4.3      | [8 Class Specifications](4.3-class-specifications.md) (tiếng Anh)                                                                                                        | [#53](https://github.com/JuliaTrang/T09-CampusBorrow/issues/53)                                                                  | Khớp CD-01/CD-02; chờ DM-01 và #44                                 |
| 4.4      | [4 Sequence Diagrams](4.4-sequence-diagrams.md) (tiếng Anh); hình SD-01 đến SD-04 bằng draw.io                                                                           | [#51](https://github.com/JuliaTrang/T09-CampusBorrow/issues/51)                                                                  | UC-01/11/13/18, mỗi luồng có `alt`; SD-05 chưa vẽ                  |
| 4.6      | [Principles & Patterns](4.6-principles-patterns.md) (tiếng Anh)                                                                                                          | [#54](https://github.com/JuliaTrang/T09-CampusBorrow/issues/54)                                                                  | Gắn class/component cụ thể; chưa chứng minh bằng code              |

## Hình draw.io và quy ước đặt tên

CD-01, CD-02 và SD-01 đến SD-04 đã vẽ bằng draw.io theo quy ước của kickoff, kèm `.drawio.png` (200%, có nhúng bản sao để mở lại sửa được) trong `docs/design/diagrams/`. File `.mmd` và PNG Mermaid cũ chỉ là bản nháp tham khảo. Khi commit cần đổi tên `C4-L2_container-2026-11-18.*` và `CMP-D_component-2026-11-18.*` thành `C4-L2_container.*` và `CMP-D_component.*` (hai tên này đang là bản nháp cũ giữ nguyên byte theo manifest). Hình chưa được mở thử bằng draw.io Desktop; đã kiểm tra bằng trình xem draw.io.

## Bản cập nhật ngày 18/11

Dùng [bản Trang cập nhật trên Drive](https://docs.google.com/document/d/1gGg8x3rT3SiIO70aaPSqNGK-r8pEZVWT/edit), mục 2.1, 3.1–3.2 và 3.6. [Bản tiếng Anh để ghép 3.3–3.4](3.3-3.4-drive-aligned.md) bám theo ADR-001–004 Accepted. ADR-005/006 đang Proposed. Domain Model trong Word còn mục mẫu và [#40](https://github.com/JuliaTrang/T09-CampusBorrow/issues/40) vẫn Open. Các bản nháp gốc trong manifest là nguồn lịch sử.

## Nguồn và thứ tự đối chiếu

- [Template PA3](sources/PA3-template.md): cấu trúc mục, 6–8 lớp, 3–5 UC, ít nhất một `alt`, mọi message phải khớp operation.
- [SRS PA2 Markdown tham chiếu](sources/PA2-reference.md), đối chiếu thêm [DOCX đang có trong worktree](../../requirements/T09-PA2.docx). DOCX là bản đang chỉnh, có điểm khác Markdown; không tự chọn một bản làm baseline cuối. Các FR còn mâu thuẫn cần Phúc xác nhận ở #50.
- [ADR-001](../adr/ADR-001-tech-stack.md): stack có sẵn. File này vốn đã thay đổi trong worktree trước phiên này; không sửa tiếp.
- [Snapshot ADR-002](sources/ADR-002-authentication-session.snapshot.md): sao chép nguyên bản, gồm dòng `Status: Accepted` của tác giả. **Chỉ là nguồn lịch sử, đã bị thay thế:** ADR-002 hiện hành là layered modular monolith; xác thực nằm ở ADR-003 (JWT + `token_version` + denylist `revoked_tokens`, không có bảng session), Accepted, đóng I-05. Không dùng bảng `sessions` trong snapshot này.
- [Phân công](sources/PA3-assignment.md), issue hiện hành và [biên bản kiểm tra Project](../../management/pa3-project-report.md) là nguồn deadline. Không suy ngày bắt đầu từ ngày tạo issue hoặc ngày prerequisite hết hạn.
- [Manifest nguồn](sources/manifest.md) ghi vị trí và hash bản sao. Bản nháp 3.3/3.4, hai draw.io và hai PNG được giữ nguyên byte từ `C:/Users/Minh/Desktop/T09-pa3-arch`.

## TODO có nguồn phụ thuộc

| Mã        | Việc cần xác nhận                                                                                                          | Nguồn / người phụ trách                                                                             | Ảnh hưởng                        |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------- |
| TODO-DM   | Cardinality và quan hệ theo DM-01; tên entity, thuộc tính, enum và kế thừa Resource đã chốt ở kickoff 18/11                | [#40](https://github.com/JuliaTrang/T09-CampusBorrow/issues/40), Phúc                               | CD-02, specs entity, ERD #46/#49 |
| TODO-CMP  | Duyệt chiều phụ thuộc module, cách truyền transaction cho HistoryService; mã CMP giữ nguyên                                | [#44](https://github.com/JuliaTrang/T09-CampusBorrow/issues/44#issuecomment-6927352314), Trang/nhóm | CD-01, toàn bộ sequence          |
| TODO-AUTH | ADR-003 Accepted, đóng I-05. RevokedToken và token_version đã có trong glossary; đồng bộ ERD                               | Bản Trang §3.6, #46/#49                                                                             | CD-02, SD-01                     |
| TODO-SRS  | Chốt PA2-v2: FR-07 còn cụm assigned scope trong DOCX dù BR-01 và change log nói bỏ. CO-01–04 và FR-05-06 đã chốt ở kickoff | [#50](https://github.com/JuliaTrang/T09-CampusBorrow/issues/50), SRS FR-07/BR-01/BR-20              | Quyền, CorrectionModule          |
| TODO-TIME | Period cố định P1–P8 (BR-03, C-08); thời gian từng tiết theo SRS, chờ #49 về schema                                        | Bản Trang §2.1, #49                                                                                 | TimetableService, RoomBooking    |
| TODO-JOB  | Chốt đề xuất pg_cron/pg_net và mục tiêu xử lý trong 5 phút, cùng hosting/backup                                            | ADR-005/006 Proposed, I-04, #45                                                                     | CMP-08, DEP-D                    |
| TODO-OPS  | Duyệt chữ ký operation/DTO và mã lỗi nghiệp vụ; đây là thiết kế đề xuất, không phải API đã tồn tại                         | #48 trước #51/#53/#54                                                                               | Tất cả sơ đồ/đặc tả              |

Để chuyển sang bản nộp: giải quyết các TODO theo nguồn, đồng bộ CD ↔ specs ↔ SD ↔ ERD/state machine, gắn traceability #58, rồi render và review bản ghép. Không đánh dấu issue Done chỉ vì đã có khung.
