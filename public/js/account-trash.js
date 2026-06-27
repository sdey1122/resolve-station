/**
 * ==========================================
 * ELEMENTS
 * ==========================================
 */

const tableBody = document.getElementById("trashTableBody");

const searchInput = document.getElementById("searchAccount");

const sortSelect = document.getElementById("sortAccount");

const prevBtn = document.getElementById("prevPage");

const nextBtn = document.getElementById("nextPage");

const pageInfo = document.getElementById("pageInfo");

/**
 * ==========================================
 * RESTORE MODAL
 * ==========================================
 */

const restoreModal = document.getElementById("restoreModal");

const cancelRestore = document.getElementById("cancelRestore");

const confirmRestore = document.getElementById("confirmRestore");

/**
 * ==========================================
 * DELETE MODAL
 * ==========================================
 */

const deleteModal = document.getElementById("deleteModal");

const cancelDelete = document.getElementById("cancelDelete");

const confirmDelete = document.getElementById("confirmDelete");

/**
 * ==========================================
 * SUCCESS TOAST
 * ==========================================
 */

const successToast = document.getElementById("successToast");

const toastTitle = document.getElementById("toastTitle");

const toastMessage = document.getElementById("toastMessage");

/**
 * ==========================================
 * STATE
 * ==========================================
 */

let allAccounts = [];

let filteredAccounts = [];

let currentPage = 1;

const accountsPerPage = 6;

let selectedAccountId = null;

let selectedRole = null;

/**
 * ==========================================
 * FETCH DELETED ACCOUNTS
 * ==========================================
 */

async function fetchDeletedAccounts() {
  try {
    const [staffResponse, residentResponse] = await Promise.all([
      fetch("/api/admin/staff/deleted", {
        credentials: "include",
      }),

      fetch("/api/admin/resident/deleted", {
        credentials: "include",
      }),
    ]);

    const staffResult = await staffResponse.json();

    const residentResult = await residentResponse.json();

    const deletedStaff = (staffResult.staff || []).map((staff) => ({
      ...staff,

      role: "STAFF",
    }));

    const deletedResidents = (residentResult.residents || []).map(
      (resident) => ({
        ...resident,

        role: "RESIDENT",
      }),
    );

    allAccounts = [...deletedStaff, ...deletedResidents];

    filteredAccounts = [...allAccounts];

    applySort();

    renderTable();
  } catch (error) {
    console.error("Fetch Deleted Accounts Error:", error);
  }
}

/**
 * ==========================================
 * RENDER TABLE
 * ==========================================
 */

