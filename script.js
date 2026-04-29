// Scroll Reveal Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

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

// --- Apple-Style Scroll Video Logic ---
const scrollContainer = document.getElementById('hero-scroll');
const video = document.getElementById('v0');
const msg1 = document.getElementById('msg1');
const msg2 = document.getElementById('msg2');
const progressBar = document.querySelector('.scroll-progress-bar');
const fadeToBlackOverlay = document.querySelector('.fade-to-black-overlay');

// Variables for smoothing the video scrubbing
let currentVideoTime = 0; // This will be the smoothed time the video is currently at
const easingFactor = 0.15; // Increased for better responsiveness, controls how quickly the video catches up to the scroll

// Linear interpolation function for smoothing values
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

// Function to calculate the current scroll fraction of the video section
function getScrollFraction() {
  const containerRect = scrollContainer.getBoundingClientRect();
  const totalHeight = scrollContainer.offsetHeight - window.innerHeight;
  // Calculate how far we have scrolled into the section (0 when at top, totalHeight when at bottom)
  let relativeScroll = -containerRect.top;
  let scrollFraction = relativeScroll / totalHeight;
  // Clamp the fraction between 0 and 1
  return Math.max(0, Math.min(scrollFraction, 1));
}

function updateVideoFrame() {
  const scrollFraction = getScrollFraction();

  // Scrub video - apply smoothing
  // Ensure video metadata is loaded and duration is valid before attempting to scrub
  if (video.readyState >= 2 && video.duration && !isNaN(video.duration)) {
    const targetVideoTime = video.duration * scrollFraction; // Calculate the ideal video time based on scroll
    // Smoothly interpolate currentVideoTime towards the targetVideoTime based on scroll
    currentVideoTime = lerp(currentVideoTime, targetVideoTime, easingFactor);
    video.currentTime = currentVideoTime;

    // 6. Optional: Add subtle zoom-in effect on video while scrolling
    // Video scales from 1 to 1.1 (10% zoom) over the scroll duration
    video.style.transform = `scale(${1 + scrollFraction * 0.1})`;
  }

  // Update Progress Bar
  progressBar.style.width = `${scrollFraction * 100}%`;

  // Define scroll ranges for each section (Start, End)
  const ranges = [
    { el: msg1, start: 0.0, end: 0.45 },
    { el: msg2, start: 0.55, end: 1.0 }
  ];

  ranges.forEach((range) => {
    const { el, start, end } = range;
    if (scrollFraction >= start && scrollFraction <= end) {
      // Calculate internal fade
      const duration = end - start;
      const localProgress = (scrollFraction - start) / duration;
      
      // Fade in/out logic
      const opacity = localProgress < 0.2 ? localProgress * 5 : (localProgress > 0.8 ? (1 - localProgress) * 5 : 1);
      el.style.opacity = Math.max(0, Math.min(1, opacity));
      el.style.transform = `translate(-50%, calc(-50% - ${(localProgress - 0.5) * 80}px))`;
      el.style.pointerEvents = "auto";
    } else {
      el.style.opacity = 0;
      el.style.pointerEvents = "none";
    }
  });

  // Fade-to-black transition at the very end
  const fadeStart = 0.85;
  const fadeEnd = 0.95;
  if (scrollFraction > fadeStart) {
    const fadeProgress = Math.min(1, (scrollFraction - fadeStart) / (fadeEnd - fadeStart));
    fadeToBlackOverlay.style.opacity = fadeProgress;
  } else {
    fadeToBlackOverlay.style.opacity = 0;
  }
}

// Function to initialize video time based on current scroll position
function initializeVideoTime() {
  if (video.duration && !isNaN(video.duration)) {
    // console.log('Initializing video time...'); // Debugging
    const scrollFraction = getScrollFraction();
    currentVideoTime = video.duration * scrollFraction; // Set initial smoothed time
    video.currentTime = currentVideoTime; // Set video to initial frame
    updateVideoFrame(); // Call once to ensure initial state is correct
    // console.log(`Video initialized to ${currentVideoTime.toFixed(2)}s based on scroll fraction ${scrollFraction.toFixed(2)}`); // Debugging
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

window.addEventListener('scroll', () => {
  // Request animation frame for smooth syncing with browser paint
  requestAnimationFrame(updateVideoFrame);
});

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
