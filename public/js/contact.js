/* =====================================================
   RESOLVESTATION CONTACT PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     MOBILE MENU
  ===================================================== */

  const navbarCollapse = document.querySelector(".navbar-collapse");
  const navbarToggler = document.querySelector(".navbar-toggler");
  const closeBtn = document.querySelector(".mobile-close-btn");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const body = document.body;
  const hamIcon = document.querySelector(".ham-icon");

  function openMenu() {
    navbarCollapse.classList.add("show");
    overlay.classList.add("show");
    body.classList.add("body-lock");

    if (hamIcon) {
      hamIcon.classList.add("hidden");
    }
  }

  function closeMenu() {
    navbarCollapse.classList.remove("show");
    overlay.classList.remove("show");
    body.classList.remove("body-lock");

    if (hamIcon) {
      hamIcon.classList.remove("hidden");
    }
  }

  if (navbarToggler) {
    navbarToggler.addEventListener("click", openMenu);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* =====================================================
     NAVBAR SCROLL EFFECT
  ===================================================== */

  const navbar = document.querySelector(".rs-navbar");

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)";
      navbar.style.background = "rgba(255,255,255,0.96)";
    } else {
      navbar.style.boxShadow = "none";
      navbar.style.background = "rgba(255,255,255,0.88)";
    }
  }

  window.addEventListener("scroll", handleNavbarScroll);

  /* =====================================================
     CONTACT FORM VALIDATION
  ===================================================== */

  const form = document.getElementById("contactForm");

  if (form) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");

    const nameRegex = /^[A-Za-z\s]{5,50}$/;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    function showError(input, errorElement, message) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");

      errorElement.textContent = message;
    }

    function showSuccess(input, errorElement) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");

      errorElement.textContent = "";
    }

    function validateName() {
      const value = nameInput.value.trim();

      if (value === "") {
        showError(nameInput, nameError, "Full name is required.");
        return false;
      }

      if (!nameRegex.test(value)) {
        showError(
          nameInput,
          nameError,
          "Name must have at least 5 characters and contain letters only.",
        );
        return false;
      }

      showSuccess(nameInput, nameError);
      return true;
    }

    function validateEmail() {
      const value = emailInput.value.trim();

      if (value === "") {
        showError(emailInput, emailError, "Email address is required.");
        return false;
      }

      if (!emailRegex.test(value)) {
        showError(
          emailInput,
          emailError,
          "Please enter a valid email address.",
        );
        return false;
      }

      showSuccess(emailInput, emailError);
      return true;
    }

    function validateMessage() {
      const value = messageInput.value.trim();

      if (value === "") {
        showError(messageInput, messageError, "Message cannot be empty.");
        return false;
      }

      if (value.length < 10) {
        showError(
          messageInput,
          messageError,
          "Message should be at least 10 characters.",
        );
        return false;
      }

      if (value.length > 1000) {
        showError(
          messageInput,
          messageError,
          "Message cannot exceed 1000 characters.",
        );
        return false;
      }

      showSuccess(messageInput, messageError);
      return true;
    }

    nameInput.addEventListener("input", validateName);
    emailInput.addEventListener("input", validateEmail);
    messageInput.addEventListener("input", validateMessage);

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (isNameValid && isEmailValid && isMessageValid) {
        const successModal = new bootstrap.Modal(
          document.getElementById("successModal"),
        );

        successModal.show();

        form.reset();

        document.querySelectorAll(".form-control").forEach((input) => {
          input.classList.remove("is-valid", "is-invalid");
        });
      }
    });
  }

  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  const revealElements = document.querySelectorAll(".reveal");

  function revealOnScroll() {
    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      const revealPoint = window.innerHeight - 120;

      if (elementTop < revealPoint) {
        element.classList.add("active-reveal");
      }
    });
  }

  revealOnScroll();

  window.addEventListener("scroll", revealOnScroll);

  /* =====================================================
     SCROLL TO TOP BUTTON
  ===================================================== */

  const scrollBtn = document.getElementById("scrollTopBtn");

  function toggleScrollButton() {
    if (window.scrollY > 500) {
      scrollBtn.classList.add("show-scroll-btn");
    } else {
      scrollBtn.classList.remove("show-scroll-btn");
    }
  }

  window.addEventListener("scroll", toggleScrollButton);

  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});
