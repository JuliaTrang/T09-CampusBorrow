# CampusBorrow PA3 – Kickoff: Use case chính, Màn hình chính & Bảng thuật ngữ chung

14/11/2026 · @Jul

## Quyết định kickoff

Nhóm chốt 4 use case chính (UC-01, UC-11, UC-13, UC-18) cho sequence diagram và 6 màn hình chính (S01, S04, S05, S06, S08, S09) cho screen specification. Công cụ vẽ là draw.io. Mọi tên entity, trạng thái, component và màn hình trong PA3 phải lấy từ các bảng trong tài liệu này.

- **Nguồn chuẩn:** SRS PA2 đã nộp, cộng 13 thay đổi đã ghi ở mục 8 của PA3 (mục 13 sửa NFR-09). Danh mục CO-01 đến CO-04 và quyết định FR-05-06 được xem là đã chốt.
- **Ngôn ngữ trong tài liệu PA3:** tiếng Anh. Tên code: PascalCase cho class, snake_case cho bảng và cột, UPPER_SNAKE cho enum.
- **Quy tắc đổi tên:** ai muốn thêm hoặc đổi một tên thì sửa tài liệu này trước rồi báo nhóm. Không tự đặt tên mới trong sơ đồ.
- **Dự phòng:** nếu còn thời gian, thêm UC-19 làm sequence thứ 5 (template cho phép 3–5).
- **Cập nhật 18/11/2026 (Trang):** thêm cột accounts.token_version và entity RevokedToken / revoked_tokens theo ADR-003 (JWT + bcrypt); thêm màu Prospective Borrower; sửa ghi chú ADR-001 và số thay đổi ở mục 8 (13 mục).
- **Cập nhật 22/11/2026 (Minh, theo ERD-01 và Table Specification):** thêm `history_events.resource_id` (FR-08-01 yêu cầu mã tài nguyên) và `state_corrections.history_event_id` (mỗi lần sửa có đúng một sự kiện STATE_CORRECTED, DM-01). `id` là uuid ở mọi bảng, trừ `periods` dùng khóa `code` và `revoked_tokens` dùng khóa `jti` (Table Specification 22/11, ADR-003).

## 4 use case chính

Bốn use case này phủ cả hai loại tài nguyên, cả Borrower lẫn RM, và các NFR quan trọng nhất: bảo mật, tranh chấp đồng thời, quy tắc thời gian và kiểm tra dữ liệu nhập. Mỗi use case đều có sẵn một nhánh `alt` tự nhiên.

| Sequence         | Use case                                     | Actor       | Vì sao chọn                                                                                                                                                             | Nhánh alt gợi ý                                                            | Màn hình |
| ---------------- | -------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------- |
| SD-01            | UC-01 Sign in                                | Mọi vai trò | Thể hiện thiết kế phiên đăng nhập và thu hồi phiên (I-05, BR-10, NFR-03/04/05). Là cơ sở cho ADR xác thực.                                                              | Đúng mật khẩu và tài khoản Active / sai mật khẩu hoặc Inactive             | S01      |
| SD-02            | UC-11 Approve or reject an equipment request | RM, Admin   | Luồng cốt lõi: duyệt độc quyền, tự từ chối các request cạnh tranh trong cùng một transaction (FR-03-06, NFR-09). Có lý do từ chối bắt buộc theo nhận xét của thầy.      | Approve / Reject; trong Approve: còn đủ điều kiện / đã bị chiếm (conflict) | S05      |
| SD-03            | UC-13 Record equipment handover              | RM, Admin   | Thể hiện quy tắc thời gian BR-04 (`pickup ≤ now < expiry`) và chuyển Approved → On loan. Giải thích được vì sao endpoint phải tự kiểm tra expiry khi job bị trễ (I-04). | Trong khung giờ nhận / quá sớm hoặc đã hết hạn                             | S06      |
| SD-04            | UC-18 Submit a room booking request          | Borrower    | Luồng chính của phòng: kiểm tra tiết học, tính khoảng giờ, sức chứa, trùng lịch (BR-03). Đây là nơi có nhiều validation nhất, dùng lại cho EP/BVA ở PA4.                | Hợp lệ / trùng lịch đã duyệt hoặc sai tiết                                 | S08      |
| SD-05 (dự phòng) | UC-19 Approve or reject a room booking       | RM, Admin   | Tranh chấp khoảng giờ phòng ở mức DB (exclusion constraint). Chỉ làm nếu còn thời gian.                                                                                 | Approve / Reject                                                           | S09      |

