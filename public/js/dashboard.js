/**
 * ==========================================
 * DASHBOARD SIDEBAR
 * ==========================================
 */

const menuToggle = document.getElementById("menuToggle");

const sidebar = document.getElementById("sidebar");

let overlay = document.querySelector(".sidebar-overlay");

/**
 * CREATE OVERLAY
 */

if (!overlay) {
  overlay = document.createElement("div");

  overlay.className = "sidebar-overlay";

  document.body.appendChild(overlay);
}

/**
 * TOGGLE SIDEBAR
 */

menuToggle?.addEventListener("click", () => {
  sidebar?.classList.toggle("active");

  overlay.classList.toggle("active");
});

/**
 * CLOSE SIDEBAR
 */

overlay.addEventListener("click", () => {
  sidebar?.classList.remove("active");

  overlay.classList.remove("active");
});

// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    const confirmed = confirm("Are you sure you want to logout?");

    if (!confirmed) return;

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message, "error");

        return;
      }

      showToast("Logged out successfully.", "success");

      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1500);
    } catch {
      showToast("Something went wrong.", "error");
    }
  });
}
