// function showToast(message, type = "success") {
//   const container = document.getElementById("toast-container");

//   if (!container) return;

//   const toast = document.createElement("div");

//   toast.className = `toast toast-${type}`;

//   toast.innerHTML = message;

//   container.appendChild(toast);

//   setTimeout(() => {
//     toast.remove();
//   }, 4000);
// }

/**
 * ==========================================
 * GLOBAL TOAST
 * ==========================================
 */

function showToast(message, type = "success") {
  const oldToast = document.querySelector(".global-toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");

  toast.className = `global-toast ${type}`;

  toast.innerHTML = `
        <i class="bi ${
          type === "success"
            ? "bi-check-circle-fill"
            : "bi-exclamation-circle-fill"
        }"></i>

        <span>${message}</span>
    `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}