Không chọn UC-22 vì đã hạ xuống Should. Không chọn UC-10 vì luồng của nó gần giống UC-18 nhưng ít quy tắc hơn.

## 6 màn hình chính

Sáu màn hình chia đều 3 cho Borrower và 3 cho RM, khớp với 4 sequence ở trên. Chúng cũng là nơi có nhiều validation nhất. S05 và S09 là hai màn hình thầy đã nhận xét, nên phải có screen spec để thể hiện đã sửa. Các màn hình còn lại chỉ cần ảnh thiết kế.

| Mã  | Màn hình             | Vai trò     | Use case            | Validation chính cần đặc tả                                                                                                                      | Ghi chú                           |
| --- | -------------------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| S01 | Sign in              | Mọi vai trò | UC-01, UC-02        | Identifier được trim; mật khẩu không trim; thông báo lỗi chung, không tiết lộ tài khoản có tồn tại hay không                                     | Khớp SD-01                        |
| S04 | Equipment request    | Borrower    | UC-10               | Purpose bắt buộc; pickup > now; pickup < return; mỗi request một item                                                                            | Mở đầu vòng đời request thiết bị  |
| S05 | Equipment requests   | RM, Admin   | UC-11, UC-12        | Giờ nhận xác nhận > now và < hạn trả; **lý do từ chối bắt buộc, 1–500 ký tự**; đổi lịch nhận chỉ dành cho RM                                     | Khớp SD-02; sửa theo nhận xét 1   |
| S06 | Handover and returns | RM, Admin   | UC-13, UC-14, UC-16 | Nút bàn giao chỉ bật trong khung `pickup ≤ now < expiry`; trả chỉ khi đã bàn giao; danh sách quá hạn tính động                                   | Khớp SD-03                        |
| S08 | Room booking         | Borrower    | UC-18               | First/last period cùng một buổi; tiết đầu > now; headcount nguyên, từ 1 đến capacity; không trùng lịch đã duyệt; giữ lại giá trị đã nhập khi lỗi | Khớp SD-04; có bản mobile S08m    |
| S09 | Room requests        | RM, Admin   | UC-19               | Kiểm tra lại trùng lịch khi duyệt; **lý do từ chối bắt buộc, 1–500 ký tự**; P4 = 10:15–11:00                                                     | Sửa theo nhận xét 1 và lỗi giờ P4 |

Màn hình Admin (S02, S13) chỉ đưa ảnh. Nếu nhóm muốn có Admin trong phần spec, đổi S06 sang S02 Accounts.

## Entity: Domain → Class → Table

Mỗi khái niệm nghiệp vụ có đúng một tên ở cả Domain Model, Class Diagram và ERD. Class dùng PascalCase số ít; bảng dùng snake_case số nhiều (Prisma `@@map`).