function renderTable() {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * accountsPerPage;

  const end = start + accountsPerPage;

  const accounts = filteredAccounts.slice(start, end);

  if (!accounts.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4">
          No deleted accounts found.
        </td>
      </tr>
    `;

    updatePagination();

    return;
  }

  accounts.forEach((account) => {
    const maskedId = "****" + account._id.slice(-4);

    const deletedDate = new Date(account.deletedAt).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <span class="staff-id">
          ${maskedId}
        </span>
      </td>

      <td>
        <img
          src="${account.profileImage?.url || "/images/default-user.png"}"
          class="staff-avatar"
          alt="${account.name}"
        >
      </td>

      <td>${account.name}</td>

      <td>${account.email}</td>

      <td>
        ${
          account.role === "STAFF"
            ? `
              <span class="badge bg-primary">
                Staff
              </span>
            `
            : `
              <span class="badge bg-success">
                Resident
              </span>
            `
        }
      </td>

      <td>${deletedDate}</td>

      <td>
        <div class="staff-actions">

          <button
            class="edit-btn restore-btn"
            data-id="${account._id}"
            data-role="${account.role}"
          >
            <i class="bi bi-arrow-counterclockwise"></i>

            Restore
          </button>

          <button
            class="delete-btn permanent-delete-btn"
            data-id="${account._id}"
            data-role="${account.role}"
          >
            <i class="bi bi-trash3"></i>

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

  filteredAccounts = allAccounts.filter((account) => {
    return (
      account.name.toLowerCase().includes(value) ||
      account.email.toLowerCase().includes(value)
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

/**
 * ==========================================
 * APPLY SORT
 * ==========================================
 */

function applySort() {
  switch (sortSelect.value) {
    case "az":
      filteredAccounts.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "za":
      filteredAccounts.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case "oldest":
      filteredAccounts.sort(
        (a, b) => new Date(a.deletedAt) - new Date(b.deletedAt),
      );
      break;

    case "newest":
    default:
      filteredAccounts.sort(
        (a, b) => new Date(b.deletedAt) - new Date(a.deletedAt),
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
  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage) || 1;

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
  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage) || 1;

  if (currentPage < totalPages) {
    currentPage++;

    renderTable();
  }
});

/**
 * ==========================================
 * RESTORE ACCOUNT
 * ==========================================
 */

document.addEventListener("click", (event) => {
  const restoreButton = event.target.closest(".restore-btn");

  if (!restoreButton) {
    return;
  }

  selectedAccountId = restoreButton.dataset.id;

  selectedRole = restoreButton.dataset.role;

  restoreModal.classList.add("active");
});

cancelRestore?.addEventListener("click", () => {
  restoreModal.classList.remove("active");

  selectedAccountId = null;

  selectedRole = null;
});

restoreModal?.addEventListener("click", (event) => {
  if (event.target !== restoreModal) {
    return;
  }

  restoreModal.classList.remove("active");

  selectedAccountId = null;

  selectedRole = null;
});

confirmRestore?.addEventListener("click", async () => {
  if (!selectedAccountId || !selectedRole) {
    return;
  }

  try {
    confirmRestore.disabled = true;

    confirmRestore.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Restoring...';

    const endpoint =
      selectedRole === "STAFF"
        ? `/api/admin/staff/${selectedAccountId}/restore`
        : `/api/admin/resident/${selectedAccountId}/restore`;

    const response = await fetch(endpoint, {
      method: "PATCH",
      credentials: "include",
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message);

      return;
    }

    restoreModal.classList.remove("active");

    toastTitle.textContent = "Account Restored";

    toastMessage.textContent = "The account has been restored successfully.";

    successToast.classList.add("show");

    setTimeout(() => {
      successToast.classList.remove("show");
    }, 3000);

    selectedAccountId = null;

    selectedRole = null;

    await fetchDeletedAccounts();
  } catch (error) {
    console.error(error);

    alert("Something went wrong.");
  } finally {
    confirmRestore.disabled = false;

    confirmRestore.textContent = "Yes, Restore";
  }
});

/**
 * ==========================================
 * PERMANENT DELETE
 * ==========================================
 */

document.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".permanent-delete-btn");

  if (!deleteButton) {
    return;
  }

  selectedAccountId = deleteButton.dataset.id;

  selectedRole = deleteButton.dataset.role;

  deleteModal.classList.add("active");
});

cancelDelete?.addEventListener("click", () => {
  deleteModal.classList.remove("active");

  selectedAccountId = null;

  selectedRole = null;
});

deleteModal?.addEventListener("click", (event) => {
  if (event.target !== deleteModal) {
    return;
  }

  deleteModal.classList.remove("active");

  selectedAccountId = null;

  selectedRole = null;
});

confirmDelete?.addEventListener("click", async () => {
  if (!selectedAccountId || !selectedRole) {
    return;
  }

  try {
    confirmDelete.disabled = true;

    confirmDelete.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Deleting...';

    const endpoint =
      selectedRole === "STAFF"
        ? `/api/admin/staff/${selectedAccountId}/permanent`
        : `/api/admin/resident/${selectedAccountId}/permanent`;

    const response = await fetch(endpoint, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message);

      return;
    }

    deleteModal.classList.remove("active");

    toastTitle.textContent = "Account Deleted";

    toastMessage.textContent = "The account has been permanently deleted.";

    successToast.classList.add("show");

    setTimeout(() => {
      successToast.classList.remove("show");
    }, 3000);

    selectedAccountId = null;

    selectedRole = null;

    await fetchDeletedAccounts();
  } catch (error) {
    console.error(error);

    alert("Something went wrong.");
  } finally {
    confirmDelete.disabled = false;

    confirmDelete.textContent = "Yes, Delete";
  }
});

/**
 * ==========================================
 * INITIALIZE
 * ==========================================
 */

fetchDeletedAccounts();
