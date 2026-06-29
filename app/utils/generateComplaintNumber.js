/**
 * ==========================================
 * GENERATE COMPLAINT NUMBER
 * ==========================================
 */

const Complaint = require("../models/Complaint");

async function generateComplaintNumber() {
  const latestComplaint = await Complaint.findOne()
    .sort({ createdAt: -1 })
    .select("complaintNumber");

  if (!latestComplaint) {
    return "CMP-000001";
  }

  const lastNumber = parseInt(
    latestComplaint.complaintNumber.split("-")[1],
    10,
  );

  const nextNumber = String(lastNumber + 1).padStart(6, "0");

  return `CMP-${nextNumber}`;
}

module.exports = generateComplaintNumber;