| Domain (thuật ngữ PA2)            | Class                          | Table                            | Thuộc tính khóa                                                                                                                                                                                                                                                     | Ghi chú thiết kế                                                                                                                                                                                          |
| --------------------------------- | ------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account                           | `Account`                      | `accounts`                       | `id`, `username`, `email`, `display_name`, `password_hash`, `role`, `status`, `token_version`                                                                                                                                                                       | Một tài khoản có đúng một `role`. `username` và `email` unique không phân biệt hoa thường (BR-06). `token_version` tăng khi khóa tài khoản, đổi role hoặc reset mật khẩu để vô hiệu mọi JWT cũ (ADR-003). |
| Resource                          | `Resource` (abstract)          | `resources`                      | `id`, `code`, `type`, `name`, `location`, `description`, `visibility`, `operational_status`, `out_of_service_reason`, `version`                                                                                                                                     | Một bảng cho cả thiết bị và phòng, để `code` unique trên cả hai loại (BR-12). `version` dùng chống ghi đè (BR-17).                                                                                        |
| Equipment                         | `Equipment` extends `Resource` | `resources` (`type = EQUIPMENT`) | —                                                                                                                                                                                                                                                                   | Mỗi bản ghi là một món cụ thể, không có số lượng tồn kho.                                                                                                                                                 |
| Room                              | `Room` extends `Resource`      | `resources` (`type = ROOM`)      | `capacity`                                                                                                                                                                                                                                                          | CHECK: `capacity` bắt buộc khi ROOM, NULL khi EQUIPMENT.                                                                                                                                                  |
| Equipment request                 | `EquipmentRequest`             | `equipment_requests`             | `id`, `borrower_id`, `resource_id`, `purpose`, `proposed_pickup_at`, `confirmed_pickup_at`, `return_due_at`, `status`, `decided_by`, `decided_at`, `decision_reason`, `handed_over_at/by`, `returned_at/by`, `cancellation_cause`, `cancellation_reason`, `version` | **Reservation và Loan là trạng thái của request, không phải entity riêng.** Reservation = APPROVED; Loan = ON_LOAN. `expiry_at` và Overdue đều tính động, không lưu.                                      |
| Room booking                      | `RoomBooking`                  | `room_bookings`                  | `id`, `borrower_id`, `resource_id`, `booking_date`, `first_period`, `last_period`, `start_at`, `end_at`, `headcount`, `purpose`, `status`, `decided_by`, `decided_at`, `decision_reason`, `cancellation_reason`, `version`                                          | `start_at`/`end_at` tính từ tiết học, khoảng nửa mở `[start, end)`. Chống trùng lịch đã duyệt ở mức DB.                                                                                                   |
| Period                            | `Period`                       | `periods`                        | `code` (P1–P8), `session`, `start_time`, `end_time`, `seq`                                                                                                                                                                                                          | Bảng cố định 8 dòng, không sửa khi chạy (BR-03).                                                                                                                                                          |
| History event                     | `HistoryEvent`                 | `history_events`                 | `id`, `event_type`, `actor_id`, `actor_role`, `target_type`, `target_id`, `resource_id`, `from_state`, `to_state`, `reason`, `details` (jsonb), `occurred_at`                                                                                                       | Chỉ thêm, không sửa hay xóa (BR-19). `actor_id` NULL = SYSTEM. `resource_id` NULL khi sự kiện chỉ liên quan tài khoản.                                                                                    |
| State correction                  | `StateCorrection`              | `state_corrections`              | `id`, `operation_code`, `admin_id`, `history_event_id`, `target_type`, `target_id`, `before` (jsonb), `after` (jsonb), `reason`, `applied_at`                                                                                                                       | Chỉ cho CO-01 đến CO-04 (BR-20). Mỗi lần sửa cũng sinh một `HistoryEvent` STATE_CORRECTED; `history_event_id` (unique) trỏ tới sự kiện đó.                                                                |
| Revoked token (chỉ có ở thiết kế) | `RevokedToken`                 | `revoked_tokens`                 | `jti` (khóa chính, không có cột `id`), `account_id`, `expires_at`                                                                                                                                                                                                   | Denylist JWT khi logout: chỉ chặn token của thiết bị đó (FR-01-02, AC-01-02). Không phải bảng session. `ExpiryJob` xóa dòng đã quá `expires_at` (ADR-003, ADR-005).                                       |

Quy ước cột chung: mọi bảng có `id` (uuid), `created_at`, `updated_at`; ngoại lệ: `periods` dùng khóa `code`, `revoked_tokens` dùng khóa `jti`. Khóa ngoại đặt tên `<entity>_id`. Người thực hiện đặt tên `<hành động>_by`.

## Tên trạng thái (enum)

Các giá trị dưới đây dùng nguyên văn cho enum trong class, giá trị CHECK trong bảng và tên state trong state machine. Nhãn hiển thị trên UI (cột cuối) được phép khác, nhưng phải ánh xạ 1–1.

