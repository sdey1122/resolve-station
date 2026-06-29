/**
 * ==========================================================
 * ResolveStation
 * Resident Dashboard
 * ==========================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================
       ELEMENTS
    ========================================== */

  const sidebar = document.getElementById("sidebar");

  const mainContent = document.getElementById("mainContent");

  const menuToggle = document.getElementById("menuToggle");

  const sidebarOverlay = document.getElementById("sidebarOverlay");

  const logoutBtn = document.getElementById("logoutBtn");

  const logoutModal = document.getElementById("logoutModal");

  const cancelLogout = document.getElementById("cancelLogout");

  const confirmLogout = document.getElementById("confirmLogout");

  /* ==========================================
       SIDEBAR
    ========================================== */

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

  menuToggle.addEventListener("click", () => {
    if (window.innerWidth <= 992) {
      openSidebar();
    } else {
      sidebar.classList.toggle("collapsed");

      mainContent.classList.toggle("expanded");
    }
  });

  sidebarOverlay.addEventListener("click", closeSidebar);

  /* ==========================================
       ESC
    ========================================== */

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSidebar();

      closeLogout();
    }
  });

  /* ==========================================
       WINDOW
    ========================================== */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      closeSidebar();
    }
  });

  /* ==========================================
       ACTIVE MENU
    ========================================== */

  const current = window.location.pathname;

  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });

  /* ==========================================
       LOGOUT MODAL
    ========================================== */

  function openLogout() {
    logoutModal.classList.add("active");

    document.body.style.overflow = "hidden";
  }

  function closeLogout() {
    logoutModal.classList.remove("active");

    document.body.style.overflow = "";
  }

  logoutBtn.addEventListener("click", openLogout);

  cancelLogout.addEventListener("click", closeLogout);

  logoutModal.addEventListener("click", (e) => {
    if (e.target === logoutModal) {
      closeLogout();
    }
  });
});

/* ==========================================
   CONFIRM LOGOUT
========================================== */

confirmLogout.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",

      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = "/auth/login";

      return;
    }

    alert(result.message);
  } catch (error) {
    console.error(error);

    alert("Logout failed.");
  }
});

/* ==========================================
   COUNTDOWN TIMER
========================================== */

function updateCountdowns() {
  document.querySelectorAll(".countdown-box").forEach((box) => {
    const deadline = box.dataset.deadline;

    const text = box.querySelector(".countdown-text");

    if (!deadline || !text) {
      return;
    }

    const end = new Date(deadline).getTime();

    const now = Date.now();

    const diff = end - now;

    if (diff <= 0) {
      text.innerHTML = "Overdue";

      text.style.color = "#e53935";

      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) {
      text.innerHTML = `${days}d ${hours}h left`;
    } else {
      text.innerHTML = `${hours}h ${minutes}m left`;
    }
  });
}

updateCountdowns();

setInterval(updateCountdowns, 60000);

/* ==========================================
   PAGE FADE
========================================== */

document.querySelectorAll(".complaint-card").forEach((card, index) => {
  card.style.opacity = "0";

  card.style.transform = "translateY(25px)";

  setTimeout(() => {
    card.style.transition = ".45s ease";

    card.style.opacity = "1";

    card.style.transform = "translateY(0)";
  }, index * 80);
});
