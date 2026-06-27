/**
 * ==========================================
 * ELEMENTS
 * ==========================================
 */

const tableBody = document.getElementById("staffTableBody");

const searchInput = document.getElementById("searchStaff");

const sortSelect = document.getElementById("sortStaff");

const prevBtn = document.getElementById("prevPage");

const nextBtn = document.getElementById("nextPage");

const pageInfo = document.getElementById("pageInfo");

/**
 * ==========================================
 * DELETE MODAL ELEMENTS
 * ==========================================
 */

const deleteModal = document.getElementById("deleteModal");

const cancelDeleteStaff = document.getElementById("cancelDeleteStaff");

const confirmDeleteStaff = document.getElementById("confirmDeleteStaff");

const successToast = document.getElementById("successToast");

/**
 * ==========================================
 * STATE
 * ==========================================
 */

let allStaff = [];

let filteredStaff = [];

let currentPage = 1;

let selectedStaffId = null;

const staffPerPage = 5;

/**
 * ==========================================
 * FETCH STAFF
 * ==========================================
 */

async function fetchStaff() {
  try {
    const response = await fetch("/api/admin/staff", {
      credentials: "include",
    });

    const result = await response.json();

    if (!result.success) {
      return;
    }

    allStaff = result.staff || [];

    filteredStaff = [...allStaff];

    applySort();

    renderTable();
  } catch (error) {
    console.error("Fetch Staff Error:", error);
  }
}

/**
 * ==========================================
 * RENDER TABLE
 * ==========================================
 */

function renderTable() {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * staffPerPage;

  const end = start + staffPerPage;

  const currentStaff = filteredStaff.slice(start, end);

  if (!currentStaff.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4">
          No staff found.
        </td>
      </tr>
    `;

    updatePagination();

    return;
  }

  currentStaff.forEach((staff) => {
    const maskedId = "****" + String(staff._id || "").slice(-4);

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <span class="staff-id">
          ${maskedId}
        </span>
      </td>

      <td>
        <img
          src="${staff.profileImage?.url || "/images/default-user.png"}"
          class="staff-avatar"
          alt="${staff.name}"
        >
      </td>

      <td>${staff.name}</td>

      <td>${staff.email}</td>

      <td>
        <div class="staff-actions">
          <a
            href="/admin/staff/manage/${staff._id}"
            class="edit-btn"
          >
            <i class="bi bi-pencil-square"></i>

            Edit
          </a>

          <button
            class="delete-btn"
            data-id="${staff._id}"
          >
            <i class="bi bi-trash"></i>

            Delete
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });

  updatePagination();
}

/**
 * ==========================================
 * SEARCH
 * ==========================================
 */

searchInput?.addEventListener("input", () => {
  const value = searchInput.value.trim().toLowerCase();

  filteredStaff = allStaff.filter((staff) => {
    return (
      staff.name.toLowerCase().includes(value) ||
      staff.email.toLowerCase().includes(value)
    );
  });

  currentPage = 1;

  applySort();

  renderTable();
});

/**
 * ==========================================
 * SORT
 * ==========================================
 */

sortSelect?.addEventListener("change", () => {
  currentPage = 1;

  applySort();

  renderTable();
});

function applySort() {
  switch (sortSelect.value) {
    case "az":
      filteredStaff.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "za":
      filteredStaff.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case "oldest":
      filteredStaff.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
      break;

    case "newest":
    default:
      filteredStaff.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      break;
  }
}

/**
 * ==========================================
 * PAGINATION
 * ==========================================
 */

function updatePagination() {
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage) || 1;

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  prevBtn.disabled = currentPage === 1;

  nextBtn.disabled = currentPage >= totalPages;
}

prevBtn?.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;

    renderTable();
  }
});

nextBtn?.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage) || 1;

  if (currentPage < totalPages) {
    currentPage++;

    renderTable();
  }
});

/**
 * ==========================================
 * INITIALIZE
 * ==========================================
 */

fetchStaff();

/**
 * ==========================================
 * DELETE STAFF
 * ==========================================
 */

/**
 * OPEN DELETE MODAL
 */

document.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-btn");

  if (!button) {
    return;
  }

  selectedStaffId = button.dataset.id;

  deleteModal.classList.add("active");
});

/**
 * CANCEL DELETE
 */

cancelDeleteStaff?.addEventListener("click", () => {
  deleteModal.classList.remove("active");

  selectedStaffId = null;
});

/**
 * CLOSE MODAL
 */

deleteModal?.addEventListener("click", (event) => {
  if (event.target === deleteModal) {
    deleteModal.classList.remove("active");

    selectedStaffId = null;
  }
});

/**
 * CONFIRM DELETE
 */

confirmDeleteStaff?.addEventListener("click", async () => {
  if (!selectedStaffId) {
    return;
  }

  try {
    confirmDeleteStaff.disabled = true;

    confirmDeleteStaff.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Deleting...';

    const response = await fetch(`/api/admin/staff/${selectedStaffId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message);

      return;
    }

    deleteModal.classList.remove("active");

    successToast.classList.add("show");

    setTimeout(() => {
      successToast.classList.remove("show");
    }, 3000);

    selectedStaffId = null;

    await fetchStaff();
  } catch (error) {
    console.error("Delete Staff Error:", error);

    alert("Something went wrong.");
  } finally {
    confirmDeleteStaff.disabled = false;

    confirmDeleteStaff.innerHTML = "Yes, Delete";
  }
});
