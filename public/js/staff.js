/**
 * ==========================================================
 * ResolveStation
 * Staff Dashboard
 * ==========================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
       ELEMENTS
    ====================================================== */

  const sidebar = document.getElementById("sidebar");

  const sidebarOverlay = document.getElementById("sidebarOverlay");

  const menuToggle = document.getElementById("menuToggle");

  const mainContent = document.getElementById("mainContent");

  const logoutBtn = document.getElementById("logoutBtn");

  const logoutModal = document.getElementById("logoutModal");

  const cancelLogout = document.getElementById("cancelLogout");

  const confirmLogout = document.getElementById("confirmLogout");

  const completeModal = document.getElementById("completeJobModal");

  const cannotModal = document.getElementById("cannotCompleteModal");

  /* ======================================================
       SIDEBAR
    ====================================================== */

  function openSidebar() {
    sidebar.classList.add("active");

    sidebarOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("active");

    sidebarOverlay.classList.remove("active");

    document.body.style.overflow = "";
  }

  menuToggle?.addEventListener("click", () => {
    if (window.innerWidth <= 992) {
      openSidebar();
    } else {
      sidebar.classList.toggle("collapsed");

      mainContent.classList.toggle("expanded");
    }
  });

  sidebarOverlay?.addEventListener("click", closeSidebar);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      closeSidebar();
    }
  });

  /* ======================================================
       ACTIVE SIDEBAR
    ====================================================== */

  const current = window.location.pathname;

  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });

  /* ======================================================
       LOGOUT
    ====================================================== */

  function openLogout() {
    logoutModal.classList.add("active");
  }

  function closeLogout() {
    logoutModal.classList.remove("active");
  }

  logoutBtn?.addEventListener("click", openLogout);

  cancelLogout?.addEventListener("click", closeLogout);

  logoutModal?.addEventListener("click", (e) => {
    if (e.target === logoutModal) {
      closeLogout();
    }
  });

  /* ======================================================
       COMPLETE JOB MODAL
    ====================================================== */

  document.querySelectorAll(".task-complete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById("completeComplaintId").value = button.dataset.id;

      completeModal.classList.add("active");
    });
  });

  /* ======================================================
       CANNOT COMPLETE MODAL
    ====================================================== */

  document.querySelectorAll(".task-failed-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById("cannotComplaintId").value = button.dataset.id;

      cannotModal.classList.add("active");
    });
  });

  /* ======================================================
       CLOSE MODALS
    ====================================================== */

  [completeModal, cannotModal].forEach((modal) => {
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  });
});

/* ======================================================
   LIVE COUNTDOWN
====================================================== */

function renderPrice(
  priceElement,
  originalPrice,
  finalPrice,
  label,
  type = "",
) {
  if (finalPrice === originalPrice) {
    priceElement.innerHTML = `₹${originalPrice}`;
    return;
  }

  if (finalPrice === 0) {
    priceElement.innerHTML = `
      <div class="price-original">
        ₹${originalPrice}
      </div>

      <div class="price-final free">
        FREE
      </div>

      <small class="price-discount danger">
        100% Waived
      </small>
    `;
    return;
  }

  priceElement.innerHTML = `
      <div class="price-original">
        ₹${originalPrice}
      </div>

      <div class="price-final">
        ₹${finalPrice}
      </div>

      <small class="price-discount ${type}">
        ${label}
      </small>
  `;
}

function updateCountdowns() {
  document.querySelectorAll(".countdown-box").forEach((box) => {
    const deadlineString = box.dataset.deadline;

    if (!deadlineString) return;

    const deadline = new Date(deadlineString).getTime();

    const countdownText = box.querySelector(".countdown-text");

    const card = box.closest(".complaint-card");

    const priceElement = card.querySelector(".price-box strong");

    const originalPrice = Number(priceElement.dataset.price);

    const now = Date.now();

    const diff = deadline - now;

    /* ==========================================
       BEFORE DEADLINE
    ========================================== */

    if (diff > 0) {
      const days = Math.floor(diff / 86400000);

      const hours = Math.floor((diff % 86400000) / 3600000);

      const minutes = Math.floor((diff % 3600000) / 60000);

      countdownText.innerHTML = `
        <span class="count-green">
            ${days}d ${hours}h ${minutes}m left
        </span>
      `;

      renderPrice(priceElement, originalPrice, originalPrice);

      card.classList.remove("job-expired");

      return;
    }

    const overdueHours = Math.floor((now - deadline) / 3600000);

    /* ==========================================
       DUE (0–12 HOURS)
    ========================================== */

    if (overdueHours < 12) {
      countdownText.innerHTML = `
        <span class="count-orange">
            Due
        </span>
      `;

      renderPrice(
        priceElement,
        originalPrice,
        Math.round(originalPrice * 0.75),
        "25% Deducted",
      );

      return;
    }

    /* ==========================================
       OVERDUE (12–24 HOURS)
    ========================================== */

    if (overdueHours < 24) {
      countdownText.innerHTML = `
        <span class="count-red">
            Overdue
        </span>
      `;

      renderPrice(
        priceElement,
        originalPrice,
        Math.round(originalPrice * 0.5),
        "50% Deducted",
        "danger",
      );

      return;
    }

    /* ==========================================
   EXPIRED (24+ HOURS)
========================================== */

    countdownText.innerHTML = `
  <span class="count-black">
      Job Expired
  </span>
`;
    renderPrice(
      priceElement,
      originalPrice,
      Math.round(originalPrice * 0.4),
      "60% Deducted",
      "danger",
    );

    card.classList.add("job-expired");
  });
}

updateCountdowns();

setInterval(updateCountdowns, 60000);
