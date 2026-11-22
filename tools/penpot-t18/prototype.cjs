// Fixed, reviewable click-through scenarios. No authentication or backend writes.
const base = require("./design.cjs");
const C = base.C,
  boards = [],
  bindings = [];
let current;
const flat = (a) => a.flatMap((x) => [x, ...flat(x.children || [])]);
const nav = (target) => ({ type: "navigate-to", target });
const overlay = (target) => ({ type: "open-overlay", target });
const close = { type: "close-overlay" };
function bind(board, name, action) {
  const old = bindings.find((b) => b.board === board && b.name === name);
  if (old) old.action = action;
  else bindings.push({ board, name, action });
}
function add(o) {
  current.layers.push(o);
  return o;
}
function wrap(value, w, size) {
  const limit = Math.floor(w / (size * 0.58));
  return value
    .split("\n")
    .map((line) => {
      const lines = [];
      let row = "";
      for (const word of line.split(" ")) {
        if (row && row.length + word.length + 1 > limit) {
          lines.push(row);
          row = word;
        } else row += (row ? " " : "") + word;
      }
      lines.push(row);
      return lines.join("\n");
    })
    .join("\n");
}
function text(value, x, y, w, h = 30, size = 16, color = C.ink, weight = 400, name = value) {
  return add({ type: "text", name, x, y, w, h, text: wrap(value, w, size), size, color, weight });
}
function rect(name, x, y, w, h, fill = C.white, stroke = C.line, r = 10) {
  return add({ type: "rect", name, x, y, w, h, fill, stroke, r });
}
function button(name, label, x, y, w, target, kind = "primary") {
  const start = current.layers.length;
  rect(
    "Button background",
    x,
    y,
    w,
    44,
    kind === "primary" ? C.blue : C.white,
    kind === "danger" ? C.red : C.blue,
    8,
  );
  const t = text(
    label,
    x + 12,
    y + 12,
    w - 24,
    22,
    14,
    kind === "primary" ? C.white : kind === "danger" ? C.red : C.blue,
    600,
    "Button label",
  );
  t.align = "center";
  const children = current.layers.splice(start);
  add({ type: "group", name, children });
  if (target) bind(current.id, name, target);
}
function field(name, label, value, x, y, w = 720) {
  const start = current.layers.length;
  text(label, x, y, w, 24, 14, C.ink, 600, "Field label");
  rect("Field background", x, y + 30, w, 48);
  text(value, x + 12, y + 42, w - 24, 24, 14, C.muted, 400, "Field value");
  add({ type: "group", name, children: current.layers.splice(start) });
}
function panel(title, body, x = 300, y = 164, w = 928, h = 250, color = C.pale) {
  rect(title + " card", x, y, w, h, color);
  text(title, x + 24, y + 24, w - 48, 38, 24, C.ink, 700);
  text(body, x + 24, y + 84, w - 48, h - 100, 16, C.muted);
}
const eqFor = (role) => (role === "A" ? "S05_A" : "S05");
const handFor = (role) => (role === "A" ? "S06_A" : "S06");
const roomFor = (role) => (role === "A" ? "S09_A" : "S09");
function navTarget(label, role) {
  return {
    Catalogue: "CAT_" + role,
    "Room schedule": "SCHEDULE_" + role,
    "My requests": "MY_REQUESTS",
    "Manage resources": "RESOURCES_" + role,
    "Equipment requests": eqFor(role),
    "Handover and returns": handFor(role),
    "Room requests": roomFor(role),
    "Request history": "HISTORY_" + role,
  }[label];
}
function screen(id, title, role = "B", height = 900) {
  current = { id, title, width: 1280, height, layers: [], role };
  boards.push(current);
  rect("Sidebar", 0, 0, 248, height, C.white, C.line, 0);
  text("CampusBorrow", 24, 28, 208, 32, 22, C.blue, 700);
  text(
    { B: "BORROWER", M: "RESOURCE MANAGER", A: "ADMIN" }[role],
    24,
    82,
    208,
    24,
    12,
    C.muted,
    700,
  );
  const labels =
    role === "B"
      ? ["Catalogue", "Room schedule", "My requests"]
      : [
          "Catalogue",
          "Manage resources",
          "Equipment requests",
          "Handover and returns",
          "Room requests",
          "Room schedule",
          "Request history",
        ];
  labels.forEach((label, i) => {
    const target = navTarget(label, role);
    button(
      "Nav / " + label,
      label,
      16,
      126 + i * 52,
      216,
      target === id ? null : nav(target),
      "outline",
    );
  });
  button("Nav / Sign out", "Sign out", 24, height - 72, 200, nav("AUTH_" + role), "outline");
  text(title, 280, 54, 940, 46, 30, C.ink, 700);
  text("Times shown in UTC+7", 280, 108, 600, 24, 14, C.muted);
  if (id !== "REVIEW")
    button(
      "Review scenarios",
      "Prototype scenarios",
      1010,
      height - 72,
      238,
      nav("REVIEW"),
      "outline",
    );
  return current;
}
function modal(id, title, body, confirmLabel, target) {
  current = { id, title, width: 600, height: 390, layers: [], overlay: true };
  boards.push(current);
  rect("Dialog", 0, 0, 600, 390, C.white, C.line, 12);
  text(title, 32, 32, 536, 70, 26, C.ink, 700);
  text(body, 32, 120, 536, 160, 16, C.muted);
  button("Confirm", confirmLabel, 32, 310, 340, target);
  button("Cancel", "Cancel", 388, 310, 180, close, "outline");
}
function cloneScreen(id, source, role) {
  current = structuredClone(base.boards.find((b) => b.id === source));
  current.id = id;
  current.role = role;
  current.title += " — " + id;
  boards.push(current);
  if (role === "A")
    for (const n of flat(current.layers)) {
      if (n.type === "text")
        n.text = n.text
          .replaceAll("RESOURCE MANAGER", "ADMIN")
          .replaceAll("Demo Manager", "Demo Admin")
          .replaceAll("Resource Manager", "Admin");
    }
  return current;
}
function setField(b, id, value) {
  const g = flat(b.layers).find((n) => n.type === "group" && n.name.startsWith(id + " / "));
  if (g) {
    const t = g.children.find((n) => n.name === "Field value");
    t.text = wrap(value, t.w, t.size);
  }
}
function routeSidebar(b, role) {
  for (const g of flat(b.layers).filter((n) => n.type === "group")) {
    const label = g.children?.find((n) => n.name === "Button label")?.text;
    const isSidebar = /^(S\d\d-nav|S05-08|S06-07|S09-07) \/ /.test(g.name);
    if (isSidebar) {
      const target = navTarget(label, role);
      if (target && target !== b.id) bind(b.id, g.name, nav(target));
    }
    if (g.name === "S01-06 / Sign out") bind(b.id, g.name, nav("S01"));
  }
}

