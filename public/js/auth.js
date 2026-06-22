/**
 * ==========================================
 * AUTH SCRIPT
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  const nameInput = document.getElementById("name");

  const emailInput = document.getElementById("email");

  const passwordInput = document.getElementById("password");

  const confirmPasswordInput = document.getElementById("confirmPassword");

  const strengthText = document.getElementById("strengthText");

  const strengthFill = document.getElementById("strengthFill");

  /**
   * ==========================================
   * HELPERS
   * ==========================================
   */

  function clearErrors() {
    document.querySelectorAll(".form-error").forEach((error) => {
      error.textContent = "";
    });

    document.querySelectorAll(".form-input").forEach((input) => {
      input.classList.remove("input-error");

      input.classList.remove("input-success");
    });
  }

  function setError(fieldId, message) {
    const element = document.getElementById(fieldId);

    if (element) {
      element.textContent = message;
    }
  }

  /**
   * ==========================================
   * PASSWORD TOGGLE
   * ==========================================
   */

  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.previousElementSibling;

      const icon = button.querySelector("i");

      if (input.type === "password") {
        input.type = "text";

        icon.classList.add("bi-eye");

        icon.classList.remove("bi-eye-slash");
      } else {
        input.type = "password";

        icon.classList.add("bi-eye-slash");

        icon.classList.remove("bi-eye");
      }
    });
  });

  /**
   * ==========================================
   * PASSWORD RULES
   * ==========================================
   */

  function updateRule(ruleId, isValid) {
    const rule = document.getElementById(ruleId);

    if (!rule) return;

    const icon = rule.querySelector("i");

    if (isValid) {
      rule.classList.add("valid");

      icon.className = "bi bi-check-circle-fill";
    } else {
      rule.classList.remove("valid");

      icon.className = "bi bi-x-circle-fill";
    }
  }

  /**
   * ==========================================
   * PASSWORD STRENGTH
   * ==========================================
   */

  function updatePasswordStrength() {
    if (!passwordInput) return;

    const value = passwordInput.value;

    const lengthValid = value.length >= 8;

    const upperValid = /[A-Z]/.test(value);

    const lowerValid = /[a-z]/.test(value);

    const numberValid = /\d/.test(value);

    const specialValid = /[^A-Za-z0-9]/.test(value);

    updateRule("rule-length", lengthValid);

    updateRule("rule-upper", upperValid);

    updateRule("rule-lower", lowerValid);

    updateRule("rule-number", numberValid);

    updateRule("rule-special", specialValid);

    let score = 0;

    if (lengthValid) score++;
    if (upperValid) score++;
    if (lowerValid) score++;
    if (numberValid) score++;
    if (specialValid) score++;

    if (strengthFill && strengthText) {
      strengthFill.className = "password-strength-fill";

      if (score <= 2) {
        strengthFill.classList.add("strength-weak");

        strengthText.textContent = "Weak";
      } else if (score <= 4) {
        strengthFill.classList.add("strength-medium");

        strengthText.textContent = "Medium";
      } else {
        strengthFill.classList.add("strength-strong");

        strengthText.textContent = "Strong";
      }
    }

    const passwordError = document.getElementById("passwordError");

    if (!value) {
      passwordError.textContent = "Password is required.";

      passwordInput.classList.add("input-error");
    } else {
      passwordError.textContent = "";

      passwordInput.classList.remove("input-error");
    }
  }

  /**
   * ==========================================
   * CONFIRM PASSWORD
   * ==========================================
   */

  function validatePasswords() {
    if (!passwordInput || !confirmPasswordInput) return;

    const errorElement = document.getElementById("confirmPasswordError");

    if (confirmPasswordInput.value === "") {
      errorElement.textContent = "";

      return false;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
      errorElement.textContent = "Passwords do not match.";

      confirmPasswordInput.classList.add("input-error");

      return false;
    }

    errorElement.textContent = "";

    confirmPasswordInput.classList.remove("input-error");

    confirmPasswordInput.classList.add("input-success");

    return true;
  }

  /**
   * ==========================================
   * LIVE EVENTS
   * ==========================================
   */

  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      updatePasswordStrength();

      validatePasswords();
    });
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", validatePasswords);
  }

  /**
   * ==========================================
   * REGISTER FORM
   * ==========================================
   */

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      clearErrors();

      let isValid = true;

      /**
       * NAME
       */

      if (!nameInput.value.trim()) {
        setError("nameError", "Full name is required.");

        isValid = false;
      } else if (nameInput.value.trim().length < 3) {
        setError("nameError", "Name must be at least 3 characters.");

        isValid = false;
      }

      if (nameInput) {
        nameInput.addEventListener("input", () => {
          const value = nameInput.value.trim();

          const error = document.getElementById("nameError");

          if (!value) {
            error.textContent = "Full name is required.";

            nameInput.classList.add("input-error");

            return;
          }

          if (value.length < 3) {
            error.textContent = "Name must be at least 3 characters.";

            nameInput.classList.add("input-error");

            return;
          }

          error.textContent = "";

          nameInput.classList.remove("input-error");

          nameInput.classList.add("input-success");
        });
      }

      /**
       * EMAIL
       */

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailInput.value.trim()) {
        setError("emailError", "Email is required.");

        isValid = false;
      } else if (!emailRegex.test(emailInput.value)) {
        setError("emailError", "Please enter a valid email.");

        isValid = false;
      }

      if (emailInput) {
        emailInput.addEventListener("input", () => {
          const email = emailInput.value.trim();

          const error = document.getElementById("emailError");

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!email) {
            error.textContent = "Email is required.";

            emailInput.classList.add("input-error");

            return;
          }

          if (!emailRegex.test(email)) {
            error.textContent = "Please enter a valid email.";

            emailInput.classList.add("input-error");

            return;
          }

          error.textContent = "";

          emailInput.classList.remove("input-error");

          emailInput.classList.add("input-success");
        });
      }

      /**
       * PASSWORD
       */

      if (!passwordInput.value) {
        setError("passwordError", "Password is required.");

        isValid = false;
      }

      /**
       * CONFIRM PASSWORD
       */

      if (!validatePasswords()) {
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      try {
        const formData = new FormData(registerForm);

        const response = await fetch("/api/auth/register", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((error) => {
              const msg = error.toLowerCase();

              if (msg.includes("name")) {
                setError("nameError", error);
              }

              if (msg.includes("email")) {
                setError("emailError", error);
              }

              if (msg.includes("password")) {
                setError("passwordError", error);
              }
            });
          } else {
            showToast(data.message || "Registration failed.", "error");
          }

          return;
        }

        showToast(
          "Account created successfully. Please verify your email before logging in.",
          "success",
        );

        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 2500);
      } catch (error) {
        showToast("Something went wrong.", "error");
      }
    });
  }
});

