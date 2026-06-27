/**
 * =====================================================
 * PROFILE PAGE
 * =====================================================
 */

/**
 * =====================================================
 * ELEMENTS
 * =====================================================
 */

const profileImageInput = document.getElementById("profileImage");

const profilePreview = document.getElementById("profilePreview");

const headerProfileImage = document.getElementById("headerProfileImage");

const profileName = document.getElementById("profileName");

const profileEmail = document.getElementById("profileEmail");

const memberSinceElements = document.querySelectorAll(".memberSince");

const summaryName = document.getElementById("summaryName");

const summaryEmail = document.getElementById("summaryEmail");

const summaryDate = document.getElementById("summaryDate");

const bioView = document.getElementById("bioView");

const bioEditor = document.getElementById("bioEditor");

const bioText = document.getElementById("bioText");

const description = document.getElementById("description");

const descriptionCounter = document.getElementById("descriptionCounter");

const editBiography = document.getElementById("editBiography");

const cancelBiography = document.getElementById("cancelBiography");

const saveBiography = document.getElementById("saveBiography");

const saveProfile = document.getElementById("saveProfile");

const successToast = document.getElementById("successToast");

const toastTitle = document.getElementById("toastTitle");

const toastMessage = document.getElementById("toastMessage");

/**
 * =====================================================
 * STATE
 * =====================================================
 */

let selectedImage = null;

let profile = null;

let biography = "";

/**
 * =====================================================
 * FETCH PROFILE
 * =====================================================
 */

async function fetchProfile() {
  try {
    const response = await fetch("/api/admin/profile", {
      credentials: "include",
    });

    const result = await response.json();

    if (!result.success || !result.admin) return;

    profile = result.admin;

    biography = profile.description || "";

    renderProfile();
  } catch (error) {
    console.error(error);
  }
}

/**
 * =====================================================
 * RENDER PROFILE
 * =====================================================
 */

function renderProfile() {
  if (!profile) return;

  const avatar = profile.profileImage?.url || "/images/default-avatar.png";

  profilePreview && (profilePreview.src = avatar);

  headerProfileImage && (headerProfileImage.src = avatar);

  profileName && (profileName.textContent = profile.name);

  profileEmail &&
    (profileEmail.innerHTML = `
        <i class="bi bi-envelope-fill"></i>
        ${profile.email}
    `);

  summaryName && (summaryName.textContent = profile.name);

  summaryEmail && (summaryEmail.textContent = profile.email);

  biography = profile.description || "";

  bioText && (bioText.textContent = biography);

  if (description) {
    description.value = biography;
    updateCounter();
  }

  if (profile.createdAt) {
    const joined = new Date(profile.createdAt);

    const formatted = joined.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    memberSinceElements.forEach((element) => {
      element.textContent = formatted;
    });

    if (summaryDate) {
      summaryDate.textContent = formatted;
    }

    console.log("Member Since:", formatted);
  }
}

/**
 * =====================================================
 * CHARACTER COUNTER
 * =====================================================
 */

function updateCounter() {
  descriptionCounter.textContent = `${description.value.length} / 500`;
}

description?.addEventListener("input", updateCounter);

/**
 * =====================================================
 * EDIT BIOGRAPHY
 * =====================================================
 */

editBiography?.addEventListener("click", () => {
  description.value = biography;

  updateCounter();

  bioView.style.display = "none";

  bioEditor.style.display = "block";

  description.focus();
});

/**
 * =====================================================
 * CANCEL BIOGRAPHY
 * =====================================================
 */

cancelBiography?.addEventListener("click", () => {
  description.value = biography;

  updateCounter();

  bioEditor.style.display = "none";

  bioView.style.display = "flex";
});

/**
 * =====================================================
 * SAVE BIOGRAPHY (LOCAL ONLY)
 * =====================================================
 */

saveBiography?.addEventListener("click", () => {
  biography = description.value.trim();

  bioText.textContent = biography || "Write a short administrator biography.";

  bioEditor.style.display = "none";

  bioView.style.display = "block";
});

/**
 * =====================================================
 * IMAGE PREVIEW
 * =====================================================
 */

profileImageInput?.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) return;

  selectedImage = file;

  const reader = new FileReader();

  reader.onload = (e) => {
    profilePreview.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

/**
 * =====================================================
 * SAVE COMPLETE PROFILE
 * =====================================================
 */

saveProfile?.addEventListener("click", async () => {
  try {
    saveProfile.disabled = true;

    saveProfile.innerHTML = `
      <span
        class="spinner-border spinner-border-sm"
        role="status"
      ></span>

      Saving Changes...
    `;

    const formData = new FormData();

    formData.append("description", description.value.trim());

    if (selectedImage) {
      formData.append("profileImage", selectedImage);
    }

    const response = await fetch("/api/admin/profile", {
      method: "PUT",

      credentials: "include",

      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message);

      return;
    }

    /**
     * ===========================
     * UPDATE STATE
     * ===========================
     */

    profile = result.admin;

    biography = profile.description || "";

    selectedImage = null;

    profileImageInput.value = "";

    renderProfile();

    /**
     * ===========================
     * SUCCESS
     * ===========================
     */

    showToast("Profile Updated", "Administrator profile updated successfully.");

    setTimeout(() => {
      window.location.href = "/admin/dashboard";
    }, 3000);
  } catch (error) {
    console.error(error);

    alert("Something went wrong.");
  } finally {
    saveProfile.disabled = false;

    saveProfile.innerHTML = `
      <i class="bi bi-floppy-fill"></i>

      Save Profile Changes
    `;
  }
});

/**
 * =====================================================
 * SUCCESS TOAST
 * =====================================================
 */

function showToast(title, message) {
  if (toastTitle) toastTitle.textContent = title;

  if (toastMessage) toastMessage.textContent = message;

  if (successToast) successToast.classList.add("active");

  setTimeout(() => {
    successToast.classList.remove("active");
  }, 3000);
}

/**
 * =====================================================
 * INITIALIZE
 * =====================================================
 */

document.addEventListener("DOMContentLoaded", fetchProfile);
