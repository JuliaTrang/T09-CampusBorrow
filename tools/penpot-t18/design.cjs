// Editable PA3 reconstruction. Coordinates are local to each 1280px board.
const C = {
  bg: "#f7f9fb",
  white: "#ffffff",
  ink: "#102238",
  muted: "#455d7b",
  line: "#c9d6e6",
  blue: "#2563eb",
  pale: "#eff6ff",
  teal: "#007f75",
  green: "#ecfdf5",
  red: "#b91c1c",
  rose: "#fff1f2",
};
const boards = [];
let current;
function board(id, title, height = 900, staff = false, active = "") {
  current = { id, title, width: 1280, height, layers: [] };
  boards.push(current);
  if (id === "S01") return;
  rect("Sidebar", 0, 0, 248, height, C.white, C.line, 0);
  rect("Brand mark", 16, 20, 32, 32, C.blue, null, 8);
  text("CB", 20, 27, 26, 18, 13, C.white, 700);
  text("CampusBorrow", 58, 26, 180, 28, 19, C.ink, 700);
  text(staff ? "RESOURCE MANAGER" : "BORROWER", 16, 78, 220, 20, 12, C.muted, 700);
  const nav = staff
    ? [
        "Catalogue",
        "Manage resources",
        "Equipment requests",
        "Handover and returns",
        "Room requests",
        "Room schedule",
        "Request history",
      ]
    : ["Catalogue", "Room schedule", "My requests"];
  const control = { S05: "S05-08", S06: "S06-07", S09: "S09-07" }[id];
  nav.forEach((n, i) =>
    button(
      `${control || id + "-nav"} / ${n}`,
      n,
      16,
      100 + i * 44,
      216,
      40,
      n === active ? "selected" : "nav",
      { "Equipment requests": "S05", "Handover and returns": "S06", "Room requests": "S09" }[n],
    ),
  );
  text(staff ? "Demo Manager" : "Demo Borrower", 16, height - 65, 145, 22, 14, C.ink, 700);
  text(staff ? "Resource Manager" : "Borrower", 16, height - 40, 145, 20, 12, C.muted);
  button("S01-06 / Sign out", "Sign out", 166, height - 58, 66, 34, "outline", "S01");
  text(staff ? "RESOURCE MANAGER" : "BORROWER", 280, 32, 450, 20, 13, staff ? C.teal : C.blue, 700);
  text(title, 280, 58, 940, 42, 30, C.ink, 700);
  text("Times shown in UTC+7", 280, 105, 720, 24, 14, C.muted);
  badge(id, 1170, 32, 78);
}
function add(o) {
  current.layers.push(o);
  return o;
}
function rect(name, x, y, w, h, fill = C.white, stroke = C.line, r = 10) {
  return add({ type: "rect", name, x, y, w, h, fill, stroke, r });
}
function text(value, x, y, w, h = 24, size = 14, color = C.ink, weight = 400, name = value) {
  return add({ type: "text", name, x, y, w, h, text: value, size, color, weight });
}
function group(name, fn, target) {
  const start = current.layers.length;
  fn();
  const children = current.layers.splice(start);
  // Penpot rejects navigation to the shape's own containing board.
  return add({ type: "group", name, children, target: target === current.id ? undefined : target });
}
function card(name, x, y, w, h) {
  rect(name, x, y, w, h);
}
function badge(label, x, y, w = 120, error = false) {
  group(label, () => {
    rect("Pill", x, y, w, 26, error ? C.rose : C.green, null, 13);
    text(label, x + 10, y + 4, w - 20, 18, 12, error ? C.red : C.teal, 600);
  });
}
function button(name, label, x, y, w = 180, h = 44, style = "primary", target) {
  return group(
    name,
    () => {
      const fill = style === "primary" ? C.blue : style === "selected" ? C.pale : C.white;
      const color =
        style === "primary"
          ? C.white
          : style === "danger"
            ? C.red
            : style === "nav"
              ? C.ink
              : C.blue;
      rect(
        "Button background",
        x,
        y,
        w,
        h,
        fill,
        style === "nav" || style === "selected" ? null : color,
        8,
      );
      const compact = w < 100;
      const t = text(
        label,
        x + (compact ? 8 : 12),
        y + (h - 20) / 2,
        w - (compact ? 16 : 24),
        20,
        compact ? 12 : 14,
        color,
        600,
        "Button label",
      );
      if (style !== "nav" && style !== "selected") t.align = "center";
    },
    target,
  );
}
function field(id, label, value, x, y, w = 430, h = 44, readonly = false) {
  group(id + " / " + label, () => {
    text(label, x, y, w, 22, 14, C.ink, 600, "Field label");
    rect(
      "Field background",
      x,
      y + 28,
      w,
      h,
      readonly ? C.bg : C.white,
      readonly ? C.line : "#7085a0",
      8,
    );
    text(value, x + 12, y + 40, w - 24, h - 16, 14, C.muted, 400, "Field value");
  });
}
function notice(id, title, body, x, y, w, h = 110, error = false) {
  group(id + " / " + title, () => {
    rect(
      "Message background",
      x,
      y,
      w,
      h,
      error ? C.rose : C.pale,
      error ? "#f5a6ad" : "#a7c2f7",
      8,
    );
    text(title, x + 16, y + 14, w - 32, 24, 15, error ? C.red : C.blue, 700);
    text(body, x + 16, y + 44, w - 32, h - 52, 14, error ? C.red : C.muted);
  });
}
function small(s, x, y, w = 420, h = 46) {
  text(s, x, y, w, h, 13, C.muted);
}

