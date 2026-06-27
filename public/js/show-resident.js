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
 * STATE
 * ==========================================
 */

let allResidents = [];

let filteredResidents = [];

let currentPage = 1;

const residentsPerPage = 6;

/**
 * ==========================================
 * FETCH RESIDENTS
 * ==========================================
 */

async function fetchResidents() {
  try {
    const response = await fetch("/api/admin/resident", {
      credentials: "include",
    });

    const result = await response.json();

    if (!result.success) {
      return;
    }

    allResidents = result.residents || [];

    filteredResidents = [...allResidents];

    applySort();

    renderTable();
  } catch (error) {
    console.error("Fetch Residents Error:", error);
  }
}

/**
 * ==========================================
 * RENDER TABLE
 * ==========================================
 */

function renderTable() {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * residentsPerPage;

  const end = start + residentsPerPage;

  const residents = filteredResidents.slice(start, end);

  if (!residents.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          No residents found.
        </td>
      </tr>
    `;

    updatePagination();

    return;
  }

  residents.forEach((resident) => {
    const maskedId = "****" + resident._id.slice(-4);

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <span class="staff-id">
          ${maskedId}
        </span>
      </td>

      <td>
        <img
          src="${resident.profileImage?.url || "/images/default-user.png"}"
          class="staff-avatar"
          alt="${resident.name}"
        >
      </td>

      <td>${resident.name}</td>

      <td>${resident.email}</td>

<td>
  ${
    resident.isVerified
      ? `
      <span class="badge bg-success">
        <i class="bi bi-check-circle-fill"></i>
        Verified
      </span>
      `
      : `
      <span class="badge bg-warning text-dark">
        <i class="bi bi-envelope-exclamation-fill"></i>
        Not Verified
      </span>
      `
  }
</td>

<td>
  <div class="staff-actions">

    <a
      href="/admin/resident/manage/${resident._id}"
      class="edit-btn"
    >
      <i class="bi bi-pencil-square"></i>

      Edit
    </a>

    <button
      class="delete-btn"
      data-id="${resident._id}"
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

  filteredResidents = allResidents.filter((resident) => {
    return (
      resident.name.toLowerCase().includes(value) ||
      resident.email.toLowerCase().includes(value)
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
  applySort();

  currentPage = 1;

  renderTable();
});

function applySort() {
  switch (sortSelect.value) {
    case "az":
      filteredResidents.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "za":
      filteredResidents.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case "oldest":
      filteredResidents.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
      break;

    case "newest":
    default:
      filteredResidents.sort(
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
  const totalPages =
    Math.ceil(filteredResidents.length / residentsPerPage) || 1;

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
  const totalPages =
    Math.ceil(filteredResidents.length / residentsPerPage) || 1;

  if (currentPage < totalPages) {
    currentPage++;

    renderTable();
  }
});

/**
 * ==========================================
 * DELETE RESIDENT
 * ==========================================
 */

const deleteModal = document.getElementById("deleteModal");

const cancelDeleteResident = document.getElementById("cancelDeleteResident");

const confirmDeleteResident = document.getElementById("confirmDeleteResident");

const successToast = document.getElementById("successToast");

let selectedResidentId = null;

/**
 * ------------------------------------------
 * OPEN DELETE MODAL
 * ------------------------------------------
 */

document.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-btn");

  if (!deleteButton) {
    return;
  }

  selectedResidentId = deleteButton.dataset.id;

  deleteModal.classList.add("active");
});

/**
 * ------------------------------------------
 * CLOSE DELETE MODAL
 * ------------------------------------------
 */

cancelDeleteResident?.addEventListener("click", () => {
  deleteModal.classList.remove("active");

  selectedResidentId = null;
});

deleteModal?.addEventListener("click", (event) => {
  if (event.target !== deleteModal) {
    return;
  }

  deleteModal.classList.remove("active");

  selectedResidentId = null;
});

/**
 * ------------------------------------------
 * CONFIRM DELETE
 * ------------------------------------------
 */

confirmDeleteResident?.addEventListener("click", async () => {
  if (!selectedResidentId) {
    return;
  }

  try {
    confirmDeleteResident.disabled = true;

    confirmDeleteResident.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Deleting...';

    const response = await fetch(`/api/admin/resident/${selectedResidentId}`, {
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

    selectedResidentId = null;

    await fetchResidents();
  } catch (error) {
    console.error("Delete Resident Error:", error);

    alert("Something went wrong.");
  } finally {
    confirmDeleteResident.disabled = false;

    confirmDeleteResident.textContent = "Yes, Delete";
  }
});

/**
 * ==========================================
 * INITIALIZE
 * ==========================================
 */

fetchResidents();
