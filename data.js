// ------------------------------------------------------------
// Settings for the dashboard.
// Change these words here, and the page updates.
// ------------------------------------------------------------
window.DASHBOARD_CONFIG = {
  companyName: 'Cheveny Corp',
  aspName: 'Zoho ASP',
  updatedAt: 'Updated 20 Nov, 09:45',
  nextRun: '10:15',

  // Set to true to see the "failed run" alert instead of the health line.
  showFailedRunAlert: false
};

// ------------------------------------------------------------
// Sample invoices.
// Later, your middleware API will send this list instead.
//
// bucket: 'action'   = Needs action
//         'progress' = In progress
//         'done'     = Done
// steps:  four steps in order: ERP, our ASP, buyer's ASP, FTA.
//         Each one is 'done', 'failed' or 'pending'.
// days:   days left in the 14-day limit.
// ------------------------------------------------------------
window.SAMPLE_INVOICES = [
  { id: 'INV-2026-0407', date: '09 Nov 2026', buyer: 'Customer D Logistics LLC', amount: '8,190.00', bucket: 'action', detail: 'Rejected by buyer’s ASP', reason: 'The buyer was not found on the network.', todo: 'Check the buyer’s network ID, then resend.', days: 3, steps: ['done', 'done', 'failed', 'pending'] },
  { id: 'INV-2026-0410', date: '10 Nov 2026', buyer: 'Customer G Electronics LLC', amount: '22,050.00', bucket: 'action', detail: 'Rejected by FTA', reason: 'The VAT total does not match the line items.', todo: 'Fix the VAT amounts in the ERP, then resend.', days: 4, steps: ['done', 'done', 'done', 'failed'] },
  { id: 'INV-2026-0421', date: '19 Nov 2026', buyer: 'Customer C Foods LLC', amount: '31,500.00', bucket: 'action', detail: 'Rejected by our ASP', reason: 'The buyer’s TRN is missing.', todo: 'Add the buyer’s TRN in the ERP, then resend.', days: 13, steps: ['done', 'failed', 'pending', 'pending'] },
  { id: 'INV-2026-0423', date: '19 Nov 2026', buyer: 'Customer H Hospitality LLC', amount: '9,870.00', bucket: 'progress', detail: 'No answer from FTA yet', reason: 'Delivered to the buyer 18 hours ago.', todo: 'Nothing to do. We retry automatically.', days: 13, steps: ['done', 'done', 'done', 'pending'] },
  { id: 'INV-2026-0422', date: '19 Nov 2026', buyer: 'Customer E Retail LLC', amount: '2,310.00', bucket: 'progress', detail: 'Delivered, waiting for FTA', reason: 'The buyer’s ASP accepted it.', todo: 'Nothing to do yet.', days: 13, steps: ['done', 'done', 'done', 'pending'] },
  { id: 'INV-2026-0424', date: '20 Nov 2026', buyer: 'Customer A Trading LLC', amount: '15,750.00', bucket: 'progress', detail: 'Sent, waiting for answer', reason: 'Sent to our ASP at 09:45.', todo: 'Nothing to do yet.', days: 14, steps: ['done', 'pending', 'pending', 'pending'] },
  { id: 'INV-2026-0425', date: '20 Nov 2026', buyer: 'Customer F Services LLC', amount: '1,050.00', bucket: 'progress', detail: 'Queued', reason: 'Captured from the ERP at 09:52.', todo: 'Nothing to do. It goes out in the next run.', days: 14, steps: ['done', 'pending', 'pending', 'pending'] },
  { id: 'INV-2026-0419', date: '18 Nov 2026', buyer: 'Customer B Contracting LLC', amount: '4,725.00', bucket: 'done', detail: 'Delivered and reported', reason: 'The buyer has it, and so does the FTA.', todo: 'Nothing to do.', days: 12, steps: ['done', 'done', 'done', 'done'] },
  { id: 'INV-2026-0418', date: '18 Nov 2026', buyer: 'Customer A Trading LLC', amount: '12,600.00', bucket: 'done', detail: 'Delivered and reported', reason: 'The buyer has it, and so does the FTA.', todo: 'Nothing to do.', days: 12, steps: ['done', 'done', 'done', 'done'] },
  { id: 'INV-2026-0415', date: '16 Nov 2026', buyer: 'Customer B Contracting LLC', amount: '6,300.00', bucket: 'done', detail: 'Delivered and reported', reason: 'The buyer has it, and so does the FTA.', todo: 'Nothing to do.', days: 10, steps: ['done', 'done', 'done', 'done'] }
];
