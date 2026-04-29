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

/* Function to show "Read More" only if text overflows 4 lines */
function initReadMoreVisibility() {
  document.querySelectorAll('.project-info').forEach(info => {
    const p = info.querySelector('p');
    const btn = info.querySelector('.read-more-btn');
    if (p && btn) {
      // If scrollHeight is greater than clientHeight, the text is being clamped
      const isOverflowing = p.scrollHeight > p.clientHeight;
      btn.style.display = isOverflowing ? 'inline-block' : 'none';
    }
  });
}

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  initReadMoreVisibility();
});

window.addEventListener('resize', initReadMoreVisibility);

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



gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".case-block").forEach((block, i) => {
  gsap.fromTo(block,
    {
      opacity: 0,
      y: 60
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: block,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );
});

gsap.registerPlugin(ScrollTrigger);

// HERO TIMELINE (Apple cinematic intro)
const heroTL = gsap.timeline({
  scrollTrigger: {
    trigger: "#hero-scroll",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

// 1. Video cinematic zoom + dark feel
heroTL.to(".hero-video", {
  scale: 1.25,
  filter: "brightness(0.3)",
  ease: "none"
}, 0);

// 2. Text parallax (Apple style depth)
heroTL.to("#msg1", {
  y: -120,
  opacity: 0,
  scale: 0.95,
  ease: "power2.out"
}, 0);

// 3. Smooth fade overlay appears
heroTL.to(".fade-to-black-overlay", {
  opacity: 1,
  ease: "none"
}, 0.6);

/* cards */

gsap.registerPlugin(ScrollTrigger);

gsap.from(".project", {
  opacity: 0,
  y: 80,
  duration: 1,
  stagger: 0.15,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#projects",
    start: "top 80%"
  }
});
/*=======================
====  card  =============
========================*/
gsap.from(".skill-card", {
  opacity: 0,
  y: 60,
  duration: 1,
  stagger: 0.12,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#skills",
    start: "top 80%"
  }
});

/********************* */

document.querySelectorAll(".project").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (x - centerX) / -20;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.03)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  });
});

document.querySelectorAll('.read-more-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const description = btn.previousElementSibling;
    const isExpanded = description.classList.toggle('expanded');
    
    btn.textContent = isExpanded ? 'Read Less' : 'Read More';
    
    // Refresh ScrollTrigger because the page height changed
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300); // Wait for CSS transition to finish
  });
});

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
