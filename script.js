/* ============================================================
   ASHAR KHAN — PORTFOLIO
   script.js
============================================================ */
"use strict";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------------------------------------------------------
   Loader
--------------------------------------------------------- */
const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  setTimeout(() => loader?.classList.add("is-hidden"), 500);
});

/* ---------------------------------------------------------
   Header state + scroll progress (single rAF-driven scroll handler)
--------------------------------------------------------- */
const header = document.querySelector("header");
const progressBar = document.getElementById("progress-bar");
const backToTop = document.getElementById("backToTop");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav__link");

let ticking = false;

function onScroll() {
  const scrollY = window.scrollY;

  header?.classList.toggle("is-scrolled", scrollY > 40);
  backToTop?.classList.toggle("is-visible", scrollY > 600);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = progress + "%";

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });

onScroll();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

/* ---------------------------------------------------------
   Mobile navigation
--------------------------------------------------------- */
const navToggle = document.querySelector(".nav__toggle");
const navMenu = document.querySelector(".nav__links");

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu?.classList.contains("is-open")) {
    navMenu.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
});

document.addEventListener("click", (e) => {
  if (!navMenu?.classList.contains("is-open")) return;
  if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
  navMenu.classList.remove("is-open");
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
});

/* ---------------------------------------------------------
   Active nav link tracking
--------------------------------------------------------- */
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute("id");
    navLinks.forEach(link => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  });
}, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

sections.forEach(section => navObserver.observe(section));

/* ---------------------------------------------------------
   Cursor glow (desktop only)
--------------------------------------------------------- */
const glow = document.getElementById("cursor-glow");

if (glow && canHover && !reduceMotion) {
  window.addEventListener("pointermove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
    glow.classList.add("is-active");
  }, { passive: true });

  document.addEventListener("pointerleave", () => glow.classList.remove("is-active"));
}

/* ---------------------------------------------------------
   Typing effect
--------------------------------------------------------- */
const typingEl = document.querySelector(".typing");
const roles = [
  "Software Engineer",
  "Network Engineer",
  "Problem Solver",
  "Cloud Computing Enthusiast"
];

function typeLoop() {
  if (!typingEl) return;

  if (reduceMotion) {
    typingEl.textContent = roles[0];
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function step() {
    const word = roles[wordIndex];

    if (!deleting) {
      charIndex++;
      typingEl.textContent = word.substring(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(step, 1700);
        return;
      }
    } else {
      charIndex--;
      typingEl.textContent = word.substring(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % roles.length;
      }
    }
    setTimeout(step, deleting ? 45 : 95);
  }

  step();
}

typeLoop();

/* ---------------------------------------------------------
   Hero topology canvas
--------------------------------------------------------- */
(function heroNetwork() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const wrap = canvas.parentElement;
  let nodes = [];
  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function buildNodes() {
    const count = w < 400 ? 9 : 14;
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r: Math.random() * 1.4 + 1,
      steel: Math.random() > 0.7
    }));
  }

  function resize() {
    w = wrap.clientWidth;
    h = wrap.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildNodes();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const max = w < 400 ? 130 : 170;
        if (dist < max) {
          ctx.strokeStyle = `rgba(201,168,108,${(1 - dist / max) * 0.22})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.fillStyle = n.steel ? "rgba(113,150,192,.65)" : "rgba(201,168,108,.65)";
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function step() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });
    draw();
    if (!reduceMotion) requestAnimationFrame(step);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  resize();
  if (reduceMotion) {
    draw();
  } else {
    requestAnimationFrame(step);
  }
})();

/* ---------------------------------------------------------
   Reveal on scroll (with stagger inside grids)
--------------------------------------------------------- */
const revealGroups = document.querySelectorAll(
  ".skill-grid, .project-grid, .cert-grid, .ps-grid, .learning-grid, .stat-grid"
);

revealGroups.forEach(group => {
  Array.from(group.children).forEach((child, i) => {
    child.classList.add("reveal");
    child.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
  });
});

document.querySelectorAll(".timeline-item, .about__media, .section-head").forEach(el => {
  el.classList.add("reveal");
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---------------------------------------------------------
   Spotlight hover (.project, .skill)
--------------------------------------------------------- */
if (canHover) {
  document.querySelectorAll(".project, .skill").forEach(card => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--y", `${e.clientY - rect.top}px`);
    });
  });
}

/* ---------------------------------------------------------
   Counters
--------------------------------------------------------- */
function formatCounterValue(value, target) {
  return target % 1 !== 0 ? value.toFixed(2) : Math.floor(value).toString();
}

function animateCounter(el) {
  const target = Number(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  if (reduceMotion) {
    el.textContent = formatCounterValue(target, target) + suffix;
    return;
  }

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = formatCounterValue(current, target) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".counter").forEach(el => counterObserver.observe(el));

/* ---------------------------------------------------------
   Image fallback (graceful placeholders if an asset is missing)
--------------------------------------------------------- */
document.querySelectorAll(".frame-img").forEach(img => {
  img.addEventListener("error", () => {
    img.style.display = "none";
  }, { once: true });
});

/* ---------------------------------------------------------
   Project modal
--------------------------------------------------------- */
const modal = document.getElementById("projectModal");
const modalTitle = modal?.querySelector(".modal__title");
const modalDesc = modal?.querySelector(".modal__desc");
const modalTags = modal?.querySelector(".modal__tags");
const modalImg = modal?.querySelector(".frame-img");
const modalFallback = modal?.querySelector(".frame-fallback");
const modalClose = modal?.querySelector(".modal__close");

let lastFocused = null;

function openModal(trigger) {
  if (!modal) return;

  modalTitle.textContent = trigger.dataset.title || "";
  modalDesc.textContent = trigger.dataset.desc || "";
  modalFallback.textContent = trigger.dataset.fallback || "";

  modalTags.innerHTML = "";
  (trigger.dataset.tags || "").split(",").forEach(tag => {
    if (!tag.trim()) return;
    const span = document.createElement("span");
    span.textContent = tag.trim();
    modalTags.appendChild(span);
  });

  const imgSrc = trigger.dataset.image || "";
  if (imgSrc) {
    modalImg.style.display = "";
    modalImg.src = imgSrc;
    modalFallback.style.display = "none";
  } else {
    modalImg.style.display = "none";
    modalImg.src = "";
    modalFallback.style.display = "";
  }

  lastFocused = document.activeElement;
  modal.classList.add("is-active");
  document.body.style.overflow = "hidden";
  modalClose?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-active");
  document.body.style.overflow = "";
  lastFocused?.focus();
}

document.querySelectorAll(".project__trigger").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn));
});

modalClose?.addEventListener("click", closeModal);

modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal?.classList.contains("is-active")) closeModal();
});

/* ---------------------------------------------------------
   Toast
--------------------------------------------------------- */
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3600);
}

/* ---------------------------------------------------------
   Contact form — opens a pre-filled email instead of a fake "sent"
--------------------------------------------------------- */
const contactForm = document.getElementById("contactForm");

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name) return showToast("Please enter your name.");
  if (!email || !emailRegex.test(email)) return showToast("Please enter a valid email.");
  if (!subject) return showToast("Please enter a subject.");
  if (message.length < 10) return showToast("Message should be at least 10 characters.");

  const body = `${message}\n\n— ${name} (${email})`;
  const mailto = `mailto:ashar.codes@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
  showToast("Opening your email app to send this…");
  contactForm.reset();
});

/* ---------------------------------------------------------
   Footer year
--------------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();