board("S01", "Sign in", 800);
text("CampusBorrow", 420, 118, 440, 38, 25, C.blue, 700).align = "center";
card("Sign-in card", 420, 174, 440, 528);
text("Sign in", 448, 205, 384, 42, 30, C.ink, 700);
small("Sign in with your username or email.", 448, 252, 384, 22);
field("S01-01", "Username or email", "Enter username or email", 448, 290, 384);
field("S01-02", "Password", "•••••••••••••••", 448, 378, 384);
button("S01-03 / Sign in", "Sign in", 448, 468, 384);
button("S01-05 / Create Borrower account", "Create Borrower account", 448, 526, 384, 44, "outline");
notice(
  "S01-04",
  "Authentication error variant",
  "Unable to sign in. Check your username or email\nand password.",
  448,
  586,
  384,
  96,
  true,
);

board("S04", "Request equipment", 900, false, "Catalogue");
card("Request form", 280, 148, 472, 596);
text("EQ-003 Camcorder", 302, 172, 428, 28, 18, C.ink, 700, "S04-01 / Selected equipment");
badge("In service", 302, 210, 110);
badge("Not reserved", 426, 210, 125);
field("S04-02", "Purpose *", "Describe what you need the equipment for", 302, 258, 428, 86);
field("S04-03", "Proposed pickup *", "23 Nov 2026, 10:00", 302, 394, 428);
field("S04-04", "Return deadline *", "24 Nov 2026, 18:00", 302, 490, 428);
small("Pickup must be in the future and before the return deadline.", 302, 584, 420);
button("S04-05 / Submit request", "Submit request", 302, 650, 180);
button("S04-06 / Back", "Back to catalogue", 498, 650, 232, 44, "outline");
card("Unavailable variant", 776, 148, 472, 294);
text("Alternative state: item unavailable", 798, 172, 428, 32, 18, C.ink, 700);
notice(
  "S04-07",
  "Request blocked",
  "This item is no longer available for request.\nRefresh the catalogue and choose another item.",
  798,
  220,
  428,
  110,
  true,
);
button("S04-06 / Unavailable back", "Back to catalogue", 798, 366, 210, 44, "outline");
notice(
  "S04-07",
  "Submission success variant",
  "Request submitted as Pending.\nThe item is not reserved until approval.",
  776,
  466,
  472,
  110,
);

board("S05", "Equipment requests", 1120, true, "Equipment requests");
card("Pending queue", 280, 148, 560, 408);
text("Pending requests", 302, 174, 516, 28, 18, C.ink, 700, "S05-01 / Requests and selection");
rect("Table header", 302, 216, 516, 40, C.bg, null, 0);
text("REQUEST / BORROWER", 314, 228, 210, 20, 12, C.muted, 600);
text("EQUIPMENT / PURPOSE", 534, 228, 260, 20, 12, C.muted, 600);
text("a12f…9b30 · Borrower B", 314, 280, 240, 28);
text("EQ-003 Camcorder", 534, 280, 260, 28, 15, C.ink, 600);
small("Event recording · Return 24 Nov, 18:00", 314, 318, 480, 25);
button("S05-01 / Review selected", "Review request", 314, 360, 180, 44, "outline");
text("c38d…720a · Borrower C", 314, 430, 240, 24);
small("Same item · Thesis rehearsal", 534, 430, 270, 24);
small(
  "Approval reserves the item and rejects competing\nPending requests for the same item.",
  302,
  482,
  510,
  48,
);
card("Decision panel", 864, 148, 384, 490);
text("Review selected request", 886, 174, 340, 30, 18, C.ink, 700);
badge("Pending", 886, 216, 100);
field("S05-02", "Confirmed pickup *", "23 Nov 2026, 08:00", 886, 268, 340);
field(
  "S05-04",
  "Rejection reason * when rejecting",
  "Explain why the request is rejected",
  886,
  366,
  340,
  76,
);
small(
  "Enter 1–500 characters after trimming.\nThe Borrower will see this reason.",
  886,
  482,
  340,
  48,
);
button("S05-03 / Approve", "Approve and reserve", 886, 558, 210);
button("S05-05 / Reject", "Reject", 1110, 558, 116, 44, "danger");
card("Approved variant - RM only", 280, 664, 968, 370);
text("Approved request · Change pickup (RM only)", 302, 690, 920, 32, 20, C.ink, 700);
small("b14e…c204 · EQ-001 Projector · Borrower A", 302, 732, 510, 24);
field("S05-06", "New confirmed pickup *", "23 Nov 2026, 08:00", 302, 778, 460);
button("S05-06 / Change pickup", "Change pickup", 302, 878, 210);
small(
  "Only while Approved, uncollected and not expired.\nReplacement must be in the future and before return.",
  302,
  948,
  490,
  48,
);
text("Return deadline", 800, 746, 420, 24, 14, C.muted, 600, "S05-07 / Return deadline");
text("24 Nov 2026, 18:00", 800, 778, 420, 28, 19, C.ink, 700);
text("Collect before", 800, 836, 420, 24, 14, C.muted, 600, "S05-07 / Collect before");
text("24 Nov 2026, 08:00", 800, 868, 420, 28, 19, C.teal, 700);
small(
  "Earlier of pickup + 24 hours and return deadline.\nAdmin and Borrower cannot change pickup.",
  800,
  926,
  420,
  60,
);

