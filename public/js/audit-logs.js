/**
 * ==========================================
 * ELEMENTS
 * ==========================================
 */

const tableBody = document.getElementById("auditTableBody");

const searchInput = document.getElementById("searchLog");

const roleFilter = document.getElementById("roleFilter");

const actionFilter = document.getElementById("actionFilter");

const sortSelect = document.getElementById("sortLog");

const prevBtn = document.getElementById("prevPage");

const nextBtn = document.getElementById("nextPage");

const pageInfo = document.getElementById("pageInfo");

/**
 * ==========================================
 * STATE
 * ==========================================
 */

let allLogs = [];

let filteredLogs = [];

let currentPage = 1;

const logsPerPage = 10;
/**
 * ==========================================
 * RENDER TABLE
 * ==========================================
 */

function renderTable() {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * logsPerPage;

  const end = start + logsPerPage;

  const logs = filteredLogs.slice(start, end);

  if (!logs.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          No audit logs found.
        </td>
      </tr>
    `;

    updatePagination();

    return;
  }

  logs.forEach((log) => {
    const action = String(log.action || "").toUpperCase();

    const role = String(log.targetUser?.role || log.role || "").toUpperCase();

    const createdAt = new Date(log.createdAt);

    const date = createdAt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const time = createdAt.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let actionBadge = "";

    switch (action) {
      case "CREATE":
        actionBadge = `
          <span class="badge bg-success">
            Created
          </span>
        `;
        break;

      case "UPDATE":
        actionBadge = `
          <span class="badge bg-warning text-dark">
            Updated
          </span>
        `;
        break;

      case "DELETE":
        actionBadge = `
          <span class="badge bg-danger">
            Deleted
          </span>
        `;
        break;

      case "RESTORE":
        actionBadge = `
          <span class="badge bg-primary">
            Restored
          </span>
        `;
        break;

      case "PERMANENT_DELETE":
        actionBadge = `
          <span class="badge bg-dark">
            Permanent Delete
          </span>
        `;
        break;

      default:
        actionBadge = `
          <span class="badge bg-secondary">
            ${log.action}
          </span>
        `;
    }

    // const roleBadge =
    //   role === "STAFF"
    //     ? `
    //       <span class="badge bg-primary">
    //         Staff
    //       </span>
    //     `
    //     : role === "RESIDENT"
    //       ? `
    //         <span class="badge bg-success">
    //           Resident
    //         </span>
    //       `
    //       : `
    //         <span class="badge bg-secondary">
    //           Admin
    //         </span>
    //       `;

    const roleBadge =
      role === "STAFF"
        ? `
      <span class="badge bg-primary">
        Staff
      </span>
    `
        : role === "RESIDENT"
          ? `
        <span class="badge bg-success">
          Resident
        </span>
      `
          : `
        <span class="badge bg-dark">
          Admin
        </span>
      `;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <div>${date}</div>

        <small class="text-muted">
          ${time}
        </small>
      </td>

      <td>
        ${log.performedBy?.name || "-"}
      </td>

      <td>
        ${actionBadge}
      </td>

      <td>
        ${log.details || "-"}
      </td>

      <td>
        ${roleBadge}
      </td>

      <td>
        ${log.ipAddress || "-"}
      </td>
    `;

    tableBody.appendChild(row);
  });

  updatePagination();
}

/**
 * ==========================================
 * FETCH AUDIT LOGS
 * ==========================================
 */

async function fetchAuditLogs() {
  try {
    const response = await fetch("/api/admin/audit-logs", {
      credentials: "include",
    });

    const result = await response.json();

    if (!result.success) {
      return;
    }

    allLogs = result.logs || [];

    filteredLogs = [...allLogs];

    applyFilters();

    renderTable();
  } catch (error) {
    console.error("Fetch Audit Logs Error:", error);
  }
}

/**
 * ==========================================
 * SEARCH
 * ==========================================
 */

searchInput?.addEventListener("input", () => {
  currentPage = 1;

  applyFilters();

  renderTable();
});

/**
 * ==========================================
 * ROLE FILTER
 * ==========================================
 */

roleFilter?.addEventListener("change", () => {
  currentPage = 1;

  applyFilters();

  renderTable();
});

/**
 * ==========================================
 * ACTION FILTER
 * ==========================================
 */

actionFilter?.addEventListener("change", () => {
  currentPage = 1;

  applyFilters();

  renderTable();
});

/**
 * ==========================================
 * SORT
 * ==========================================
 */

sortSelect?.addEventListener("change", () => {
  currentPage = 1;

  applyFilters();

  renderTable();
});

/**
 * ==========================================
 * APPLY FILTERS
 * ==========================================
 */

function applyFilters() {
  const search = searchInput.value.trim().toLowerCase();

  const selectedRole = roleFilter.value.toUpperCase();

  const selectedAction = actionFilter.value.toUpperCase();

  filteredLogs = allLogs.filter((log) => {
    const action = String(log.action || "").toUpperCase();

    const role = String(log.targetUser?.role || log.role || "").toUpperCase();

    const searchable = `
    ${log.performedBy?.name || ""}
    ${log.details || ""}
    ${action}
  `.toLowerCase();

    const matchSearch = searchable.includes(search);

    const matchRole = selectedRole === "ALL" || role === selectedRole;

    const matchAction =
      selectedAction === "ALL" || action.includes(selectedAction);

    return matchSearch && matchRole && matchAction;
  });

  switch (sortSelect.value) {
    case "oldest":
      filteredLogs.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
      break;

    case "az":
      filteredLogs.sort((a, b) =>
        (a.performedBy?.name || "").localeCompare(b.performedBy?.name || ""),
      );
      break;

    case "za":
      filteredLogs.sort((a, b) =>
        (b.performedBy?.name || "").localeCompare(a.performedBy?.name || ""),
      );
      break;

    case "newest":
    default:
      filteredLogs.sort(
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
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage) || 1;

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
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage) || 1;

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

fetchAuditLogs();