// Scenario selection is outside the product sign-in flow.
screen("REVIEW", "CampusBorrow · Prototype review", "B", 1180);
current.layers = current.layers.filter((n) => !(n.type === "group" && n.name.startsWith("Nav /")));
panel(
  "Choose a demo journey",
  "Use the buttons to move through fixed sample states.\nForm values are examples; this prototype does not accept free typing or save data.\nEach journey starts a fresh example. Times shown are scenario times, not a live clock.",
  280,
  154,
  968,
  210,
);
button("Borrower journey", "Borrower sign in", 304, 392, 280, nav("AUTH_B"));
button("Manager journey", "Manager sign in", 612, 392, 280, nav("AUTH_M"));
button("Admin journey", "Admin sign in", 920, 392, 280, nav("AUTH_A"));
text("Validation and conflict scenarios", 304, 476, 900, 36, 23, C.ink, 700);
const errorChoices = [
  ["Login failure", "LOGIN_ERROR"],
  ["Missing purpose", "EQ_INVALID"],
  ["Equipment unavailable", "EQ_UNAVAILABLE"],
  ["Early handover", "EARLY"],
  ["Collection window expired", "EXPIRED"],
  ["Room overlap", "ROOM_CONFLICT"],
  ["Capacity exceeded", "ROOM_CAPACITY"],
  ["Cross-session periods", "ROOM_PERIODS"],
  ["Decision changed", "STALE"],
  ["Pickup edit denied to Admin", "PICKUP_DENIED"],
];
errorChoices.forEach(([label, id], i) =>
  button(
    "Scenario / " + id,
    label,
    304 + (i % 2) * 464,
    536 + Math.floor(i / 2) * 86,
    440,
    nav(id),
    "outline",
  ),
);

