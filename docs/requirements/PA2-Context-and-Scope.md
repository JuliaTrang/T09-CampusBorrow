# CampusBorrow Simulated Context and Requirements Scope

| Document information | Value |
|---|---|
| Team | T09 – TetraBo |
| Phase | PA2 – Requirements Analysis |
| WBS coverage | 2.1.1 Analyze the simulated context and needs; 2.1.2 Confirm scope with the team |
| Responsible member | Doan Hong Phuc |
| Assigned reviewer | Phan Nhat Anh, according to the master WBS |
| Date | 27 October 2026 |
| Status | Draft for team review; review and PA2 baseline approval pending |

This document defines the simulated business context, user needs and scope for CampusBorrow requirements analysis. It carries forward the agreed F01–F09 Must-have features and distinguishes confirmed project decisions from assumptions that have not been validated through field research. WBS identifiers in this document identify work packages, not section numbers in the PA2 report template.

## 1 Reference Documents

- [PA0 project idea and team contract](../../pa/PA0/T09-PA0.md), particularly the problem statement, user groups, feature identifiers and exclusions.
- [PA1 proposal and plan](../../pa/PA1/T09-PA1.tex), particularly the Vision and scope in section 2 and the WBS in section 4.2.
- [Consolidated project WBS](../WBS/T09_CampusBorrow_WBS_EN.html), particularly work packages 2.1.1–2.1.2 and the subsequent requirements and use-case packages.

The master WBS governs the work covered here. Differences in the W03 report's task descriptions will be reconciled separately by the project manager and do not redefine this document's scope.

## 2 Simulated Context and Needs

### 2.1 Organizational Context

CampusBorrow serves one simulated university unit responsible for shared equipment and classrooms used for academic and club activities. Students and club representatives request resources, designated staff manage those resources, and an administrator oversees accounts, roles and resource assignments.

The simulated unit does not represent a specific faculty, club or department that the team has surveyed. The current workflow and operational problems described below are assumptions used for requirements analysis. They must not be presented as findings from interviews, observations or a field survey.

The system manages four principal business objects:

- **Equipment items:** individually identifiable physical items that can be requested, reserved on approval, handed over and returned.
- **Classrooms:** resources with capacity, availability status and approved booking intervals.
- **Resource requests:** records identifying the requester, resource, purpose, relevant times and processing outcome.
- **Business history:** events associated with request processing and changes to resource states.

### 2.2 Assumed Current Workflow

The unit is assumed to receive requests through forms or messages and maintain resource information and usage records in spreadsheets.

For equipment loans, a borrower contacts a manager to ask about availability and submit a request. The manager checks existing records, approves or rejects the request, confirms a pickup appointment, and records the actual handover and return.

For room bookings, a borrower provides the room, date, start and end times, purpose and attendee count. The manager compares the request with approved bookings and room capacity before deciding whether to approve it.

Because this workflow depends on manual updates across separate records, it may introduce the following problems. Their frequency and impact have not been measured through field research.

| Assumed problem | Potential business impact | System need |
|---|---|---|
| Resource information and usage records are fragmented | Borrowers cannot reliably identify suitable resources | A centralized catalog and a consistent room schedule |
| Equipment reservation records are updated late | Competing requests may be approved for the same item | Consistent availability checks and reservation at approval |
| Room schedules are checked manually | Overlapping bookings may be approved | Conflict prevention when approving bookings |
| Approval and physical handover are not clearly distinguished | Managers cannot reliably identify whether an item is reserved or already collected | Separate records for approval, handover and return |
| Approved requests remain uncollected | Equipment stays reserved without being used | Automatic cancellation of missed pickups and reservation release |
| Return deadlines are not centrally monitored | Overdue loans are difficult to identify | An overdue-loan list |
| Processing history is unstructured | Decisions are difficult to trace and incorrect states are difficult to correct | Business-event records with responsible actors and timestamps |

### 2.3 Users and Responsibilities

| Role | Responsibilities and needs |
|---|---|
| Borrower | A student or club representative who searches resources, submits requests, checks decisions, tracks pickup appointments and return deadlines, cancels where permitted, and views personal request history |
| Resource Manager | A staff member who manages assigned resources, approves or rejects requests within that scope, confirms and changes pickup appointments, records equipment handovers and returns, and monitors overdue loans and history |
| Admin | An administrator who manages accounts, roles and resource assignments globally, supports approvals and equipment handovers/returns, and corrects erroneous resource states with recorded reasons. Changing pickup appointments remains restricted to Resource Managers. |

