gsap.registerPlugin(ScrollTrigger);

/* =========================
   1. REVEAL ANIMATION
========================= */

const observerOptions = {
  threshold: 0.05,
  rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('active');
      }, index * 100);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});


/* =========================
   2. HERO SCROLL SYSTEM
========================= */

const scrollContainer = document.getElementById('hero-scroll');
const video = document.getElementById('v0');

const msg1 = document.getElementById('msg1');
const msg2 = document.getElementById('msg2');
const msg3 = document.getElementById('msg3');

const progressBar = document.querySelector('.scroll-progress-bar');
const fadeOverlay = document.querySelector('.fade-to-black-overlay');

let currentTime = 0;
const lerp = (a, b, n) => a + (b - a) * n;

video.addEventListener('loadedmetadata', () => {

  gsap.timeline({
    scrollTrigger: {
      id: "heroScroll",
      trigger: scrollContainer,
      start: "top top",
      end: "+=300%",
      scrub: true,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {

        /* Progress bar */
        progressBar.style.width = `${self.progress * 100}%`;

        /* Smooth video scrubbing */
        if (video.duration) {
          const target = video.duration * self.progress;
          currentTime = lerp(currentTime, target, 0.08);
          video.currentTime = currentTime;
        }
      }
    }
  })

  /* Video zoom (Apple feel) */
  .to(video, {
    scale: 1.1,
    ease: "none"
  }, 0)

  /* HERO TEXT */
  .to(msg1, {
    opacity: 0,
    y: -80,
    pointerEvents: "none"
  }, 0.2)

  .fromTo(msg2,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0 }
  , 0.35)

  .to(msg2, {
    opacity: 0,
    y: -40,
    pointerEvents: "none"
  }, 0.55)

  .fromTo(msg3,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0 }
  , 0.6)

  .to(msg3, {
    opacity: 0,
    y: -40,
    pointerEvents: "none"
  }, 0.8)

  /* Fade to black */
  .to(fadeOverlay, {
    opacity: 1
  }, 0.9);

});


/* =========================
   3. DARK MODE
========================= */

const themeToggleButton = document.getElementById('theme-toggle');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

themeToggleButton?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

setTheme(
  localStorage.getItem('theme') ||
  (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
);


/* =========================
   4. MODAL SYSTEM
========================= */

function openModal(videoFile) {
  const modal = document.getElementById("modal");
  const videoEl = document.getElementById("modalVideo");

  videoEl.src = "videos/" + videoFile;
  modal.classList.add("active");
  videoEl.play();

  document.addEventListener("keydown", escHandler);
}

function closeModal() {
  const modal = document.getElementById("modal");
  const videoEl = document.getElementById("modalVideo");

  modal.classList.remove("active");
  videoEl.pause();
  videoEl.currentTime = 0;

  document.removeEventListener("keydown", escHandler);
}

function escHandler(e) {
  if (e.key === "Escape") closeModal();
}

document.addEventListener("click", (e) => {
  const modal = document.getElementById("modal");
  const content = document.querySelector(".modal-content");

  if (
    modal.classList.contains("active") &&
    !content.contains(e.target)
  ) {
    closeModal();
  }
});