for (const role of ["B", "M", "A"]) {
  const b = cloneScreen("AUTH_" + role, "S01", role);
  b.layers = b.layers.filter((n) => !n.name.startsWith("S01-04"));
  setField(b, "S01-01", { B: "demo.borrower", M: "demo.manager", A: "demo.admin" }[role]);
  bind(b.id, "S01-03 / Sign in", nav(role === "B" ? "CAT_B" : eqFor(role)));
  bind(b.id, "S01-05 / Create Borrower account", nav("REGISTER"));
  button("Review scenarios", "Prototype scenarios", 448, 606, 384, nav("REVIEW"), "outline");
}
bind("S01", "S01-03 / Sign in", nav("S05"));
bind("S01", "S01-05 / Create Borrower account", nav("REGISTER"));
for (const [id, role] of [
  ["S04", "B"],
  ["S08", "B"],
  ["S05", "M"],
  ["S06", "M"],
  ["S09", "M"],
])
  routeSidebar(
    base.boards.find((b) => b.id === id),
    role,
  );
for (const id of ["S05", "S06", "S09"]) {
  const b = cloneScreen(id + "_A", id, "A");
  if (id === "S05")
    b.layers = b.layers.filter((n) => {
      const leaves = flat([n]).filter((x) => x.type !== "group");
      return !leaves.every((x) => x.x >= 280 && x.y >= 664);
    });
  routeSidebar(b, "A");
}

for (const role of ["B", "M", "A"]) {
  screen("CAT_" + role, "Catalogue", role);
  panel(
    "EQ-003 Camcorder",
    "Collection: Equipment desk, Building A\nIn service · Not reserved\nOne physical item per request.",
    280,
    160,
    968,
    224,
  );
  button(
    "Open equipment",
    role === "B" ? "Request equipment" : "Open equipment requests",
    304,
    412,
    360,
    nav(role === "B" ? "S04" : eqFor(role)),
  );
  panel(
    "R-01 Meeting room",
    "Building B · Capacity 30\nView available teaching periods before requesting a room.",
    280,
    504,
    968,
    184,
  );
  button("Open rooms", "View room schedule", 304, 716, 360, nav("SCHEDULE_" + role));
  screen("SCHEDULE_" + role, "Room schedule", role);
  panel(
    "R-01 · 25 Nov 2026",
    "Morning\nP1 07:30–08:15   P2 08:15–09:00   P3 09:30–10:15   P4 10:15–11:00\nAfternoon\nP5 13:30–14:15   P6 14:15–15:00   P7 15:30–16:15   P8 16:15–17:00\nBreaks: 09:00–09:30 and 15:00–15:30. P2–P3 holds 08:15–10:15.",
    280,
    160,
    968,
    300,
  );
  button(
    "Select room",
    role === "B" ? "Request P2–P3" : "Review room requests",
    304,
    500,
    360,
    nav(role === "B" ? "S08" : roomFor(role)),
  );
  if (role !== "B") {
    screen("RESOURCES_" + role, "Manage resources", role);
    panel(
      "Resource overview",
      "EQ-003 Camcorder · Visible · In service\nEQ-001 Projector · Visible · In service\nEQ-004 Laptop · Hidden · Out of service\nR-01 Meeting room · Visible · In service · Capacity 30",
      280,
      160,
      968,
      280,
    );
    button("Resource equipment", "Review equipment requests", 304, 478, 390, nav(eqFor(role)));
    button("Resource returns", "Receive an item", 720, 478, 390, nav(handFor(role)));
    text("Resource editing is outside the selected T18 workflows.", 304, 570, 900, 32, 16, C.muted);
    screen("HISTORY_" + role, "Request history", role);
    panel(
      "Historical example · EQ-004 Laptop",
      "19 Nov, 09:00 · Request approved\n19 Nov, 10:00 · Physical handover recorded\n21 Nov, 17:00 · Return deadline\nCurrent record: On loan. The deadline itself does not create a return event.",
      280,
      160,
      968,
      270,
    );
    button("History loan", "Open current loan", 304, 470, 360, nav(handFor(role)));
  }
}