| Enum                     | Giá trị                                                                                | Dùng ở                                                        | Nhãn UI                                                     |
| ------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------- |
| `Role`                   | BORROWER, RESOURCE_MANAGER, ADMIN                                                      | `accounts.role`                                               | Borrower, Resource Manager, Admin                           |
| `AccountStatus`          | ACTIVE, INACTIVE                                                                       | `accounts.status`                                             | Active, Inactive                                            |
| `ResourceType`           | EQUIPMENT, ROOM                                                                        | `resources.type`                                              | Equipment, Room                                             |
| `Visibility`             | VISIBLE, HIDDEN                                                                        | `resources.visibility`                                        | Visible, Hidden                                             |
| `OperationalStatus`      | IN_SERVICE, OUT_OF_SERVICE                                                             | `resources.operational_status`                                | In service, Out of service (Under maintenance chỉ là lý do) |
| `EquipmentRequestStatus` | PENDING, APPROVED, REJECTED, CANCELLED, ON_LOAN, RETURNED                              | `equipment_requests.status`, SM-01                            | Pending, Approved, Rejected, Cancelled, On loan, Returned   |
| `CancellationCause`      | BORROWER, STAFF_OUT_OF_SERVICE, SYSTEM_EXPIRY                                          | `equipment_requests.cancellation_cause`                       | Cancelled by you / by staff / Expired (not collected)       |
| `RoomBookingStatus`      | PENDING, APPROVED, REJECTED, CANCELLED                                                 | `room_bookings.status`, SM-02                                 | Pending, Approved, Rejected, Cancelled                      |
| `DaySession`             | MORNING, AFTERNOON                                                                     | `periods.session`                                             | Morning, Afternoon                                          |
| `TargetType`             | ACCOUNT, RESOURCE, EQUIPMENT_REQUEST, ROOM_BOOKING                                     | `history_events.target_type`, `state_corrections.target_type` | —                                                           |
| `CorrectionOperation`    | CO_01_VOID_HANDOVER, CO_02_VOID_RETURN, CO_03_FIX_EVENT_TIME, CO_04_VOID_ROOM_APPROVAL | `state_corrections.operation_code`                            | Theo BR-20                                                  |

**Giá trị tính động, không lưu vào DB và không là state riêng:**

- **Expired:** request APPROVED với `now ≥ expiry_at`. Job sẽ chuyển sang CANCELLED + SYSTEM_EXPIRY.
- **Overdue:** request ON_LOAN với `now > return_due_at`.
- **Equipment usage** (Not reserved / Reserved / On loan): suy ra từ request đang APPROVED hoặc ON_LOAN của item.
- **Booking đã kết thúc:** APPROVED với `end_at ≤ now`.