The resource-owning unit, development team and lecturers/teaching assistants are stakeholders. They do not introduce additional application roles.

### 2.4 Supported Equipment Loan Workflow

1. The Borrower selects one equipment item and submits a request with a purpose and return deadline.
2. An authorized Resource Manager or Admin reviews the request. Approval checks availability and reserves the item consistently so that competing active requests cannot reserve the same item.
3. A pickup appointment is confirmed. A Borrower who needs a different appointment contacts the Resource Manager outside the application; only the Resource Manager may update the appointment.
4. An authorized Resource Manager or Admin records the actual handover. After collection, the Borrower must return the item rather than cancel the request.
5. The actual return is recorded and availability is updated. Loans exceeding their return deadline are identified as overdue.

Borrowers may cancel requests while pending or approved but not yet handed over. An approved request that remains uncollected is automatically cancelled at the expiry threshold of 24 hours after the currently valid confirmed pickup appointment, and the reservation is released. Detailed boundary and concurrency behavior will be specified in subsequent requirements and design work.

### 2.5 Supported Room Booking Workflow

1. The Borrower views approved booking intervals for a selected room and day.
2. The Borrower requests one room on one day, specifying start and end times, purpose and attendee count.
3. The system validates time, capacity and availability. An authorized Resource Manager or Admin approves or rejects the request; approval must prevent overlaps with approved bookings, including concurrent approvals.
4. The Borrower may cancel before the booking starts.

A room marked under maintenance is unavailable for new booking requests. Both the interface and backend must enforce this restriction. If maintenance is recorded after a booking has been approved, the unit handles that booking outside the application. Automatic cancellation, reassignment and rescheduling of such bookings are excluded.

### 2.6 Assumptions and Established Decisions

| Item | Classification | Treatment in PA2 |
|---|---|---|
| One unit, two resource types and three application roles | Established scope decision | Preserve throughout requirements and use cases |
| Forms/messages and spreadsheets constitute the current workflow | Unverified simulation assumption | Use as a modeling premise, not as evidence of actual practice |
| The manual workflow causes the potential problems listed above | Unverified business hypotheses | Do not claim measured frequency, cost or observed impact |
| Admin creates accounts; public self-registration and SSO are excluded | Established scope decision | Specify account administration and authentication within this boundary |
| Equipment handover and return occur physically; authorized staff record them | Selected business model | Specify the required system records without adding physical tracking integrations |
| Borrowers request pickup changes outside the application | Established boundary | Retain Resource Manager appointment editing without requiring F11 |
| Existing bookings affected by later maintenance are handled outside the system | Established boundary | Specify blocking of new bookings without adding automatic remediation workflows |
| Business times are interpreted consistently in UTC+7 | Existing project convention | Apply consistently in requirements, examples and acceptance criteria |

## 3 PA2 Scope Definition

### 3.1 Scope Statement

PA2 specifies basic equipment lending and classroom booking for the simulated unit. F01–F09 form the required feature scope, serving Borrower, Resource Manager and Admin. They remain Must-have features to be implemented by PA5.

Requirements analysis will define behavior, business rules, permissions, error cases and acceptance criteria for these features. Detailed requirements, non-functional requirements and use cases are covered by subsequent WBS packages. This document establishes their business context and scope boundary; it does not replace the complete SRS.

### 3.2 Must-have Features

| ID | Feature | Scope to specify in PA2 | Priority |
|---|---|---|---|
| F01 | Authentication and role-based access control | Login and server-side authorization; Borrowers access their own data, Resource Managers act within assigned-resource scope, and Admin has global access subject to the pickup-time exception | Must-have |
| F02 | Equipment and room catalog | View, search and maintain resources according to permissions; room information, capacity and availability; block new booking requests for rooms under maintenance | Must-have |
| F03 | Equipment requests and approval | One item per request; purpose and return deadline; approval/rejection, availability checks and reservation; confirmed pickup appointments; cancellation before handover; Resource Manager appointment changes; automatic cancellation and reservation release for missed pickups after 24 hours | Must-have |
| F04 | Handover, return and overdue tracking | Record actual handover/return timestamps, update availability and identify overdue loans; require return instead of cancellation after handover | Must-have |
| F05 | Room schedule view | Display approved booking intervals for a selected room and day | Must-have |
| F06 | Room booking requests | One room on one day; start/end times, purpose and attendee count; validate time order, future use, capacity and availability | Must-have |
| F07 | Room booking approval and cancellation | Approve/reject requests, prevent overlaps with approved bookings under concurrent processing, and allow Borrower cancellation before the start time | Must-have |
| F08 | Request and resource-history tracking | View requests within role-based scope; record business events and state changes with actor, timestamp, outcome and reasons where relevant; exclude general click and page-view tracking | Must-have |
| F09 | Global administration | Create/deactivate accounts, assign roles and resources, support operational processing, and correct erroneous states with before/after values and reasons; preserve history after deactivation; restrict pickup-time changes to Resource Managers | Must-have |