board("S06", "Handover and returns", 1100, true, "Handover and returns");
card("Approved reservation", 280, 148, 472, 360);
text(
  "Approved reservation · EQ-001 Projector",
  302,
  174,
  428,
  32,
  18,
  C.ink,
  700,
  "S06-01 / Reservations",
);
badge("Approved", 302, 218);
text(
  "Confirmed pickup: 23 Nov 2026, 08:00\nCollect before: 24 Nov 2026, 08:00\nReturn deadline: 24 Nov 2026, 18:00",
  302,
  268,
  428,
  84,
  15,
  C.ink,
  400,
  "S06-02 / Pickup window",
);
button("S06-03 / Record handover", "Record handover", 302, 378, 428);
small(
  "Confirm the person and physical handover.\nAvailable from pickup until, but not including, expiry.",
  302,
  446,
  428,
  48,
);
card("Active loan", 776, 148, 472, 360);
text("Active loan · EQ-004 Laptop", 798, 174, 428, 32, 18, C.ink, 700, "S06-01 / Loans");
badge("Overdue", 798, 218, 110, true);
text("Borrower C\nReturn deadline: 21 Nov 2026, 17:00", 798, 268, 428, 64, 15);
button("S06-04 / Record return", "Record return", 798, 378, 428);
small(
  "Confirm physical receipt. Inactive Borrowers and\nout-of-service items can still have returns recorded.",
  798,
  446,
  428,
  48,
);
notice(
  "S06-06",
  "Too early — handover unavailable",
  "The collection window has not opened yet.\nThe request remains Approved. No handover is recorded.",
  280,
  536,
  472,
  122,
);
notice(
  "S06-06",
  "Collection window expired",
  "This request has expired and was cancelled.\nThe reservation is released; refresh the request list.",
  776,
  536,
  472,
  122,
  true,
);
card("Overdue list", 280, 686, 968, 156);
text("Overdue loans", 302, 708, 920, 30, 19, C.ink, 700, "S06-05 / Overdue list");
text("EQ-004 Laptop    ·    Borrower C    ·    Return due 21 Nov 2026, 17:00", 302, 758, 920, 28);
small("Overdue is informational. No fines or notifications are implied.", 302, 800, 920, 24);
card("Confirmation design", 280, 868, 968, 164);
text(
  "Confirm physical receipt of EQ-004 Laptop?",
  302,
  892,
  920,
  30,
  19,
  C.ink,
  700,
  "S06-04 / Confirmation",
);
small(
  "Recording a return preserves the item’s visibility and operational status.",
  302,
  930,
  920,
  24,
);
button("S06-04 / Confirm return", "Confirm return", 302, 972, 190);
button("S06-04 / Cancel confirmation", "Cancel", 508, 972, 120, 44, "outline");

