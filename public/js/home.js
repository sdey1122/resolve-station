"use strict";

// DOM CONTENT LOADED
document.addEventListener("DOMContentLoaded", () => {
  initializeMobileMenu();
  initializeNavbarScroll();
  initializeCounterAnimation();
  initializeScrollReveal();
  initializeServiceCards();
  initializeBackToTop();
});

function initializeMobileMenu() {
  const menu = document.getElementById("mainNavbar");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const toggler = document.querySelector(".navbar-toggler");
  const hamIcon = document.querySelector(".ham-icon");
  const closeBtn = document.querySelector(".mobile-close-btn");

  if (!menu || !overlay || !toggler) return;

  const bsCollapse = bootstrap.Collapse.getOrCreateInstance(menu, {
    toggle: false,
  });

  // Open Menu
  toggler.addEventListener("click", () => {
    bsCollapse.show();
  });

  // Close Menu (X Button)
  closeBtn?.addEventListener("click", () => {
    bsCollapse.hide();
  });

  // Close Menu (Overlay)
  overlay.addEventListener("click", () => {
    bsCollapse.hide();
  });

  // Close Menu (Nav Links)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 767) {
        bsCollapse.hide();
      }
    });
  });

  // Menu Opened
  menu.addEventListener("shown.bs.collapse", () => {
    overlay.classList.add("show");

    if (hamIcon) {
      hamIcon.classList.add("hidden");
    }

    document.body.classList.add("body-lock");
  });

  // Menu Closed
  menu.addEventListener("hidden.bs.collapse", () => {
    overlay.classList.remove("show");

    if (hamIcon) {
      hamIcon.classList.remove("hidden");
    }

    document.body.classList.remove("body-lock");
  });
}

// NAVBAR SCROLL EFFECT
function initializeNavbarScroll() {
  const navbar = document.querySelector(".rs-navbar");

  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(255,255,255,0.96)";
      navbar.style.boxShadow = "0 10px 30px rgba(15,23,42,0.08)";
    } else {
      navbar.style.background = "rgba(255,255,255,0.88)";
      navbar.style.boxShadow = "none";
    }
  };

  window.addEventListener("scroll", handleScroll);

  handleScroll();
}

// COUNTER ANIMATION
function initializeCounterAnimation() {
  const counters = document.querySelectorAll(".counter");

  if (!counters.length) return;

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target);

    let current = 0;

    const increment = Math.ceil(target / 420);

    const update = () => {
      current += increment;

      if (current >= target) {
        counter.textContent = target.toLocaleString() + "+";
        return;
      }

      counter.textContent = current.toLocaleString() + "+";

      requestAnimationFrame(update);
    };

    update();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const counter = entry.target;

        if (entry.isIntersecting) {
          counter.textContent = "0";
          animateCounter(counter);
        }
      });
    },
    {
      threshold: 0.5,
    },
  );

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

// SCROLL REVEAL ANIMATION
function initializeScrollReveal() {
  const elements = document.querySelectorAll(
    `
    .hero-badge,
    .hero-title,
    .hero-description,
    .hero-buttons,
    .hero-mini-stats,
    .trusted-title,
    .logo-item,
    .stat-card,
    .service-card,
    .section-header
  `,
  );

  if (!elements.length) return;

  elements.forEach((element) => {
    element.classList.add("reveal");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active-reveal");
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}

// SERVICE AND EFFECT
function initializeServiceCards() {
  const cards = document.querySelectorAll(".service-card");

  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.boxShadow = "0 30px 60px rgba(15,23,42,0.18)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.boxShadow = "none";
    });
  });
}

// BACK TO TOP
function initializeBackToTop() {
  const button = document.getElementById("scrollTopBtn");

  if (!button) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      button.classList.add("show-scroll-btn");
    } else {
      button.classList.remove("show-scroll-btn");
    }
  });

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
