/**
 * ==========================================
 * COMPLAINT DETAILS
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * ==========================================
   * ELEMENTS
   * ==========================================
   */

  const approveBtn = document.getElementById("approveComplaintBtn");

  const rejectBtn = document.getElementById("rejectComplaintBtn");

  const approveSubmitBtn = document.getElementById("approveSubmitBtn");

  const rejectSubmitBtn = document.getElementById("rejectSubmitBtn");

  const approveModalElement = document.getElementById("approveModal");

  const rejectModalElement = document.getElementById("rejectModal");

  /**
   * ==========================================
   * BOOTSTRAP MODALS
   * ==========================================
   */

  const approveModal = approveModalElement
    ? new bootstrap.Modal(approveModalElement)
    : null;

  const rejectModal = rejectModalElement
    ? new bootstrap.Modal(rejectModalElement)
    : null;

  /**
   * ==========================================
   * OPEN APPROVE MODAL
   * ==========================================
   */

  approveBtn?.addEventListener("click", () => {
    approveModal.show();
  });

  /**
   * ==========================================
   * OPEN REJECT MODAL
   * ==========================================
   */

  rejectBtn?.addEventListener("click", () => {
    rejectModal.show();
  });

  /**
   * ==========================================
   * FORM ELEMENTS
   * ==========================================
   */

  const staffSelect = document.getElementById("staffSelect");

  const estimatedPrice = document.getElementById("estimatedPrice");

  const deadlineDate = document.getElementById("deadlineDate");

  const deadlineTime = document.getElementById("deadlineTime");

  const rejectReason = document.getElementById("rejectReason");

  /**
   * ==========================================
   * VALIDATE APPROVE FORM
   * ==========================================
   */

  function validateApproveForm() {
    if (!staffSelect.value) {
      showToast("Please select a staff member.", "error");

      staffSelect.focus();

      return false;
    }

    if (!estimatedPrice.value || Number(estimatedPrice.value) < 0) {
      showToast("Please enter a valid estimated price.", "error");

      estimatedPrice.focus();

      return false;
    }

    if (!deadlineDate.value) {
      showToast("Please select a deadline date.", "error");

      deadlineDate.focus();

      return false;
    }

    if (!deadlineTime.value) {
      showToast("Please select a deadline time.", "error");

      deadlineTime.focus();

      return false;
    }

    return true;
  }

  /**
   * ==========================================
   * VALIDATE REJECT FORM
   * ==========================================
   */

  function validateRejectForm() {
    if (rejectReason.value.trim().length < 10) {
      showToast(
        "Rejection reason must contain at least 10 characters.",
        "error",
      );

      rejectReason.focus();

      return false;
    }

    return true;
  }

  /**
   * ==========================================
   * COMPLAINT ID
   * ==========================================
   */

  const complaintId = window.location.pathname.split("/").pop();

  /**
   * ==========================================
   * LOAD STAFF
   * ==========================================
   */

  async function loadStaff() {
    try {
      const response = await fetch("/api/admin/staff", {
        credentials: "include",
      });

      if (!response.ok) return;

      const data = await response.json();

      staffSelect.innerHTML = `
        <option value="">
          Select Staff
        </option>
      `;

      data.staff.forEach((staff) => {
        staffSelect.innerHTML += `
          <option value="${staff._id}">
            ${staff.name}
          </option>
        `;
      });
    } catch (error) {
      console.error(error);
    }
  }

  loadStaff();

  /**
   * ==========================================
   * APPROVE COMPLAINT
   * ==========================================
   */

  approveSubmitBtn?.addEventListener("click", async () => {
    if (!validateApproveForm()) return;

    approveSubmitBtn.disabled = true;

    approveSubmitBtn.innerHTML = `
        <i class="bi bi-arrow-repeat spin"></i>
        Approving...
      `;

    try {
      const response = await fetch(
        `/api/admin/complaints/${complaintId}/approve`,
        {
          method: "PATCH",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            assignedStaff: staffSelect.value,

            estimatedPrice: estimatedPrice.value,

            deadlineDate: deadlineDate.value,

            deadlineTime: deadlineTime.value,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Approval failed.", "error");

        approveSubmitBtn.disabled = false;

        approveSubmitBtn.innerHTML = `
            <i class="bi bi-check-circle-fill"></i>
            Approve & Assign
          `;

        return;
      }

      approveModal.hide();

      setTimeout(() => {
        showToast(
          "Complaint approved successfully. Staff has been assigned.",
          "success",
        );
      }, 1200);

      setTimeout(() => {
        window.location.href = "/admin/complaints/pending";
      }, 2500);
    } catch (error) {
      console.error(error);

      showToast("Something went wrong.", "error");

      approveSubmitBtn.disabled = false;

      approveSubmitBtn.innerHTML = `
          <i class="bi bi-check-circle-fill"></i>
          Approve & Assign
        `;
    }
  });

  /**
   * ==========================================
   * REJECT COMPLAINT
   * ==========================================
   */

  rejectSubmitBtn?.addEventListener("click", async () => {
    if (!validateRejectForm()) return;

    rejectSubmitBtn.disabled = true;

    rejectSubmitBtn.innerHTML = `
        <i class="bi bi-arrow-repeat spin"></i>
        Rejecting...
      `;

    try {
      const response = await fetch(
        `/api/admin/complaints/${complaintId}/reject`,
        {
          method: "PATCH",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            reason: rejectReason.value.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Rejection failed.", "error");

        rejectSubmitBtn.disabled = false;

        rejectSubmitBtn.innerHTML = `
            <i class="bi bi-x-circle-fill"></i>
            Reject Complaint
          `;

        return;
      }

      rejectModal.hide();

      setTimeout(() => {
        showToast(
          "Complaint rejected successfully. The resident may resubmit after making corrections.",
          "success",
        );
      }, 1200);

      setTimeout(() => {
        window.location.href = "/admin/complaints/pending";
      }, 2500);
    } catch (error) {
      console.error(error);

      showToast("Something went wrong.", "error");

      rejectSubmitBtn.disabled = false;

      rejectSubmitBtn.innerHTML = `
          <i class="bi bi-x-circle-fill"></i>
          Reject Complaint
        `;
    }
  });

  /**
   * ==========================================
   * RESET APPROVE MODAL
   * ==========================================
   */

  approveModalElement?.addEventListener("hidden.bs.modal", () => {
    staffSelect.value = "";

    estimatedPrice.value = "";

    deadlineDate.value = "";

    deadlineTime.value = "";

    approveSubmitBtn.disabled = false;

    approveSubmitBtn.innerHTML = `
        <i class="bi bi-check-circle-fill"></i>
        Approve & Assign
      `;
  });

  /**
   * ==========================================
   * RESET REJECT MODAL
   * ==========================================
   */

  rejectModalElement?.addEventListener("hidden.bs.modal", () => {
    rejectReason.value = "";

    rejectSubmitBtn.disabled = false;

    rejectSubmitBtn.innerHTML = `
        <i class="bi bi-x-circle-fill"></i>
        Reject Complaint
      `;
  });

  /**
   * ==========================================
   * MINIMUM DEADLINE DATE
   * ==========================================
   */

  const today = new Date();

  deadlineDate.min = today.toISOString().split("T")[0];
});
