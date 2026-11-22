# T18 Penpot design and prototype

Current design: [CampusBorrow PA3 in Penpot](https://design.penpot.app/?screen=workspace&team-id=cf924903-cff3-81f4-8008-fbc796ea80eb&file-id=cf924903-cff3-81f4-8008-fbc7ae1bf610&page-id=cf924903-cff3-81f4-8008-fbc7ae1bf611).

Status on 22 November 2026: Phuc reported a positive preliminary review after the v4.1 flow repair and requested an update to PR #71 for team review. The agent has not independently verified every live interaction. Detailed scenario review and final team approval remain pending. T19 accessibility verification and T20 reconciliation are separate work.

## Version 5.1 review update

S05 now displays the selected item’s Operational status and Occupancy directly beside the decision panel. The sample item is In service and Not reserved; these are distinct from the request’s Pending state. The update covers the RM and Admin boards plus rejection-reason and pickup-edit variants. S05-08 also references S14 for Manage resources. The lower-priority suggestions in this review are outside this update.

The source and reference images are prepared. Offline migration checks from v4.1 and v5 preserve existing IDs, links and unrelated user text, reject conflicting edits before writing, and prevent duplicates on repeat runs. Reference renders for RM and Admin were inspected. Live execution of v5.1 and final team approval remain pending; Phuc’s earlier no-error report applies to v5 only.

Close the plugin, reload Penpot, reopen `http://localhost:8765/manifest.json`, confirm **v5.1**, and click **Cập nhật review Minh** on the existing page. Wait for **Review v5.1 applied**. Keep the current boards; do not rerun the six-screen builder. In Present/Play, check that both RM and Admin see the two fields without opening Review request, then verify the approve/reject links still work.

The prior v5 corrections remain included: S04 collection location; S05 proposed pickup and both deadlines; S06 request/Borrower/eligibility; S09 request IDs; and the two expiry scenarios.

## Review the current design

Open the file, start Present/Play and select **T18 · Prototype review**. Choose Borrower, Manager or Admin, or select a validation/conflict example from the hub. Reviewers with file access can use the existing prototype without running the local plugin.

The six selected screens S01/S04/S05/S06/S08/S09 cover all 45 control IDs in the [T18 specification](../screen-specifications/README.md). Text and rectangles are native editable layers; buttons and fields are semantic groups, not reusable library components. No screen is imported as a flattened background image.

The source defines 88 additional role variants, dialogs, outcome states and supporting destinations with 647 click bindings, including the existing navigation. These are prototype states, not 88 new product screens or an expansion of T18's six-screen scope.

The viewer uses fixed sample data. Clicking a sample field advances to prepared values; it does not accept free typing. Each journey starts a fresh fixture and returning to a main screen restores its example state. Authentication, server validation, persistence, atomic transactions and keyboard focus are requirements in T18, not implemented application behavior in this prototype. Catalogue, schedule, My requests and registration provide navigation context; resource management and history are read-only examples of screens outside the detailed T18 scope.

## Review journeys

| Journey                     | What to check                                                                                                                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sign in and navigation      | Borrower opens Catalogue; RM/Admin open equipment requests. Follow side navigation and sign out. Confirm proposed N1/N2 destinations against the screen flow.                                                                              |
| Borrower equipment request  | Catalogue → request → prepared purpose → Submit → confirmation → Pending. Cancel closes the dialog without submitting. Blank purpose has a validation example.                                                                             |
| Borrower room booking       | Schedule → request → confirmation → Pending. Review overlap, capacity and cross-session examples from the hub. P2–P3 includes the break; P4–P5 is invalid in one request.                                                                  |
| RM/Admin equipment approval | Approve EQ-003 → confirm → reserved; competing equipment requests are rejected. Continue with EQ-003 handover → On loan → return → Returned.                                                                                               |
| RM/Admin rejection          | Empty reason opens required-reason feedback; the prepared reason enables confirmation and the Rejected result. Confirm reason visibility and required wording.                                                                             |
| RM pickup change            | Change pickup → prepared time → confirm → updated pickup and collection deadline. Admin has no pickup-edit route. Initial pickup during approval is available to both staff roles.                                                         |
| Handover and return         | Confirm before the outcome. Early handover stays Approved; expiry shows Cancelled. Return preserves the example resource's Hidden/Out of service settings.                                                                                 |
| Room decisions              | Approve/reject has confirmation and an outcome. Approving a room booking leaves competing requests Pending.                                                                                                                                |
| Deadlines and expiry        | Return deadline and Collect before are separate. Verify expiry = min(confirmed pickup + 24 hours, return deadline). The expiry detail records CANCELLED, SYSTEM_EXPIRY, reservation release and EQ_REQUEST_EXPIRED in the design contract. |
| Cancellation and feedback   | Check Cancel on dialogs, recovery routes from errors and the stale-decision example. Real focus management and concurrent requests require later implementation/testing.                                                                   |

## Reproduce or maintain the design

Source: [tools/penpot-t18](../../../tools/penpot-t18). From the repository root with Node.js available:

```powershell
node tools/penpot-t18/build.cjs
node tools/penpot-t18/serve.cjs
```

The build generates `tools/penpot-t18/Start-Penpot.cmd` for the current Windows Node installation. Opening it rebuilds and starts the server; keep that console open. The launcher and generated `dist` folder are ignored by Git. The server binds to loopback and exposes only the plugin files and six base SVG previews, not other project files. No credentials are requested.

The plugin is restricted to the linked PA3 file ID. Open Ctrl+Alt+P and load `http://localhost:8765/manifest.json`. If the browser requests local-network access, allow it for this local plugin. Confirm the **v5.1** heading.

- Existing prototype: no rebuild is needed for review. To apply a prepared update, close the plugin, reload Penpot, reopen the same URL and choose **Cập nhật review Minh** on the existing page. Wait for **Review v5.1 applied**. Existing marked boards and matching links are retained.
- Fresh reconstruction: use a blank page in the target file, choose **Dựng 6 màn hình T18**, then **Bổ sung prototype T18**. The base builder refuses an occupied page.
- Navigation recovery: **Sửa điều hướng trên board đã dựng** restores missing base navigation without rebuilding layers. Self-navigation links are excluded.
- Covered text/buttons: **Hiện lại chữ và nút** restores paint order in the original boards and nested groups while preserving IDs, text, geometry and links. Natural child ordering is enabled for new content.

The installer stops on ambiguous/renamed source groups, incomplete prototype boards or conflicting click actions instead of overwriting edits. Keep partially created content for inspection. In v4, Penpot's implicit flow creation caused `:createFlow-frame`; v4.1 locates the review hub's existing flow by starting-board ID and reuses it. No board deletion is needed for that recovery.

## Verification and evidence

Offline checks passed for six-screen/control coverage, geometry, reference text bounds, graph reachability, target resolution, role restrictions, cancellation links, original-layer preservation, repeat-run safety, interrupted link attachment and implicit-flow recovery. Reference SVG/PNG renders were inspected during preparation. Phuc's positive preliminary review is the live user feedback; it is not a recorded pass for every checklist row above.

```powershell
node tools/penpot-t18/verify.cjs
node tools/penpot-t18/verify-prototype.cjs
node tools/penpot-t18/verify-review.cjs
```

The reference font checks and preview renderer currently use Sharp from the preparation runtime's Node installation (`../node_modules/sharp` relative to the Node executable directory) and Arial. A standard Node installation must provide that dependency or adapt its resolution to run these checks. Building and serving the plugin use Node built-ins only. Penpot uses Source Sans Pro, Roboto or Inter, so reference font bounds do not replace live typography review.

All previews below are generated from the reconstruction source, not screenshots exported from the live file. Use the live Penpot file for final layout review and capture approved exports when integrating PA3 section 6.2.

| Screen | Reference preview                |
| ------ | -------------------------------- |
| S01    | [Sign in](S01.png)               |
| S04    | [Request equipment](S04.png)     |
| S05    | [Equipment requests](S05.png)    |
| S06    | [Handover and returns](S06.png)  |
| S08    | [Room booking request](S08.png)  |
| S09    | [Room booking requests](S09.png) |

Additional previews: [review hub](prototype-REVIEW.png), [approval confirmation](prototype-CONFIRM_EQ_APPROVED_M.png), [approved outcome](prototype-EQ_APPROVED_M.png), [pickup changed](prototype-PICKUP_CHANGED.png), [expiry](prototype-EXPIRED.png), [Admin equipment requests](prototype-S05_A.png).

References: [Penpot plugin installation](https://help.penpot.app/plugins/getting-started/), [Plugin API](https://doc.plugins.penpot.app/interfaces/Penpot), [naturalChildOrdering](https://doc.plugins.penpot.app/interfaces/Flags). PA3 Figma screenshots provided visual references; the original PA2 file remains the historical baseline.

Both image folders are generated from one source with `node tools/penpot-t18/build.cjs` then `node tools/penpot-t18/render-prototype.cjs`. The cumulative v5.1 migration remains in `review-v5.json`, pinned to reviewed commit 3621dd8; regenerate it with `node tools/penpot-t18/make-review-migration.cjs` if the definitions change. Migration checks also use c76e000 to verify updates from the installed v5 baseline. Both baseline commits must be available in Git history.