**`HistoryEventType`****:** ACCOUNT_REGISTERED, ACCOUNT_CREATED, ACCOUNT_DEACTIVATED, ACCOUNT_REACTIVATED, ROLE_CHANGED, PASSWORD_RESET, RESOURCE_CREATED, RESOURCE_UPDATED, VISIBILITY_CHANGED, OPERATIONAL_STATUS_CHANGED, EQ_REQUEST_SUBMITTED, EQ_REQUEST_APPROVED, EQ_REQUEST_REJECTED, EQ_REQUEST_AUTO_REJECTED, PICKUP_CHANGED, EQ_REQUEST_CANCELLED, EQ_REQUEST_EXPIRED, HANDOVER_RECORDED, RETURN_RECORDED, BOOKING_SUBMITTED, BOOKING_APPROVED, BOOKING_REJECTED, BOOKING_CANCELLED, STATE_CORRECTED. Không có sự kiện overdue (thay đổi #9 ở mục 8).

## Container và component

Có 3 container theo stack PA1. Backend chia thành 9 module NestJS; mỗi module là một component trong Component Diagram và một package trong Class Diagram. Nơi deploy cụ thể chốt trong ADR hosting.

| Mã     | Container  | Công nghệ                            | Vai trò                                               |
| ------ | ---------- | ------------------------------------ | ----------------------------------------------------- |
| CTN-01 | Web App    | React, Vite, TypeScript (SPA)        | Giao diện cho cả 3 vai trò; gọi CTN-02 qua HTTPS/JSON |
| CTN-02 | API Server | NestJS (Node.js, TypeScript), Prisma | Toàn bộ nghiệp vụ, phân quyền, job hết hạn            |
| CTN-03 | Database   | PostgreSQL trên Supabase             | Lưu trữ; ràng buộc chống trùng và chống giữ chỗ đôi   |

| Mã     | Component (module)    | Class chính                                                       | Use case                                           |
| ------ | --------------------- | ----------------------------------------------------------------- | -------------------------------------------------- |
| CMP-01 | `AuthModule`          | `AuthController`, `AuthService`, `SessionGuard`, `RolesGuard`     | UC-01, UC-02                                       |
| CMP-02 | `AccountModule`       | `AccountController`, `AccountService`                             | UC-03 – UC-06                                      |
| CMP-03 | `CatalogModule`       | `ResourceController`, `ResourceService`                           | UC-07 – UC-09                                      |
| CMP-04 | `EquipmentLoanModule` | `EquipmentRequestController`, `EquipmentRequestService`           | UC-10 – UC-16                                      |
| CMP-05 | `RoomBookingModule`   | `RoomBookingController`, `RoomBookingService`, `TimetableService` | UC-17 – UC-20                                      |
| CMP-06 | `HistoryModule`       | `HistoryController`, `HistoryService`                             | UC-21; mọi module ghi sự kiện qua `HistoryService` |
| CMP-07 | `CorrectionModule`    | `CorrectionController`, `CorrectionService`                       | UC-22                                              |
| CMP-08 | `SchedulerModule`     | `ExpiryJob`                                                       | FR-03-13 (tự hết hạn, I-04)                        |
| CMP-09 | `CommonModule`        | `PrismaService`, `Clock` (UTC+7), `HttpExceptionFilter`           | Dùng chung                                         |

Quy ước: Controller chỉ nhận request và trả response; quy tắc nghiệp vụ nằm trong Service. Trong sequence diagram, lifeline đặt theo tên class ở bảng này, và message phải là operation có trong class đó. Frontend chia thư mục `features/` theo đúng tên module (`auth`, `catalog`, `equipment-loan`, …).

## Mã màn hình

Giữ nguyên mã S của PA2 để traceability không bị đứt. Có 3 thay đổi: S10a là frame Borrower tách từ S12 cũ, S12 được thiết kế lại cho RM/Admin, và bản mobile đổi hậu tố thành `m`.

| Mã   | Màn hình                       | Vai trò        | Use case            | Component              |
| ---- | ------------------------------ | -------------- | ------------------- | ---------------------- |
| S01  | Sign in                        | Mọi vai trò    | UC-01, UC-02        | CMP-01                 |
| S11  | Borrower registration          | Chưa đăng nhập | UC-06               | CMP-02                 |
| S02  | Accounts                       | Admin          | UC-03 – UC-05       | CMP-02                 |
| S03  | Catalogue                      | Mọi vai trò    | UC-07               | CMP-03                 |
| S14  | Manage resources               | RM, Admin      | UC-08, UC-09        | CMP-03                 |
| S04  | Equipment request              | Borrower       | UC-10               | CMP-04                 |
| S05  | Equipment requests             | RM, Admin      | UC-11, UC-12        | CMP-04                 |
| S06  | Handover and returns           | RM, Admin      | UC-13, UC-14, UC-16 | CMP-04                 |
| S07  | Room schedule                  | Mọi vai trò    | UC-17               | CMP-05                 |
| S07b | Room schedule – out of service | Mọi vai trò    | UC-17               | CMP-05                 |
| S07m | Room schedule (mobile)         | Borrower       | UC-17               | CMP-05                 |
| S08  | Room booking                   | Borrower       | UC-18               | CMP-05                 |
| S08m | Room booking (mobile)          | Borrower       | UC-18               | CMP-05                 |
| S09  | Room requests                  | RM, Admin      | UC-19               | CMP-05                 |
| S10  | My requests                    | Borrower       | UC-15, UC-20, UC-21 | CMP-04, CMP-05, CMP-06 |
| S10a | Request details and history    | Borrower       | UC-21               | CMP-06                 |
| S12  | Request history                | RM, Admin      | UC-21               | CMP-06                 |
| S13  | State correction               | Admin          | UC-22               | CMP-07                 |

## Mã sơ đồ và quy ước chung

Mỗi sơ đồ có một mã cố định, dùng chung cho tên file, caption trong tài liệu và cột Design của RTM.

| Mã            | Sơ đồ                                        | Người làm | Mục PA3 |
| ------------- | -------------------------------------------- | --------- | ------- |
| C4-L1         | System Context                               | Trang     | 3.2     |
| C4-L2         | Container                                    | Minh      | 3.3     |
| CMP-D         | Component                                    | Minh      | 3.4     |
| DEP-D         | Deployment                                   | Trang     | 3.5     |
| ADR-0xx       | Architecture Decision Record                 | Trang     | 3.6     |
| DM-01         | Domain Model                                 | Phúc      | 4.1     |
| CD-01 … CD-0n | Class Diagram (mỗi package một hình nếu lớn) | Minh      | 4.2     |
| SD-01 … SD-05 | Sequence Diagram (theo bảng 4 use case)      | Minh      | 4.4     |
| SM-01         | State machine `EquipmentRequest`             | Anh       | 4.5     |
| SM-02         | State machine `RoomBooking`                  | Anh       | 4.5     |
| SM-03         | State machine `Account` (nếu còn thời gian)  | Anh       | 4.5     |
| ERD-01        | ERD                                          | Anh       | 5.1     |
| SF-01         | Screen Flow                                  | Phúc      | 6.1     |

**ADR:** PA1 đã có ADR-001 (Technology stack). Quy ước half-open, timestamptz, UTC+7 nằm ở ADR-005. Trang kiểm tra `/docs/design/adr` rồi đánh số tiếp từ ADR-002, không dùng lại số cũ.

**Giữ nguyên mã từ PA2:** FR-xx-yy, NFR-xx, DR-xx, BR-xx, AC-xx-yy, UC-xx, CO-01 … CO-04, I-02 … I-05.

**Thời gian:**

- Lưu `timestamptz` (UTC) trong DB; hiển thị UTC+7 (DR-09).
- API trao đổi chuỗi ISO 8601 có offset, ví dụ `2026-11-18T07:30:00+07:00`.
- Khoảng thời gian luôn nửa mở `[start, end)`.
- Mọi quyết định theo thời gian dùng giờ server lấy qua `Clock`, không dùng giờ client.

**Mã lỗi HTTP thống nhất** (dùng cho sequence, screen spec và PA4):

- 400: dữ liệu không hợp lệ, ví dụ thiếu lý do hoặc sai tiết.
- 401: chưa đăng nhập, phiên hết hạn hoặc tài khoản Inactive.
- 403: sai vai trò hoặc không phải chủ sở hữu.
- 404: không tìm thấy bản ghi. Truy cập request của người khác hoặc tài nguyên bị ẩn vẫn trả 403 chung, không xác nhận bản ghi tồn tại (UC-21 E2).
- 409: xung đột trạng thái, ví dụ đã bị người khác duyệt, trùng lịch hoặc bản ghi cũ.

Quy tắc 401/403 khớp NFR-03 và NFR-05; NFR-06 cấm trả 5xx cho input sai.

## Quy ước vẽ bằng draw.io

Cả nhóm vẽ mọi sơ đồ PA3 bằng draw.io (diagrams.net) và commit cả file nguồn lẫn ảnh xuất ra.

**File và thư mục**

- Mỗi sơ đồ một file trong `/docs/design/diagrams/`, đặt tên `<mã>_<tên-ngắn>.drawio`. Ví dụ: `SD-02_uc11-approve-equipment.drawio`, `SM-01_equipment-request.drawio`.
- Xuất PNG ở scale 200%, border 10 px, bật _Include a copy of my diagram_. File `.drawio.png` vừa chèn vào Word được, vừa mở lại để sửa được.
- Mỗi sơ đồ có ô tiêu đề góc trên: mã, tên, ngày sửa cuối. Nộp qua PR riêng, không push thẳng lên main.

**Thư viện shape**

- C4: gõ "c4" trong ô tìm shape.
- Class, sequence, state: bật thư viện UML.
- ERD: thư viện Entity Relation, ký hiệu crow's foot.

**Kiểu trình bày**

- Font Inter (hoặc Arial) 12 pt, nền trắng, đường và chữ màu `#111827`.
- Màu theo actor, giống sơ đồ use case PA2: Borrower `#2563EB`, Resource Manager `#15803D`, Admin `#7E22CE`, Prospective Borrower #C2410C, System `#475569`.
- Không dùng màu làm cách duy nhất để truyền nghĩa; luôn có nhãn chữ.

**Cách ghi nhãn theo loại sơ đồ**

- **Sequence:** lifeline ghi `:<ClassName>` theo bảng component. Message là operation có trong class, kèm tham số, ví dụ `approve(requestId, confirmedPickupAt)`. Return vẽ nét đứt. Khung `alt` ghi guard dạng `[eligible]` / `[else]`.
- **State machine:** tên state đúng bằng giá trị enum. Transition ghi `event [guard] / action`, ví dụ `handover() [pickupAt ≤ now < expiryAt] / recordHandover`.
- **Class diagram:** package đặt theo tên module (CMP-01 … CMP-09); ghi đủ multiplicity trên mọi association.
- **ERD:** tên bảng và cột đúng như mục Entity; ghi PK, FK, UNIQUE ngay trên hình.