screen("MY_REQUESTS", "My requests", "B");
panel(
  "EQ-003 Camcorder · Pending",
  "Purpose: Event recording\nProposed pickup: 23 Nov 2026, 10:00\nReturn deadline: 24 Nov 2026, 18:00\nPending requests do not reserve equipment.",
  280,
  160,
  968,
  260,
);
button("Equipment details", "View equipment request", 304, 444, 360, nav("EQ_PENDING"));
panel(
  "R-01 · Pending",
  "25 Nov 2026 · P2–P3 · 08:15–10:15 UTC+7\n28 attendees · Student club meeting\nPending bookings do not reserve a room.",
  280,
  524,
  968,
  196,
);
button("Room details", "View room request", 304, 744, 360, nav("ROOM_PENDING"));

screen("REGISTER", "Create Borrower account", "B", 1000);
field("Registration / name", "Display name", "Demo Borrower", 304, 174);
field("Registration / username", "Username", "demo.borrower", 304, 282);
field("Registration / email", "Email", "borrower@example.edu", 304, 390);
field("Registration / password", "Password · 15–64 characters", "••••••••••••••••••", 304, 498);
button("Create account", "Create Borrower account", 304, 628, 360, nav("REGISTERED"));
button("Back to sign in", "Back to sign in", 688, 628, 300, nav("AUTH_B"), "outline");
screen("REGISTERED", "Account created", "B");
panel(
  "Your Borrower account is ready",
  "Sign in with your username or email to request equipment or book a room.",
  280,
  160,
  968,
  180,
);
button("Sign in", "Go to sign in", 304, 380, 360, nav("AUTH_B"));

const ready = cloneScreen("S04_READY", "S04", "B");
setField(ready, "S04-02", "Event recording");
routeSidebar(ready, "B");
for (const id of ["S04", "S04_READY"]) {
  bind(id, "S04-02 / Purpose *", nav("S04_READY"));
  bind(id, "S04-03 / Proposed pickup *", nav("S04_READY"));
  bind(id, "S04-04 / Return deadline *", nav("S04_READY"));
  bind(id, "S04-06 / Back", nav("CAT_B"));
  bind(id, "S04-06 / Unavailable back", nav("CAT_B"));
  bind(
    id,
    "S04-05 / Submit request",
    id === "S04" ? nav("EQ_INVALID") : overlay("CONFIRM_EQ_SUBMIT"),
  );
}
// Ready-state fields already display the chosen sample; avoid same-board links.
for (let i = bindings.length - 1; i >= 0; i--)
  if (bindings[i].action.target === bindings[i].board) bindings.splice(i, 1);
modal(
  "CONFIRM_EQ_SUBMIT",
  "Submit equipment request?",
  "EQ-003 Camcorder · Event recording\nPickup: 23 Nov 2026, 10:00\nReturn: 24 Nov 2026, 18:00\nThe new request will be Pending, without a reservation.",
  "Confirm request",
  nav("EQ_PENDING"),
);
screen("EQ_PENDING", "Equipment request submitted", "B");
panel(
  "EQ-003 Camcorder · Pending",
  "Purpose: Event recording\nProposed pickup: 23 Nov 2026, 10:00\nReturn deadline: 24 Nov 2026, 18:00\nYour request is awaiting staff review. The item is not reserved.",
  280,
  160,
  968,
  270,
);
button("My requests", "Back to My requests", 304, 470, 360, nav("MY_REQUESTS"));
bind("S08", "S08-08 / Submit booking", overlay("CONFIRM_ROOM_SUBMIT"));
bind("S08", "S08-09 / Back to schedule", nav("SCHEDULE_B"));
modal(
  "CONFIRM_ROOM_SUBMIT",
  "Submit room booking?",
  "R-01 · 25 Nov 2026 · P2–P3\nRoom held 08:15–10:15, including the break\n28 attendees · Student club meeting\nThe new request will be Pending, without occupancy.",
  "Confirm booking",
  nav("ROOM_PENDING"),
);
screen("ROOM_PENDING", "Room booking submitted", "B");
panel(
  "R-01 · Pending",
  "25 Nov 2026 · P2–P3 · 08:15–10:15 UTC+7\n28 attendees · Student club meeting\nYour booking is awaiting staff review. The room is not reserved.",
  280,
  160,
  968,
  230,
);
button("My requests", "Back to My requests", 304, 430, 360, nav("MY_REQUESTS"));

