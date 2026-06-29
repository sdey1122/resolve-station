/**
 * ==========================================================
 * ResolveStation
 * Completed Reviews
 * ==========================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     ELEMENTS
  ====================================================== */

  const searchInput = document.getElementById("searchComplaint");

  const categoryFilter = document.getElementById("categoryFilter");

  const cards = document.querySelectorAll(".review-card");

  const approveModal = new bootstrap.Modal(
    document.getElementById("approveModal"),
  );

  const rejectModal = new bootstrap.Modal(
    document.getElementById("rejectModal"),
  );

  const approveSubmit = document.getElementById("approveSubmitBtn");

  const rejectSubmit = document.getElementById("rejectSubmitBtn");

  const rejectReason = document.getElementById("rejectReason");

  let complaintId = null;

  /* ======================================================
     SEARCH
  ====================================================== */

  function filterCards() {
    const keyword = searchInput.value.toLowerCase().trim();

    const category = categoryFilter.value.toLowerCase();

    cards.forEach((card) => {
      const content = card.innerText.toLowerCase();

      const matchedKeyword = content.includes(keyword);

      const matchedCategory = !category || content.includes(category);

      card.style.display = matchedKeyword && matchedCategory ? "" : "none";
    });
  }

  searchInput?.addEventListener("input", filterCards);

  categoryFilter?.addEventListener("change", filterCards);

  /* ======================================================
     OPEN APPROVE MODAL
  ====================================================== */

  document.querySelectorAll(".approve-btn").forEach((button) => {
    button.addEventListener("click", () => {
      complaintId = button.dataset.id;

      approveModal.show();
    });
  });

  /* ======================================================
     OPEN REJECT MODAL
  ====================================================== */

  document.querySelectorAll(".reject-btn").forEach((button) => {
    button.addEventListener("click", () => {
      complaintId = button.dataset.id;

      rejectReason.value = "";

      rejectModal.show();
    });
  });

  /* ======================================================
     BUTTON LOADING
  ====================================================== */

  function setLoading(button, loading, html) {
    if (loading) {
      button.disabled = true;

      button.innerHTML = `
        <span class="spinner-border spinner-border-sm"></span>
        Please Wait...
      `;

      return;
    }

    button.disabled = false;

    button.innerHTML = html;
  }
  /* ======================================================
     APPROVE COMPLETION
  ====================================================== */

  approveSubmit?.addEventListener("click", async () => {
    if (!complaintId) return;

    setLoading(
      approveSubmit,
      true,
      `<i class="bi bi-check-circle-fill"></i> Approve`,
    );

    try {
      const response = await fetch(
        `/api/admin/completed-reviews/${complaintId}/approve`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      approveModal.hide();

      showToast(result.message, "success");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      showToast(error.message || "Something went wrong.", "error");
    } finally {
      setLoading(
        approveSubmit,
        false,
        `<i class="bi bi-check-circle-fill"></i> Approve`,
      );
    }
  });

  /* ======================================================
     RETURN TO STAFF
  ====================================================== */

  rejectSubmit?.addEventListener("click", async () => {
    const remark = rejectReason.value.trim();

    if (!remark) {
      showToast("Please enter an administrator remark.", "error");

      return;
    }

    setLoading(
      rejectSubmit,
      true,
      `<i class="bi bi-arrow-counterclockwise"></i> Send Back`,
    );

    try {
      const response = await fetch(
        `/api/admin/completed-reviews/${complaintId}/reject`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ remark }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      rejectModal.hide();

      showToast(result.message, "success");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      showToast(error.message || "Something went wrong.", "error");
    } finally {
      setLoading(
        rejectSubmit,
        false,
        `<i class="bi bi-arrow-counterclockwise"></i> Send Back`,
      );
    }
  });

  /* ======================================================
     RESET MODALS
  ====================================================== */

  document
    .getElementById("approveModal")
    ?.addEventListener("hidden.bs.modal", () => {
      complaintId = null;
    });

  document
    .getElementById("rejectModal")
    ?.addEventListener("hidden.bs.modal", () => {
      complaintId = null;

      rejectReason.value = "";
    });

  /* ======================================================
     AUTO FOCUS
  ====================================================== */

  document
    .getElementById("rejectModal")
    ?.addEventListener("shown.bs.modal", () => {
      rejectReason.focus();
    });

  /* ======================================================
     SHORTCUTS
  ====================================================== */

  document.addEventListener("keydown", (event) => {
    if (approveModal._isShown && event.key === "Enter") {
      event.preventDefault();

      approveSubmit.click();
    }

    if (rejectModal._isShown && event.ctrlKey && event.key === "Enter") {
      event.preventDefault();

      rejectSubmit.click();
    }
  });
});