board("S08", "Request a room booking", 1200, false, "Room schedule");
card("Room booking form", 280, 148, 566, 754);
field("S08-01", "Room", "R-01 · Capacity 30 · In service", 302, 174, 522, 44, true);
field("S08-02", "Booking date *", "25 Nov 2026", 302, 268, 522);
field("S08-03", "First period *", "P2 · 08:15–09:00", 302, 362, 252);
field("S08-04", "Last period *", "P3 · 09:30–10:15", 572, 362, 252);
field(
  "S08-05",
  "Derived reservation interval",
  "08:15–10:15 (120 minutes including break)",
  302,
  456,
  522,
  44,
  true,
);
field("S08-06", "Headcount *", "28", 302, 550, 150);
field("S08-07", "Purpose *", "Student club meeting", 472, 550, 352);
small(
  "Choose consecutive periods within Morning or Afternoon.\nThe room is held through intervening breaks.\nA successful request is Pending and does not reserve the room.",
  302,
  656,
  522,
  76,
);
button("S08-08 / Submit booking", "Submit request", 302, 762, 190);
button("S08-09 / Back to schedule", "Back to schedule", 510, 762, 220, 44, "outline");
small(
  "Tab order: Date → First → Last → Headcount → Purpose\n→ Submit → Back. Room and derived times are read-only.",
  302,
  834,
  522,
  48,
);
card("Fixed timetable", 870, 148, 378, 340);
text("Fixed timetable", 892, 174, 334, 30, 19, C.ink, 700);
text(
  "MORNING\nP1 07:30–08:15 · P2 08:15–09:00\nBreak 09:00–09:30\nP3 09:30–10:15 · P4 10:15–11:00\n\nAFTERNOON\nP5 13:30–14:15 · P6 14:15–15:00\nBreak 15:00–15:30\nP7 15:30–16:15 · P8 16:15–17:00",
  892,
  226,
  334,
  238,
  14,
  C.muted,
);
text("Independent validation variants", 870, 518, 378, 30, 18, C.ink, 700);
notice(
  "S08-10",
  "Schedule conflict",
  "This interval is no longer available.\nChoose different periods; your input is retained.",
  870,
  568,
  378,
  120,
  true,
);
notice(
  "S08-10",
  "Capacity exceeded",
  "31 attendees exceeds capacity 30.\nReduce the headcount to submit.",
  870,
  708,
  378,
  112,
  true,
);
notice(
  "S08-10",
  "Cross-session selection",
  "P4–P5 spans Morning and Afternoon.\nSubmit two separate requests.",
  870,
  840,
  378,
  112,
  true,
);
notice(
  "S08-10",
  "Break-only selection invalid",
  "Breaks are not selectable periods.\nSelect one or more teaching periods.",
  870,
  972,
  378,
  112,
  true,
);

board("S09", "Room booking requests", 1060, true, "Room requests");
card("Pending room requests", 280, 148, 560, 470);
text("Pending room booking requests", 302, 174, 516, 30, 18, C.ink, 700, "S09-01 / Queue");
rect("Table header", 302, 220, 516, 40, C.bg, null, 0);
text("ROOM / REQUESTER", 314, 232, 250, 20, 12, C.muted, 600);
text("PERIODS / HEADCOUNT", 572, 232, 234, 20, 12, C.muted, 600);
text("R-01 · Demo Borrower", 314, 286, 246, 24, 15, C.ink, 600);
text("P2–P3 · 20 people", 572, 286, 234, 24);
small("25 Nov 2026 · Student club meeting", 314, 326, 490, 24);
button("S09-01 / Review booking", "Review request", 314, 370, 190, 44, "outline");
text("R-01 · Borrower C", 314, 450, 246, 24, 15, C.ink, 600);
text("P2–P3 · 12 people", 572, 450, 234, 24);
small("25 Nov 2026 · Thesis rehearsal", 314, 490, 490, 24);
small("All Resource Managers have equal unit-wide access.", 302, 562, 516, 24);
card("Room decision", 864, 148, 384, 666);
text("Review · R-01 · Demo Borrower", 886, 174, 340, 52, 18, C.ink, 700);
field("S09-02", "Configured periods", "P2–P3 · 25 Nov 2026", 886, 244, 340, 44, true);
field("S09-02", "Derived start / end", "08:15–10:15 UTC+7", 886, 338, 340, 44, true);
notice(
  "S09-02",
  "Eligible for approval",
  "Visible · In service · Capacity 30\n20 attendees · No approved overlap",
  886,
  432,
  340,
  114,
);
field(
  "S09-04",
  "Rejection reason * when rejecting",
  "Explain why the booking is rejected",
  886,
  570,
  340,
  76,
);
small("Required for rejection: 1–500 trimmed characters.", 886, 688, 340, 42);
button("S09-03 / Approve", "Approve", 886, 746, 162);
button("S09-05 / Reject", "Reject", 1064, 746, 162, 44, "danger");
notice(
  "S09-06",
  "Approval conflict variant",
  "This room interval is no longer available. Refresh and review the request.\nThe request remains Pending unless another valid action changed it.\nCompeting room requests are not automatically rejected.",
  280,
  844,
  968,
  134,
  true,
);

module.exports = { boards, C };