function outcome(id, title, role, heading, body, back, label = "Back to requests") {
  screen(id, title, role);
  panel(heading, body, 280, 160, 968, 320);
  button("Back", label, 304, 520, 360, nav(back));
}
function actionFlow(key, role, title, question, body, resultBody, back) {
  modal("CONFIRM_" + key + "_" + role, question, body, "Confirm", nav(key + "_" + role));
  outcome(key + "_" + role, title, role, title, resultBody, back);
}
for (const role of ["M", "A"]) {
  const eq = eqFor(role),
    hr = handFor(role),
    room = roomFor(role);
  actionFlow(
    "EQ_APPROVED",
    role,
    "Equipment request approved",
    "Approve and reserve EQ-003?",
    "Borrower B · Event recording\nConfirmed pickup: 23 Nov 2026, 08:00\nReturn deadline: 24 Nov 2026, 18:00\nCompeting Pending requests for this item will be rejected.",
    "EQ-003 Camcorder · Borrower B · Approved\nConfirmed pickup: 23 Nov 2026, 08:00\nCollect before: 24 Nov 2026, 08:00\nReturn deadline: 24 Nov 2026, 18:00\nThe item is reserved. Competing Pending requests are rejected.\nReason: Equipment has been reserved for another request.",
    eq,
  );
  button(
    "Approved handover",
    "Open approved reservation",
    704,
    520,
    500,
    nav("RESERVED_EQ003_" + role),
  );
  actionFlow(
    "EQ_REJECTED",
    role,
    "Equipment request rejected",
    "Reject this equipment request?",
    "EQ-003 Camcorder · Borrower B\nReason: The requested item is needed for a scheduled class.\nThe Borrower will see this reason. No reservation is created.",
    "EQ-003 Camcorder · Borrower B · Rejected\nReason: The requested item is needed for a scheduled class.\nThe decision is recorded. No equipment reservation was created.",
    eq,
  );
  actionFlow(
    "HANDED_OVER",
    role,
    "Handover recorded",
    "Confirm physical handover?",
    "EQ-001 Projector · Borrower A\nVerify the person and physical item before confirming.\nThe request must still be inside the collection window.",
    "EQ-001 Projector · Borrower A · On loan\nPhysical handover recorded: 23 Nov 2026, 08:30 UTC+7\nReturn deadline: 24 Nov 2026, 18:00\nThe loan now occupies the item. It cannot be cancelled.",
    hr,
    "Back to handover and returns",
  );
  actionFlow(
    "RETURNED",
    role,
    "Return recorded",
    "Confirm physical receipt?",
    "EQ-004 Laptop · Borrower C\nConfirm the item has physically been received.\nBorrower inactivity and Hidden / Out of service do not block a return.",
    "EQ-004 Laptop · Borrower C · Returned\nPhysical receipt recorded: 22 Nov 2026, 09:00 UTC+7\nThis loan no longer occupies the item and is no longer overdue.\nThe item remains Hidden and Out of service.",
    hr,
  );
  actionFlow(
    "ROOM_APPROVED",
    role,
    "Room booking approved",
    "Approve this room booking?",
    "R-01 · Demo Borrower · 20 attendees\n25 Nov 2026 · P2–P3 · 08:15–10:15 UTC+7\nCapacity and approved overlaps are checked again on confirmation.",
    "R-01 · Demo Borrower · Approved\n25 Nov 2026 · P2–P3 · 08:15–10:15 UTC+7\nThe full interval is reserved, including the break.\nOther overlapping Pending room requests remain Pending.",
    room,
  );
  actionFlow(
    "ROOM_REJECTED",
    role,
    "Room booking rejected",
    "Reject this room booking?",
    "R-01 · Demo Borrower\nReason: The room is needed for a scheduled class.\nThe Borrower will see this reason. No interval is reserved.",
    "R-01 · Demo Borrower · Rejected\nReason: The room is needed for a scheduled class.\nNo room reservation was created.",
    room,
  );
  bind(eq, "S05-01 / Review selected", overlay("DETAIL_EQ_" + role));
  modal(
    "DETAIL_EQ_" + role,
    "Review selected request",
    "EQ-003 Camcorder · Borrower B\nPurpose: Event recording\nReturn deadline: 24 Nov 2026, 18:00\nPending · Visible · In service · Not reserved",
    "Review decision",
    close,
  );
  bind(eq, "S05-03 / Approve", overlay("CONFIRM_EQ_APPROVED_" + role));
  bind(eq, "S05-05 / Reject", overlay("EQ_REASON_REQUIRED_" + role));
  modal(
    "EQ_REASON_REQUIRED_" + role,
    "Rejection reason required",
    "Enter a rejection reason of 1–500 characters after trimming.\nThe request remains Pending; no decision has been saved.\nContinue with a fixed example reason to review the valid path.",
    "Use example reason",
    nav("EQ_REASON_" + role),
  );
  bind(eq, "S05-04 / Rejection reason * when rejecting", nav("EQ_REASON_" + role));
  const reason = cloneScreen("EQ_REASON_" + role, "S05", role);
  routeSidebar(reason, role);
  if (role === "A")
    reason.layers = reason.layers.filter(
      (n) =>
        !flat([n])
          .filter((x) => x.type !== "group")
          .every((x) => x.x >= 280 && x.y >= 664),
    );
  setField(reason, "S05-04", "The requested item is needed for a scheduled class.");
  bind(reason.id, "S05-03 / Approve", overlay("CONFIRM_EQ_APPROVED_" + role));
  bind(reason.id, "S05-05 / Reject", overlay("CONFIRM_EQ_REJECTED_" + role));
  bind(reason.id, "S05-01 / Review selected", overlay("DETAIL_EQ_" + role));
  if (role === "M") bind(reason.id, "S05-06 / Change pickup", nav("PICKUP_EDIT"));
  bind(hr, "S06-03 / Record handover", overlay("CONFIRM_HANDED_OVER_" + role));
  bind(hr, "S06-04 / Record return", overlay("CONFIRM_RETURNED_" + role));
  bind(hr, "S06-04 / Confirm return", nav("RETURNED_" + role));
  bind(hr, "S06-04 / Cancel confirmation", overlay("CANCEL_INFO"));
  bind(room, "S09-01 / Review booking", overlay("DETAIL_ROOM_" + role));
  modal(
    "DETAIL_ROOM_" + role,
    "Review room booking",
    "R-01 · Demo Borrower · 20 attendees\n25 Nov 2026 · P2–P3 · 08:15–10:15 UTC+7\nPurpose: Student club meeting\nVisible · In service · Capacity 30 · No approved overlap",
    "Review decision",
    close,
  );
  bind(room, "S09-03 / Approve", overlay("CONFIRM_ROOM_APPROVED_" + role));
  bind(room, "S09-05 / Reject", overlay("ROOM_REASON_REQUIRED_" + role));
  modal(
    "ROOM_REASON_REQUIRED_" + role,
    "Rejection reason required",
    "Enter a rejection reason of 1–500 characters after trimming.\nThe booking remains Pending; no decision has been saved.\nContinue with a fixed example reason to review the valid path.",
    "Use example reason",
    nav("ROOM_REASON_" + role),
  );
  bind(room, "S09-04 / Rejection reason * when rejecting", nav("ROOM_REASON_" + role));
  const rr = cloneScreen("ROOM_REASON_" + role, "S09", role);
  routeSidebar(rr, role);
  setField(rr, "S09-04", "The room is needed for a scheduled class.");
  bind(rr.id, "S09-03 / Approve", overlay("CONFIRM_ROOM_APPROVED_" + role));
  bind(rr.id, "S09-05 / Reject", overlay("CONFIRM_ROOM_REJECTED_" + role));
  bind(rr.id, "S09-01 / Review booking", overlay("DETAIL_ROOM_" + role));
  // Continue one consistent equipment record through approval, handover and return.
  outcome(
    "RESERVED_EQ003_" + role,
    "Approved reservation",
    role,
    "EQ-003 Camcorder · Borrower B",
    "Approved · Confirmed pickup: 23 Nov 2026, 08:00\nCollect before: 24 Nov 2026, 08:00\nReturn deadline: 24 Nov 2026, 18:00\nBorrower active · Item in service · Reservation current",
    eq,
  );
  button("Handover", "Record handover", 704, 520, 500, overlay("CONFIRM_EQ003_HANDOVER_" + role));
  modal(
    "CONFIRM_EQ003_HANDOVER_" + role,
    "Confirm handover of EQ-003?",
    "Verify Borrower B and the physical Camcorder.\nScenario time: 23 Nov 2026, 08:30 UTC+7.\nThe collection window is open.",
    "Confirm handover",
    nav("EQ003_LOAN_" + role),
  );
  outcome(
    "EQ003_LOAN_" + role,
    "Handover recorded",
    role,
    "EQ-003 Camcorder · On loan",
    "Borrower B\nHanded over: 23 Nov 2026, 08:30 UTC+7\nReturn deadline: 24 Nov 2026, 18:00\nThe item remains occupied until its physical return.",
    hr,
    "Back to handover and returns",
  );
  button("Return", "Record return", 704, 520, 500, overlay("CONFIRM_EQ003_RETURN_" + role));
  modal(
    "CONFIRM_EQ003_RETURN_" + role,
    "Confirm receipt of EQ-003?",
    "Confirm physical receipt of the Camcorder.\nScenario time: 24 Nov 2026, 16:00 UTC+7.",
    "Confirm return",
    nav("EQ003_RETURNED_" + role),
  );
  outcome(
    "EQ003_RETURNED_" + role,
    "Return recorded",
    role,
    "EQ-003 Camcorder · Returned",
    "Borrower B\nReturned: 24 Nov 2026, 16:00 UTC+7\nThe loan no longer occupies the item.\nVisibility and operational status are unchanged.",
    hr,
    "Back to handover and returns",
  );
}
bind("S05", "S05-06 / Change pickup", nav("PICKUP_EDIT"));
bind("S05", "S05-06 / New confirmed pickup *", nav("PICKUP_EDIT"));
const pickup = cloneScreen("PICKUP_EDIT", "S05", "M");
routeSidebar(pickup, "M");
setField(pickup, "S05-06", "23 Nov 2026, 15:00");
for (const n of flat(pickup.layers))
  if (n.type === "text" && n.text === "24 Nov 2026, 08:00") n.text = "24 Nov 2026, 15:00";