/**

* ==========================================
* LOGIN FORM
* ==========================================
  */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  /**

* ==========================================
* HELPERS
* ==========================================
  */

  const emailInput = document.getElementById("email");

  const passwordInput = document.getElementById("password");

  function clearErrors() {
    setError("emailError", "");

    setError("passwordError", "");

    emailInput?.classList.remove("input-error");

    passwordInput?.classList.remove("input-error");
  }

  function setError(id, message) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = message;
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**

* ==========================================
* REAL-TIME VALIDATION
* ==========================================
  */

  emailInput?.addEventListener("input", () => {
    if (emailInput.value.trim()) {
      setError("emailError", "");

      emailInput.classList.remove("input-error");
    }
  });

  passwordInput?.addEventListener("input", () => {
    if (passwordInput.value) {
      setError("passwordError", "");

      passwordInput.classList.remove("input-error");
    }
  });

  /**

* ==========================================
* SUBMIT
* ==========================================
  */

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearErrors();

    const email = emailInput.value.trim();

    const password = passwordInput.value;

    let hasError = false;

    /**
     * EMAIL
     * ==========================================
     */

    if (!email) {
      setError("emailError", "Email is required.");

      emailInput.classList.add("input-error");

      hasError = true;
    } else if (!isValidEmail(email)) {
      setError("emailError", "Please enter a valid email address.");

      emailInput.classList.add("input-error");

      hasError = true;
    }

    /**
     * PASSWORD
     * ==========================================
     */

    if (!password) {
      setError("passwordError", "Password is required.");

      passwordInput.classList.add("input-error");

      hasError = true;
    }

    if (hasError) {
      return;
    }

    /**
     * API REQUEST
     * ==========================================
     */

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      /**
       * LOGIN FAILED
       * ==========================================
       */

      if (!response.ok) {
        showToast(data.message || "Login failed.", "error");

        return;
      }

      /**
       * LOGIN SUCCESS
       * ==========================================
       */

      showToast("Login successful. Redirecting...", "success");

      setTimeout(() => {
        if (data.user.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (data.user.role === "staff") {
          window.location.href = "/staff/dashboard";
        } else {
          window.location.href = "/resident/dashboard";
        }
      }, 1500);
    } catch (error) {
      showToast("Something went wrong. Please try again.", "error");
    }
  });
}

// FORGOT PASSWORD

function initForgotPasswordForm() {
  const form = document.getElementById("forgotPasswordForm");

  if (!form) return;

  const emailInput = document.getElementById("email");

  const emailError = document.getElementById("emailError");

  form.addEventListener("submit", async (e) => {
    console.log("FORGOT PASSWORD CLICKED");

    e.preventDefault();

    emailError.textContent = "";

    const email = emailInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      emailError.textContent = "Please enter a valid email.";

      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message, "error");

        return;
      }

      showToast("Password reset link sent. Check your email.", "success");
    } catch {
      showToast("Something went wrong.", "error");
    }
  });
}

// RESET PASSWORD

function initResetPasswordForm() {
  const form = document.getElementById("resetPasswordForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = document.getElementById("token").value;

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    const error = document.getElementById("confirmPasswordError");

    error.textContent = "";

    if (password !== confirmPassword) {
      error.textContent = "Passwords do not match.";

      return;
    }

    try {
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message, "error");

        return;
      }

      showToast("Password changed successfully.", "success");

      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2500);
    } catch {
      showToast("Something went wrong.", "error");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initForgotPasswordForm();

  initResetPasswordForm();
});
