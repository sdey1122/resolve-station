/* ==========================================
   ELEMENTS
========================================== */

const sidebar = document.getElementById("sidebar");

const menuToggle = document.getElementById("menuToggle");

const sidebarOverlay = document.getElementById("sidebarOverlay");

const mainContent = document.getElementById("mainContent");

const logoutBtn = document.getElementById("logoutBtn");

const logoutModal = document.getElementById("logoutModal");

const cancelLogout = document.getElementById("cancelLogout");

const confirmLogout = document.getElementById("confirmLogout");

const navLinks = document.querySelectorAll("[data-section]");

const sections = document.querySelectorAll(".page-section");

/* ==========================================
   SIDEBAR TOGGLE
========================================== */

menuToggle?.addEventListener("click", () => {
  if (window.innerWidth <= 992) {
    sidebar.classList.toggle("active");

    sidebarOverlay.classList.toggle("active");
  } else {
    sidebar.classList.toggle("collapsed");

    mainContent.classList.toggle("expanded");
  }
});

/* ==========================================
   MOBILE OVERLAY CLOSE
========================================== */

sidebarOverlay?.addEventListener("click", () => {
  sidebar.classList.remove("active");

  sidebarOverlay.classList.remove("active");
});

/* ==========================================
   ESC KEY CLOSE
========================================== */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    sidebar.classList.remove("active");

    sidebarOverlay.classList.remove("active");

    logoutModal?.classList.remove("active");
  }
});

/* ==========================================
   LOGOUT MODAL OPEN
========================================== */

logoutBtn?.addEventListener("click", () => {
  logoutModal?.classList.add("active");
});

/* ==========================================
   LOGOUT MODAL CLOSE
========================================== */

cancelLogout?.addEventListener("click", () => {
  logoutModal?.classList.remove("active");
});

/* ==========================================
   CLOSE MODAL ON OUTSIDE CLICK
========================================== */

logoutModal?.addEventListener("click", (event) => {
  if (event.target === logoutModal) {
    logoutModal.classList.remove("active");
  }
});

/* ==========================================
   CONFIRM LOGOUT
========================================== */

confirmLogout?.addEventListener("click", async () => {
  try {
    confirmLogout.disabled = true;

    confirmLogout.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Logging out...';

    const response = await fetch("/api/auth/logout", {
      method: "POST",

      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = "/auth/login";
    }
  } catch (error) {
    console.error("Logout Error:", error);

    confirmLogout.disabled = false;

    confirmLogout.innerHTML = "Yes, Logout";

    alert("Something went wrong. Please try again.");
  }
});

/* ==========================================
   WINDOW RESIZE FIX
========================================== */

window.addEventListener("resize", () => {
  if (window.innerWidth > 992) {
    sidebar.classList.remove("active");

    sidebarOverlay.classList.remove("active");
  }
});

// NAVLINKS

// navLinks.forEach((link) => {
//   link.addEventListener("click", (event) => {
//     event.preventDefault();

//     const section = link.dataset.section;

//     sections.forEach((item) => {
//       item.classList.remove("active");
//     });

//     navLinks.forEach((item) => {
//       item.classList.remove("active");
//     });

//     link.classList.add("active");

//     document.getElementById(`${section}Section`).classList.add("active");
//   });
// });

if (navLinks.length && sections.length) {
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const section = link.dataset.section;

      if (!section) return;

      event.preventDefault();

      sections.forEach((item) => item.classList.remove("active"));
      navLinks.forEach((item) => item.classList.remove("active"));

      link.classList.add("active");

      const target = document.getElementById(`${section}Section`);

      if (target) {
        target.classList.add("active");
      }
    });
  });
}
