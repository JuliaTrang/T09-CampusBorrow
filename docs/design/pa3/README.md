# PA3 — Khung làm việc của Minh

**Bản nháp để tiếp tục hoàn thiện, chưa phải baseline được nhóm duyệt.** Ngày đối chiếu: 17/11/2026. Trang ghép phần được duyệt vào tài liệu PA3 cuối. Chỉ chuẩn bị phần Minh; Domain Model, ERD, State Machine và Deployment vẫn thuộc các task liên quan.

| Mục      | Tài liệu                                                                                                                                                      | Issue                                                                                                                            | Tình trạng                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 3.3, 3.4 | [Bản tiếng Anh để ghép](3.3-3.4-drive-aligned.md); hình [C4-L2](../diagrams/C4-L2_container-2026-11-18.drawio) và [CMP-D](../diagrams/CMP-D_component.drawio) | [#43](https://github.com/JuliaTrang/T09-CampusBorrow/issues/43), [#44](https://github.com/JuliaTrang/T09-CampusBorrow/issues/44) | XONG phần chữ và hình; #44 đã chốt theo ADR-002 (21/11) |
| 4.2      | [Class Diagram](4.2-class-diagram.md) (tiếng Anh); hình CD-01, CD-02 bằng draw.io                                                                             | [#48](https://github.com/JuliaTrang/T09-CampusBorrow/issues/48)                                                                  | Theo DM-01 (PR #62), ADR-002 (#44) và schema đích ở #46 |
| 4.3      | [8 Class Specifications](4.3-class-specifications.md) (tiếng Anh)                                                                                             | [#53](https://github.com/JuliaTrang/T09-CampusBorrow/issues/53)                                                                  | 8 class chi tiết + 2 class tóm tắt; khớp CD-01/CD-02    |
| 4.4      | [5 Sequence Diagrams](4.4-sequence-diagrams.md) (tiếng Anh); hình SD-01 đến SD-05 bằng draw.io                                                                | [#51](https://github.com/JuliaTrang/T09-CampusBorrow/issues/51)                                                                  | UC-01/11/13/18/19, mỗi luồng có `alt`                   |
| 4.6      | [Principles & Patterns](4.6-principles-patterns.md) (tiếng Anh)                                                                                               | [#54](https://github.com/JuliaTrang/T09-CampusBorrow/issues/54)                                                                  | Gắn class/component cụ thể; chưa chứng minh bằng code   |

## Hình draw.io và quy ước đặt tên

CD-01, CD-02 và SD-01 đến SD-05 đã vẽ bằng draw.io theo quy ước của kickoff, kèm `.drawio.png` (200%, có nhúng bản sao để mở lại sửa được) trong `docs/design/diagrams/`. File `.mmd` và PNG Mermaid cũ chỉ là bản nháp tham khảo. Khi commit cần đổi tên `C4-L2_container-2026-11-18.*` và `CMP-D_component-2026-11-18.*` thành `C4-L2_container.*` và `CMP-D_component.*` (hai tên này đang là bản nháp cũ giữ nguyên byte theo manifest). Hình chưa được mở thử bằng draw.io Desktop; đã kiểm tra bằng trình xem draw.io.

## Bản cập nhật ngày 18/11

Dùng [bản Trang cập nhật trên Drive](https://docs.google.com/document/d/1gGg8x3rT3SiIO70aaPSqNGK-r8pEZVWT/edit), mục 2.1, 3.1–3.2 và 3.6. [Bản tiếng Anh để ghép 3.3–3.4](3.3-3.4-drive-aligned.md) bám theo ADR-001–004 Accepted. ADR-005/006 đang Proposed. Domain Model trong Word còn mục mẫu và [#40](https://github.com/JuliaTrang/T09-CampusBorrow/issues/40) vẫn Open. Các bản nháp gốc trong manifest là nguồn lịch sử.

## Nguồn và thứ tự đối chiếu

Từ 19/11, nguồn yêu cầu chính là **PA2 v2** (`T09-PA2-v2.docx`, [thư mục pa3 trên Drive](https://drive.google.com/file/d/17ab28ngt-XOrnY1qsv9IaxK4VRCzCddZ/view), chủ sở hữu Trang). Bản này đã gộp 13 thay đổi ở mục 8 của PA3. Bản PA2 đã nộp ([T09-PA2.pdf](../../../pa/PA2/T09-PA2.pdf)) chỉ dùng để so khi cần. Khi hai bản khác nhau thì theo v2.

Đã đối chiếu với v2 ngày 19/11: 37 mã FR, BR, NFR, UC trích dẫn trong các file này đều có trong v2; nội dung BR-03, BR-04, BR-13, BR-16, BR-20, NFR-09, FR-01-02, FR-03-06, FR-03-15, UC-01, UC-11, UC-13, UC-18 và 8 Period P1–P8 khớp. Chưa có danh sách 13 thay đổi nên chưa đối chiếu được từng thay đổi.

Thứ tự đối chiếu còn lại:

1. `docs/design/kickoff/PA3-Kickoff.md` (PR #59, chưa merge): tên entity, thuộc tính, enum, mã sơ đồ.
2. [DM-01 Domain Model](../domain-model/README.md): bội số và mã `CorrectionOperation`.
3. [ADR-001](../adr/ADR-001-tech-stack.md) và ADR-002 đến ADR-006 (PR #59, chưa merge). ADR-005 và ADR-006 còn Proposed.
4. Issue hiện hành trên GitHub là nguồn deadline. Không suy ngày bắt đầu từ ngày tạo issue.

## TODO có nguồn phụ thuộc

| Mã        | Việc cần xác nhận                                                                                                | Nguồn / người phụ trách                                                                             | Ảnh hưởng                        |
| --------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------- |
| TODO-DM   | Đã đóng 19/11: DM-01 đã merge (PR #62); bội số đã áp dụng vào CD-02 và 4.2                                       | [#40](https://github.com/JuliaTrang/T09-CampusBorrow/issues/40), Phúc                               | CD-02, specs entity, ERD #46/#49 |
| TODO-CMP  | Đã đóng 21/11 theo ADR-002: AuthModule đọc account qua AccountService; HistoryService.append dùng tx của bên gọi | [#44](https://github.com/JuliaTrang/T09-CampusBorrow/issues/44#issuecomment-6927352314), Trang/nhóm | CD-01, toàn bộ sequence          |
| TODO-AUTH | ADR-003 Accepted, đóng I-05. RevokedToken và token_version đã có trong glossary; đồng bộ ERD                     | Bản Trang §3.6, #46/#49                                                                             | CD-02, SD-01                     |
| TODO-SRS  | Đã đóng 19/11: PA2 v2 đã bỏ cụm "assigned scope" ở FR-07 (BR-01). CO-01–04 và FR-05-06 có trong v2               | [#50](https://github.com/JuliaTrang/T09-CampusBorrow/issues/50), SRS FR-07/BR-01/BR-20              | Quyền, CorrectionModule          |
| TODO-TIME | Period cố định P1–P8 (BR-03, C-08); thời gian từng tiết theo SRS, chờ #49 về schema                              | Bản Trang §2.1, #49                                                                                 | TimetableService, RoomBooking    |
| TODO-JOB  | Chốt đề xuất pg_cron/pg_net và mục tiêu xử lý trong 5 phút, cùng hosting/backup                                  | ADR-005/006 Proposed, I-04, #45                                                                     | CMP-08, DEP-D                    |
| TODO-OPS  | Duyệt chữ ký operation/DTO và mã lỗi nghiệp vụ; đây là thiết kế đề xuất, không phải API đã tồn tại               | #48 trước #51/#53/#54                                                                               | Tất cả sơ đồ/đặc tả              |

Để chuyển sang bản nộp: giải quyết các TODO theo nguồn, đồng bộ CD ↔ specs ↔ SD ↔ ERD/state machine, gắn traceability #58, rồi render và review bản ghép. Không đánh dấu issue Done chỉ vì đã có khung.
