/**
 * ==========================================
 * ELEMENTS
 * ==========================================
 */

const form = document.getElementById("updateResidentForm");

const residentId = document.getElementById("residentId")?.value;

const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");

const profileImage = document.getElementById("profileImage");

const imagePreview = document.getElementById("imagePreview");

const submitBtn = document.querySelector(".submit-btn");

const resetFormBtn = document.getElementById("resetFormBtn");

const resetModal = document.getElementById("resetModal");

const cancelReset = document.getElementById("cancelReset");

const confirmReset = document.getElementById("confirmReset");

const successToast = document.getElementById("successToast");

/**
 * ==========================================
 * ERROR HANDLER
 * ==========================================
 */

function showError(input, message) {
  const group = input.closest(".form-group");

  const error = group.querySelector(".error-message");

  error.textContent = message;

  input.classList.remove("input-success");

  input.classList.add("input-error");
}

function showSuccess(input) {
  const group = input.closest(".form-group");

  const error = group.querySelector(".error-message");

  error.textContent = "";

  input.classList.remove("input-error");

  input.classList.add("input-success");
}

function resetField(input) {
  const group = input.closest(".form-group");

  const error = group.querySelector(".error-message");

  error.textContent = "";

  input.classList.remove("input-success");

  input.classList.remove("input-error");
}

/**
 * ==========================================
 * NAME VALIDATION
 * ==========================================
 */

nameInput?.addEventListener("input", () => {
  const value = nameInput.value.trim();

  if (!value) {
    return resetField(nameInput);
  }

  if (value.length < 3) {
    return showError(nameInput, "Name must be at least 3 characters.");
  }

  if (value.length > 32) {
    return showError(nameInput, "Name cannot exceed 32 characters.");
  }

  showSuccess(nameInput);
});

/**
 * ==========================================
 * EMAIL VALIDATION
 * ==========================================
 */

emailInput?.addEventListener("input", () => {
  const value = emailInput.value.trim();

  if (!value) {
    return resetField(emailInput);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return showError(emailInput, "Please enter a valid email address.");
  }

  showSuccess(emailInput);
});

/**
 * ==========================================
 * IMAGE PREVIEW
 * ==========================================
 */

profileImage?.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) {
    imagePreview.innerHTML = "";

    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    imagePreview.innerHTML = `
      <img
        src="${e.target.result}"
        alt="Resident"
      >
    `;
  };

  reader.readAsDataURL(file);
});

/**
 * ==========================================
 * FORM VALIDATION
 * ==========================================
 */

function validateForm() {
  let valid = true;

  const name = nameInput.value.trim();

  const email = emailInput.value.trim();

  if (name.length < 3 || name.length > 32) {
    showError(nameInput, "Name must be between 3 and 32 characters.");

    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showError(emailInput, "Please enter a valid email address.");

    valid = false;
  }

  return valid;
}

/**
 * ==========================================
 * UPDATE RESIDENT
 * ==========================================
 */

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateForm()) return;

  try {
    submitBtn.disabled = true;

    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Updating Resident...';

    const formData = new FormData(form);

    const response = await fetch(`/api/admin/resident/${residentId}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      if (result.field === "email") {
        showError(emailInput, result.message);

        emailInput.focus();
      } else {
        alert(result.message || "Failed to update resident.");
      }

      return;
    }

    showSuccessToast();

    setTimeout(() => {
      window.location.href = "/admin/resident/show";
    }, 1500);
  } catch (error) {
    console.error(error);

    alert("Something went wrong.");
  } finally {
    submitBtn.disabled = false;

    submitBtn.innerHTML = "Update Resident";
  }
});

/**
 * ==========================================
 * RESET FORM
 * ==========================================
 */

form?.addEventListener("reset", () => {
  setTimeout(() => {
    imagePreview.innerHTML = "";

    if (profileImage) {
      profileImage.value = "";
    }

    document
      .querySelectorAll(".input-success, .input-error")
      .forEach((field) => {
        field.classList.remove("input-success");
        field.classList.remove("input-error");
      });

    document.querySelectorAll(".error-message").forEach((error) => {
      error.textContent = "";
    });
  }, 0);
});

/**
 * ==========================================
 * RESET MODAL
 * ==========================================
 */

resetFormBtn?.addEventListener("click", () => {
  resetModal.classList.add("active");
});

cancelReset?.addEventListener("click", () => {
  resetModal.classList.remove("active");
});

resetModal?.addEventListener("click", (event) => {
  if (event.target === resetModal) {
    resetModal.classList.remove("active");
  }
});

confirmReset?.addEventListener("click", () => {
  form.reset();

  resetModal.classList.remove("active");
});

/**
 * ==========================================
 * SUCCESS TOAST
 * ==========================================
 */

function showSuccessToast() {
  successToast.classList.add("active");

  setTimeout(() => {
    successToast.classList.remove("active");
  }, 4000);
}

/**
 * ==========================================
 * LOAD RESIDENT
 * ==========================================
 */

if (residentId) {
  loadResident();
}

async function loadResident() {
  try {
    const response = await fetch(`/api/admin/resident/${residentId}`, {
      credentials: "include",
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message || "Resident not found.");

      window.location.href = "/admin/resident/show";

      return;
    }

    const resident = result.resident;

    nameInput.value = resident.name;

    emailInput.value = resident.email;

    if (resident.profileImage?.url) {
      imagePreview.innerHTML = `
        <img
          src="${resident.profileImage.url}"
          alt="${resident.name}"
        >
      `;
    }
  } catch (error) {
    console.error(error);

    alert("Unable to load resident.");
  }
}
