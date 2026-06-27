/**
 * ==========================================
 * ELEMENTS
 * ==========================================
 */

const form = document.getElementById("createStaffForm");

const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");

const profileImage = document.getElementById("profileImage");

const imagePreview = document.getElementById("imagePreview");

const resetFormBtn = document.getElementById("resetFormBtn");

const resetModal = document.getElementById("resetModal");

const cancelReset = document.getElementById("cancelReset");

const confirmReset = document.getElementById("confirmReset");

const staffId = document.getElementById("staffId")?.value;
/**
 * ==========================================
 * ERROR HANDLER
 * ==========================================
 */

function showError(input, message) {
  const group = input.closest(".form-group");

  const error = group.querySelector(".error-message");

  if (error) {
    error.textContent = message;
  }

  input.classList.remove("input-success");

  input.classList.add("input-error");
}

function showSuccess(input) {
  const group = input.closest(".form-group");

  const error = group.querySelector(".error-message");

  if (error) {
    error.textContent = "";
  }

  input.classList.remove("input-error");

  input.classList.add("input-success");
}

function resetField(input) {
  const group = input.closest(".form-group");

  const error = group.querySelector(".error-message");

  if (error) {
    error.textContent = "";
  }

  input.classList.remove("input-error");

  input.classList.remove("input-success");
}

/**
 * ==========================================
 * NAME VALIDATION
 * ==========================================
 */

nameInput?.addEventListener("input", () => {
  const value = nameInput.value.trim();

  if (!value) {
    resetField(nameInput);

    return;
  }

  if (value.length < 3) {
    showError(nameInput, "Name must be at least 3 characters.");
  } else if (value.length > 32) {
    showError(nameInput, "Name cannot exceed 32 characters.");
  } else {
    showSuccess(nameInput);
  }
});

/**
 * ==========================================
 * EMAIL VALIDATION
 * ==========================================
 */

emailInput?.addEventListener("input", () => {
  const value = emailInput.value.trim();

  if (!value) {
    resetField(emailInput);

    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    showError(emailInput, "Please enter a valid email address.");
  } else {
    showSuccess(emailInput);
  }
});

/**


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
      <img src="${e.target.result}" alt="Preview">
    `;
  };

  reader.readAsDataURL(file);
});

/**
 * ==========================================
 * FINAL VALIDATION
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
 * SUBMIT
 * ==========================================
 */

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const submitBtn = document.querySelector(".submit-btn");

  try {
    submitBtn.disabled = true;

    submitBtn.innerHTML = staffId
      ? '<span class="spinner-border spinner-border-sm"></span> Updating Staff...'
      : '<span class="spinner-border spinner-border-sm"></span> Creating Staff...';

    const formData = new FormData(form);

    // const response = await fetch("/api/admin/staff", {
    //   method: "POST",

    //   credentials: "include",

    //   body: formData,
    // });

    const url = staffId ? `/api/admin/staff/${staffId}` : "/api/admin/staff";

    const method = staffId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      credentials: "include",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      showSuccessToast();

      setTimeout(() => {
        window.location.href = "/admin/staff/show";
      }, 1500);

      form.reset();

      imagePreview.innerHTML = "";

      document.querySelectorAll(".input-success").forEach((field) => {
        field.classList.remove("input-success");
      });

      document.querySelectorAll(".error-message").forEach((error) => {
        error.textContent = "";
      });
    } else {
      if (result.field === "email") {
        showError(emailInput, result.message);

        emailInput.focus();
      } else {
        alert(result.message || "Failed to create staff.");
      }
    }
  } catch (error) {
    console.error(error);

    alert("Something went wrong.");
  } finally {
    submitBtn.disabled = false;

    submitBtn.innerHTML = staffId ? "Update Staff" : "Create Staff";
  }
});

/**
 * ==========================================
 * RESET FORM
 * ==========================================
 */

form?.addEventListener("reset", () => {
  setTimeout(() => {
    // Image Preview

    imagePreview.innerHTML = "";

    // Remove Validation Classes

    document
      .querySelectorAll(".input-success, .input-error")
      .forEach((field) => {
        field.classList.remove("input-success");

        field.classList.remove("input-error");
      });

    // Clear Error Messages

    document.querySelectorAll(".error-message").forEach((error) => {
      error.textContent = "";
    });

    // Reset File Input

    if (profileImage) {
      profileImage.value = "";
    }
  }, 0);
});

/**
 * ==========================================
 * OPEN RESET MODAL
 * ==========================================
 */

resetFormBtn?.addEventListener("click", () => {
  resetModal?.classList.add("active");
});

/**
 * ==========================================
 * CANCEL RESET
 * ==========================================
 */

cancelReset?.addEventListener("click", () => {
  resetModal?.classList.remove("active");
});

/**
 * ==========================================
 * CLOSE ON OUTSIDE CLICK
 * ==========================================
 */

resetModal?.addEventListener("click", (event) => {
  if (event.target === resetModal) {
    resetModal.classList.remove("active");
  }
});

/**
 * ==========================================
 * CONFIRM RESET
 * ==========================================
 */

confirmReset?.addEventListener("click", () => {
  form.reset();

  imagePreview.innerHTML = "";

  profileImage.value = "";

  document.querySelectorAll(".error-message").forEach((error) => {
    error.textContent = "";
  });

  document.querySelectorAll(".input-success, .input-error").forEach((field) => {
    field.classList.remove("input-success");

    field.classList.remove("input-error");
  });

  resetModal.classList.remove("active");
});

const successToast = document.getElementById("successToast");

function showSuccessToast() {
  successToast.classList.add("active");

  setTimeout(() => {
    successToast.classList.remove("active");
  }, 4000);
}

// staff data
if (staffId) {
  loadStaff();
}

async function loadStaff() {
  try {
    const response = await fetch(`/api/admin/staff/${staffId}`, {
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      nameInput.value = result.staff.name;
      emailInput.value = result.staff.email;

      if (result.staff.profileImage?.url) {
        imagePreview.innerHTML = `
          <img src="${result.staff.profileImage.url}" alt="Preview">
        `;
      }
    }
  } catch (error) {
    console.error(error);
  }
}
