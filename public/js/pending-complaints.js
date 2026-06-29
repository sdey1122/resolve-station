/**
 * ==========================================
 * PENDING COMPLAINTS
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * ==========================================
   * ELEMENTS
   * ==========================================
   */

  const searchInput = document.getElementById("searchComplaint");

  const categoryFilter = document.getElementById("categoryFilter");

  const ticketCards = document.querySelectorAll(".ticket-card");

  /**
   * ==========================================
   * FILTER FUNCTION
   * ==========================================
   */

  function filterComplaints() {
    const keyword = searchInput.value.trim().toLowerCase();

    const category = categoryFilter.value.toLowerCase();

    let visibleCards = 0;

    ticketCards.forEach((card) => {
      const title =
        card.querySelector(".ticket-title")?.textContent.toLowerCase() || "";

      const complaintNumber =
        card.querySelector(".ticket-number")?.textContent.toLowerCase() || "";

      const resident =
        card.querySelector(".ticket-row strong")?.textContent.toLowerCase() ||
        "";

      const cardCategory =
        card
          .querySelector(".ticket-row:nth-of-type(2) span")
          ?.textContent.toLowerCase() || "";

      const matchesSearch =
        title.includes(keyword) ||
        complaintNumber.includes(keyword) ||
        resident.includes(keyword);

      const matchesCategory = !category || cardCategory === category;

      if (matchesSearch && matchesCategory) {
        card.style.display = "";

        visibleCards++;
      } else {
        card.style.display = "none";
      }
    });

    /**
     * ==========================================
     * EMPTY SEARCH RESULT
     * ==========================================
     */

    let emptySearch = document.getElementById("emptySearchResult");

    if (visibleCards === 0) {
      if (!emptySearch) {
        emptySearch = document.createElement("div");

        emptySearch.id = "emptySearchResult";

        emptySearch.className = "empty-state";

        emptySearch.innerHTML = `
          <i class="bi bi-search" style="font-size:3rem;color:#3b82f6;"></i>

          <h3>No Matching Complaints</h3>

          <p>
            No complaints matched your current search or category filter.
          </p>
        `;

        document.querySelector(".complaint-grid").appendChild(emptySearch);
      }
    } else {
      emptySearch?.remove();
    }
  }

  /**
   * ==========================================
   * EVENTS
   * ==========================================
   */

  searchInput?.addEventListener("input", filterComplaints);

  categoryFilter?.addEventListener("change", filterComplaints);
});
