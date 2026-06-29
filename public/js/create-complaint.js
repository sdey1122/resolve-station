/**
 * ==========================================
 * CREATE COMPLAINT
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * ==========================================
   * ELEMENTS
   * ==========================================
   */

  const form = document.getElementById("createComplaintForm");

  if (!form) return;

  const imageInput = document.getElementById("image");

  const uploadArea = document.getElementById("uploadArea");

  const uploadContent = document.getElementById("uploadContent");

  const browseImage = document.getElementById("browseImage");

  const imagePreview = document.getElementById("imagePreview");

  const previewImage = document.getElementById("previewImage");

  const removeImage = document.getElementById("removeImage");

  const description = document.getElementById("description");

  const descriptionCount = document.getElementById("descriptionCount");

  /**
   * ==========================================
   * CHARACTER COUNTER
   * ==========================================
   */

  if (description) {
    description.addEventListener("input", () => {
      descriptionCount.textContent = description.value.length;
    });
  }

  /**
   * ==========================================
   * OPEN FILE PICKER
   * ==========================================
   */

  browseImage?.addEventListener("click", (e) => {
    e.stopPropagation();

    imageInput.click();
  });

  uploadArea?.addEventListener("click", (e) => {
    if (e.target.closest(".remove-image")) return;

    if (e.target.closest(".upload-btn")) return;

    imageInput.click();
  });

  /**
   * ==========================================
   * IMAGE PREVIEW
   * ==========================================
   */

  function showPreview(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image.", "error");

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Maximum image size is 5 MB.", "error");

      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      previewImage.src = event.target.result;

      uploadContent.style.display = "none";

      imagePreview.classList.add("active");
    };

    reader.readAsDataURL(file);
  }

  imageInput?.addEventListener("change", () => {
    if (imageInput.files.length) {
      showPreview(imageInput.files[0]);
    }
  });

  /**
   * ==========================================
   * REMOVE IMAGE
   * ==========================================
   */

  removeImage?.addEventListener("click", (e) => {
    e.stopPropagation();

    imageInput.value = "";

    previewImage.src = "";

    imagePreview.classList.remove("active");

    uploadContent.style.display = "flex";
  });

  /**
   * ==========================================
   * DRAG & DROP
   * ==========================================
   */

  uploadArea?.addEventListener("dragover", (e) => {
    e.preventDefault();

    uploadArea.classList.add("dragover");
  });

  uploadArea?.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover");
  });

  uploadArea?.addEventListener("drop", (e) => {
    e.preventDefault();

    uploadArea.classList.remove("dragover");

    const file = e.dataTransfer.files[0];

    if (!file) return;

    imageInput.files = e.dataTransfer.files;

    showPreview(file);
  });

  /**
   * ==========================================
   * HELPERS
   * ==========================================
   */

  function setError(id, message) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = message;
    }
  }

  function clearErrors() {
    document.querySelectorAll(".form-error").forEach((error) => {
      error.textContent = "";
    });

    document
      .querySelectorAll(".form-input, .form-textarea")
      .forEach((input) => {
        input.classList.remove("input-error");

        input.classList.remove("input-success");
      });
  }

  /**
   * ==========================================
   * SUBMIT FORM
   * ==========================================
   */

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearErrors();

    let isValid = true;

    const title = document.getElementById("title");

    const category = document.getElementById("category");

    const incidentDate = document.getElementById("incidentDate");

    const incidentTime = document.getElementById("incidentTime");

    /**
     * ==========================================
     * TITLE
     * ==========================================
     */

    if (!title.value.trim()) {
      setError("titleError", "Complaint title is required.");

      title.classList.add("input-error");

      isValid = false;
    } else {
      title.classList.add("input-success");
    }

    /**
     * ==========================================
     * CATEGORY
     * ==========================================
     */

    if (!category.value) {
      setError("categoryError", "Please select a category.");

      category.classList.add("input-error");

      isValid = false;
    } else {
      category.classList.add("input-success");
    }

    /**
     * ==========================================
     * INCIDENT DATE
     * ==========================================
     */

    if (!incidentDate.value) {
      setError("incidentDateError", "Incident date is required.");

      incidentDate.classList.add("input-error");

      isValid = false;
    } else {
      incidentDate.classList.add("input-success");
    }

    /**
     * ==========================================
     * INCIDENT TIME
     * ==========================================
     */

    if (!incidentTime.value) {
      setError("incidentTimeError", "Incident time is required.");

      incidentTime.classList.add("input-error");

      isValid = false;
    } else {
      incidentTime.classList.add("input-success");
    }

    /**
     * ==========================================
     * DESCRIPTION
     * ==========================================
     */

    if (description.value.trim().length < 20) {
      setError(
        "descriptionError",
        "Description must be at least 20 characters.",
      );

      description.classList.add("input-error");

      isValid = false;
    } else {
      description.classList.add("input-success");
    }

    /**
     * ==========================================
     * IMAGE
     * ==========================================
     */

    if (!imageInput.files.length) {
      setError("imageError", "Please upload a complaint image.");

      isValid = false;
    }

    if (!isValid) {
      return;
    }

    /**
     * ==========================================
     * SUBMIT BUTTON
     * ==========================================
     */

    const submitButton = form.querySelector(".submit-btn");

    submitButton.disabled = true;

    submitButton.innerHTML = `
      <i class="bi bi-arrow-repeat spin"></i>
      Submitting...
    `;

    try {
      const formData = new FormData(form);

      const response = await fetch("/api/complaints", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit complaint.");
      }

      /**
       * ==========================================
       * SUCCESS
       * ==========================================
       */

      showToast(data.message || "Complaint submitted successfully.", "success");

      form.reset();

      descriptionCount.textContent = "0";

      previewImage.src = "";

      imagePreview.classList.remove("active");

      uploadContent.style.display = "flex";

      setTimeout(() => {
        window.location.href = "/resident/dashboard";
      }, 1800);
    } catch (error) {
      console.error(error);

      showToast(error.message, "error");
    } finally {
      submitButton.disabled = false;

      submitButton.innerHTML = `
        <i class="bi bi-send-fill"></i>
        Submit Complaint
      `;
    }
  });
});