bind("PICKUP_EDIT", "S05-06 / Change pickup", overlay("CONFIRM_PICKUP"));
bind("PICKUP_EDIT", "S05-01 / Review selected", overlay("DETAIL_EQ_M"));
bind("PICKUP_EDIT", "S05-03 / Approve", overlay("CONFIRM_EQ_APPROVED_M"));
bind("PICKUP_EDIT", "S05-05 / Reject", overlay("EQ_REASON_REQUIRED_M"));
bind("PICKUP_EDIT", "S05-04 / Rejection reason * when rejecting", nav("EQ_REASON_M"));
modal(
  "CONFIRM_PICKUP",
  "Change the confirmed pickup?",
  "EQ-001 Projector · Borrower A\nAfter external contact: move 23 Nov 08:00 to 23 Nov 15:00.\nReturn deadline stays 24 Nov 2026, 18:00.\nThe request must remain Approved, uncollected and unexpired.",
  "Confirm pickup change",
  nav("PICKUP_CHANGED"),
);
outcome(
  "PICKUP_CHANGED",
  "Pickup changed",
  "M",
  "EQ-001 Projector · Approved",
  "Confirmed pickup: 23 Nov 2026, 15:00\nCollect before: 24 Nov 2026, 15:00\nReturn deadline: 24 Nov 2026, 18:00\nThe existing reservation is retained.",
  "S05",
);
modal(
  "CANCEL_INFO",
  "Confirmation cancelled",
  "No return was recorded and no occupancy was released.\nThe example loan remains On loan.",
  "Back to current screen",
  close,
);

