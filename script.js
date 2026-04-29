// Scroll Reveal Animation
const observerOptions = {
  threshold: 0.05,
  rootMargin: '0px 0px -20px 0px'
};

// --- GSAP and ScrollTrigger Imports ---
gsap.registerPlugin(ScrollTrigger);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Add a slight stagger effect based on order
      setTimeout(() => {
        entry.target.classList.add('active');
      }, index * 100);
    }
  });
}, observerOptions);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Refresh ScrollTrigger on load to ensure mobile calculations are accurate
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

// --- Apple-Style Scroll Video Logic ---
const scrollContainer = document.getElementById('hero-scroll');
const video = document.getElementById('v0');
const msg1 = document.getElementById('msg1');
const msg2 = document.getElementById('msg2');
const msg3 = document.getElementById('msg3'); // Added missing declaration
const progressBar = document.querySelector('.scroll-progress-bar');
const fadeToBlackOverlay = document.querySelector('.fade-to-black-overlay');

// --- Optimization State ---
let targetFraction = 0;    // Where the scroll is actually at
let currentFraction = 0;   // Where the animation currently is (smoothed)
let currentVideoTime = 0; 
const easingFactor = 0.08; // Lower = smoother/heavier feel (Apple-like). Adjust for responsiveness.

// Linear interpolation function for smoothing values
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

// Function to initialize video time based on current scroll position
function initializeVideoTime() {
  if (video.duration && !isNaN(video.duration)) {
    // Sync video with current scroll position immediately on load
    const initialProgress = ScrollTrigger.getById("heroScroll")?.progress || 0;
    video.currentTime = video.duration * initialProgress;
    currentVideoTime = video.currentTime;
  }
}

// Ensure video is ready for scrubbing by listening to metadata and canplay events
// Use 'canplaythrough' for maximum readiness before scrubbing starts, as 'canplay' might not be enough for smooth seeking
video.addEventListener('loadedmetadata', initializeVideoTime); // When duration is known
video.addEventListener('canplay', initializeVideoTime); // When enough data to play from current position
video.addEventListener('canplaythrough', initializeVideoTime); // When browser estimates it can play to the end without interruption

// Initialize if metadata is already there (e.g., from cache or fast loading)
if (video.readyState >= 1) { // HAVE_METADATA or higher
  initializeVideoTime(); // Attempt immediate initialization if video is already somewhat ready
}

// --- GSAP ScrollTrigger Setup ---
const tl = gsap.timeline({
  scrollTrigger: {
    id: "heroScroll",
    trigger: scrollContainer, // The element that triggers the scroll animation
    start: "top top",         // When the top of the trigger hits the top of the viewport
    end: "+=300%",            // Pin for 300% of the viewport height (adjust this value to control scroll duration)
    scrub: true,              // Smoothly links the animation progress to the scroll position
    pin: true,                // Pins the trigger element for the duration of the scroll
    anticipatePin: 1,         // Helps prevent a jump when pinning starts
    onUpdate: (self) => {
      // Update the progress bar based on ScrollTrigger's progress
      progressBar.style.width = `${self.progress * 100}%`;

      // Smoothly update video currentTime
      if (video.readyState >= 2 && video.duration && !isNaN(video.duration)) {
        const targetVideoTime = video.duration * self.progress;
        currentVideoTime = lerp(currentVideoTime, targetVideoTime, easingFactor);
        video.currentTime = currentVideoTime;
      }
    }
  }
});

// --- Video Animations ---
// Subtle parallax zoom effect on the video
tl.to(video, {
  scale: 1.1, // Zooms in by 10%
  ease: "none" // Linear zoom
}, 0); // Starts at the beginning of the timeline

// --- Text Animations ---
// Message 1: "Ahmed Rayen" (and "View Work" button) - fades out and moves up
tl.to(msg1, {
  opacity: 0,
  yPercent: -50, // Moves up by 50% of its own height
  ease: "power1.out",
  pointerEvents: "none"
}, 0.2); // Fades out between 20% and 30% of the scroll timeline

// Message 2: "Data Science Engineer" - fades in, stays, then fades out
tl.fromTo(msg2, {
  opacity: 0,
  yPercent: 20 // Starts slightly below center
}, {
  opacity: 1,
  yPercent: 0, // Moves to center
  ease: "power1.out",
  pointerEvents: "auto"
}, 0.3); // Appears at 30% of the scroll timeline

tl.to(msg2, {
  opacity: 0,
  yPercent: -20, // Moves up as it fades out
  ease: "power1.out",
  pointerEvents: "none"
}, 0.5); // Fades out at 50% of the scroll timeline

// Message 3: "SaaS Developer" - fades in, stays, then fades out
tl.fromTo(msg3, {
  opacity: 0,
  yPercent: 20
}, {
  opacity: 1,
  yPercent: 0,
  ease: "power1.out",
  pointerEvents: "auto"
}, 0.6); // Appears at 60% of the scroll timeline

tl.to(msg3, {
  opacity: 0,
  yPercent: -20,
  ease: "power1.out",
  pointerEvents: "none"
}, 0.8); // Fades out at 80% of the scroll timeline

// --- Fade-to-Black Transition ---
// Starts fading in around 85% of the scroll section, fully black at 95%
tl.to(fadeToBlackOverlay, {
  opacity: 1,
  ease: "none"
}, 0.9); // Starts fading to black at 90% of the scroll timeline

// Dark Mode Toggle
const themeToggleButton = document.getElementById('theme-toggle'); // Assuming a button with this ID
const htmlElement = document.documentElement; // Target the html element for data-theme

function setPreferredTheme(theme) {
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function toggleDarkMode() {
  const currentTheme = htmlElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    setPreferredTheme('light');
  } else {
    setPreferredTheme('dark');
  }
}

// Apply theme on initial load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setPreferredTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  // Check for system preference if no saved theme
  setPreferredTheme('dark');
} else {
  setPreferredTheme('light'); // Default to light if no preference
}

// Add event listener for the toggle button if it exists
if (themeToggleButton) {
  themeToggleButton.addEventListener('click', toggleDarkMode);
}

// Modal Functions
function openModal(videoFile) {
  const modal = document.getElementById("modal");
  const video = document.getElementById("modalVideo");

  video.src = "videos/" + videoFile;
  modal.classList.add('active'); // Use class for transition
  // Optional: Play video automatically when modal opens
  video.play();

  // Add event listener for ESC key to close modal
  document.addEventListener('keydown', handleEscapeKey);
}

function closeModal() {
  const modal = document.getElementById("modal");
  const video = document.getElementById("modalVideo");

  modal.classList.remove('active'); // Use class for transition
  video.pause();
  video.currentTime = 0; // Reset video to start

  // Remove event listener for ESC key
  document.removeEventListener('keydown', handleEscapeKey);
}

// Handle ESC key press for modal
function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

// Close modal when clicking outside the video content
document.addEventListener('click', (event) => {
  const modal = document.getElementById("modal");
  const modalContent = document.querySelector(".modal-content");
  if (modal.classList.contains('active') && !modalContent.contains(event.target) && event.target !== modalContent) {
    closeModal();
  }
});