### 3.3 Deferred Could-have Features

| ID | Feature | Treatment in the current scope |
|---|---|---|
| F10 | Usage statistics and CSV export | Retained as Could-have in the product vision; excluded from current implementation commitments, work-package decomposition and effort estimates |
| F11 | In-application pickup-change requests | Retained as Could-have; not a required workflow. Borrowers contact Resource Managers outside the application, while Resource Manager appointment editing remains part of F03. |

Deferring F11 does not remove the Resource Manager's ability to change a pickup appointment. The deferred functionality is the Borrower's in-application change-request workflow. Any later inclusion of F10 or F11 requires a separate scope and effort review.

### 3.4 Exclusions

The following capabilities are outside the agreed implementation scope:

- Academic timetable integration, event management and event registration.
- Recurring room bookings or multiple equipment items/rooms in one request.
- Advance equipment scheduling across future intervals and waiting lists. A pickup appointment coordinates collection of an already approved and reserved item.
- Repair workflows, maintenance work orders and maintenance costs; resource availability is still managed.
- Automatic cancellation, room reassignment or rescheduling of approved bookings after a room is marked under maintenance.
- Payments, deposits and monetary penalties.
- Automated email/SMS notifications, single sign-on and real-time chat.
- Multi-unit or multi-campus operation and native mobile applications.

### 3.5 Clarifications Carried Forward from PA0 and PA1

| Topic | Clarification applied in PA2 |
|---|---|
| Evidence for the business problem | PA0's descriptions of manual practices are treated as simulated assumptions. PA1 explicitly states that no actual unit has been surveyed. |
| F08 wording in PA0 | “Every action” is interpreted using PA1 and the master WBS as relevant business events and resource-state changes, not every user interaction. |
| Admin responsibilities | The operational support and state-correction responsibilities clarified in PA1 are retained; pickup-time changes remain a Resource Manager exception. |
| Equipment cancellation and missed pickups | Cancellation before handover and the 24-hour threshold measured from the valid confirmed appointment are retained. |
| Optional pickup-change requests | F11 remains Could-have and does not extend the Must-have scope. |
| Room maintenance | New bookings are blocked; existing approved bookings affected by later maintenance are handled outside the application. |

These clarifications carry forward the PA1 Vision and master WBS. They do not add new Must-have features or represent new findings from field research.

## 4 Review and Handover

### 4.1 Deliverables and Review Criteria

Work packages 2.1.1–2.1.2 provide the simulated context, stakeholder needs, assumed workflow, assumption register and scope definition in this document. Doan Hong Phuc is responsible for the content, and Phan Nhat Anh is assigned to review it under the master WBS.

Review should confirm that:

- Simulated assumptions are clearly distinguished from verified facts and established project decisions.
- All three roles are described consistently, including the Resource Manager-only pickup-time change rule.
- F01–F09 are fully represented at scope level without introducing additional Must-have features.
- F10/F11 remain deferred and the exclusions are consistent with PA1 and the master WBS.
- Equipment cancellation, missed-pickup expiry and room-maintenance boundaries are consistent across the document.
- The scope provides sufficient direction for detailed requirements and use-case work.

Reviewer feedback and its resolution must be recorded before these work packages are marked complete. This draft does not claim completed team review or approval of a PA2 baseline.

### 4.2 Details to Resolve in Subsequent Work

The following details remain to be specified under WBS branch 2.2 and related design work. No additional policy is assumed here:

- Whether maximum loan durations or other borrowing limits are required.
- Whether room operating hours constrain valid booking intervals.
- Exact behavior at expiry, cancellation and return-deadline boundaries, including adjacent room intervals and competing operations.
- Treatment of active requests when an account is deactivated.

These items refine behavior within the agreed feature set. If resolving them requires additional capabilities, the team must assess the scope impact before including those capabilities.