const errors = [
  [
    "LOGIN_ERROR",
    "Sign-in failed",
    "B",
    "Unable to sign in. Check your username or email and password.\nNo authenticated session was created.",
    "AUTH_B",
    "Try again",
  ],
  [
    "EQ_INVALID",
    "Enter a purpose",
    "B",
    "Purpose is required.\nNo request was saved. Pickup and return dates are retained.",
    "S04_READY",
    "Use example purpose",
  ],
  [
    "EQ_UNAVAILABLE",
    "Equipment no longer available",
    "B",
    "This item is no longer available for request.\nNo request was saved. Choose another item from the catalogue.",
    "CAT_B",
    "Back to catalogue",
  ],
  [
    "EARLY",
    "Collection window has not opened",
    "M",
    "EQ-001 Projector · Confirmed pickup: 23 Nov 2026, 08:00\nScenario time: 23 Nov 2026, 07:30\nThe request remains Approved and the reservation is retained.\nNo physical handover was recorded.",
    "S06",
    "Back to handover and returns",
  ],
  [
    "EXPIRED",
    "Collection window expired",
    "M",
    "EQ-001 Projector · Collect before: 24 Nov 2026, 08:00\nScenario time: 24 Nov 2026, 08:00\nThe request is Cancelled and the reservation is released.\nThe expiry is recorded in history. Handover is unavailable.",
    "EXPIRED_DETAIL",
    "View cancelled request",
  ],
  [
    "ROOM_CONFLICT",
    "Room interval unavailable",
    "M",
    "R-01 · 25 Nov 2026 · 08:15–10:15 UTC+7\nA conflicting booking was approved first.\nThis request remains Pending. No approval was recorded.",
    "S09",
    "Refresh room requests",
  ],
  [
    "ROOM_CAPACITY",
    "Capacity exceeded",
    "B",
    "R-01 capacity: 30. Attempted headcount: 31.\nEnter a whole number from 1 to 30.\nNo request was saved; other form values are retained.",
    "S08",
    "Use 28 attendees",
  ],
  [
    "ROOM_PERIODS",
    "Choose periods in one session",
    "B",
    "P4–P5 crosses Morning and Afternoon.\nSubmit two separate requests, or choose periods in one session.\nNo request was saved.",
    "S08",
    "Use P2–P3",
  ],
  [
    "STALE",
    "Request already decided",
    "M",
    "Another staff member has already processed this request.\nYour attempted decision was not saved.\nRefresh the current record before taking another action.",
    "S05",
    "Refresh requests",
  ],
  [
    "PICKUP_DENIED",
    "Pickup change unavailable",
    "A",
    "Only a Resource Manager can change an existing confirmed pickup.\nAdmin can set pickup during initial approval.\nThe approved request and its reservation are unchanged.",
    "S05_A",
    "Back to equipment requests",
  ],
];
for (const [id, title, role, body, target, label] of errors) {
  outcome(id, title, role, title, body, target, label);
  current.layers.find((n) => n.type === "rect" && n.name === title + " card").fill = C.rose;
}
outcome(
  "EXPIRED_DETAIL",
  "Cancelled equipment request",
  "M",
  "EQ-001 Projector · Cancelled",
  "Collection window expired at 24 Nov 2026, 08:00 UTC+7.\nReservation released. No handover occurred.\nHistory: system expiry recorded.\nThis request cannot be revived by changing pickup.",
  "HISTORY_M",
  "Open request history",
);
// Narrative states explicitly document the persisted expiry contract outside UI copy.
boards.find((b) => b.id === "EXPIRED_DETAIL").contract = {
  status: "CANCELLED",
  cause: "SYSTEM_EXPIRY",
  event: "EQ_REQUEST_EXPIRED",
  releaseReservation: true,
};
const allIds = new Set([...base.boards, ...boards].map((b) => b.id));
for (const id of ["REGISTER", "REGISTERED", "REVIEW"]) {
  const b = boards.find((b) => b.id === id);
  b.layers = b.layers.filter((n) => !n.name.startsWith("Nav /"));
  for (let i = bindings.length - 1; i >= 0; i--)
    if (bindings[i].board === id && bindings[i].name.startsWith("Nav /")) bindings.splice(i, 1);
}
for (const b of bindings) {
  if (!allIds.has(b.board) || (b.action.target && !allIds.has(b.action.target)))
    throw Error("Unknown route " + JSON.stringify(b));
  if (b.board === b.action.target) throw Error("Self navigation " + b.board);
}
module.exports = {
  boards,
  bindings,
  entry: "REVIEW",
  flowName: "T18 · Prototype review",
  mode: "fixed sample click-through",
};
