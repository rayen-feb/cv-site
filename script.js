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
const progressBar = document.querySelector('.scroll-progress-bar');
const fadeToBlackOverlay = document.querySelector('.fade-to-black-overlay');

// --- Optimization State ---
let targetFraction = 0;    // Where the scroll is actually at
let currentFraction = 0;   // Where the animation currently is (smoothed)
let currentVideoTime = 0; 
const easingFactor = 0.08; // Lower = smoother/heavier feel (Apple-like)

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
  // 1. Update target based on current scroll position
  targetFraction = getScrollFraction();
  
  // 2. Interpolate current position toward target for smoothing
  // This allows the video to "glide" into place even after scrolling stops
  currentFraction = lerp(currentFraction, targetFraction, easingFactor);

  // 3. Scrub Video
  if (video.readyState >= 2 && video.duration && !isNaN(video.duration)) {
    const targetVideoTime = video.duration * currentFraction;
    
    // Only update currentTime if change is significant to reduce CPU/GPU churn
    // Most monitors refresh at 60Hz, so we don't need micro-second precision
    currentVideoTime = lerp(currentVideoTime, targetVideoTime, easingFactor);
    video.currentTime = currentVideoTime;

    // Subtle parallax zoom effect
    video.style.transform = `scale(${1 + currentFraction * 0.1})`;
  }

  // Update Progress Bar
  progressBar.style.width = `${currentFraction * 100}%`;

  // Define scroll ranges for each section (Start, End)
  // Values are normalized (0.0 to 1.0)
  const ranges = [
    { el: msg1, start: 0.0, end: 0.8 }
  ];

  ranges.forEach((range) => {
    const { el, start, end } = range;
    if (currentFraction >= start && currentFraction <= end) {
      // Calculate internal fade
      const duration = end - start;
      const localProgress = (currentFraction - start) / duration;
      
      // Fade in/out logic
      const opacity = localProgress < 0.2 ? localProgress * 5 : (localProgress > 0.8 ? (1 - localProgress) * 5 : 1);
      el.style.opacity = Math.max(0, Math.min(1, opacity));
      
      // Smoother Parallax: subtle vertical movement linked to smoothed progress
      el.style.transform = `translate(-50%, calc(-50% - ${(localProgress - 0.5) * 100}px))`;
      el.style.pointerEvents = "auto";
    } else {
      el.style.opacity = 0;
      el.style.pointerEvents = "none";
    }
  });

  // Fade-to-black transition at the very end
  const fadeStart = 0.85;
  const fadeEnd = 0.95;
  if (currentFraction > fadeStart) {
    const fadeProgress = Math.min(1, (currentFraction - fadeStart) / (fadeEnd - fadeStart));
    fadeToBlackOverlay.style.opacity = fadeProgress;
  } else {
    fadeToBlackOverlay.style.opacity = 0;
  }

  // Keep the animation loop running
  requestAnimationFrame(updateVideoFrame);
}

// Function to initialize video time based on current scroll position
function initializeVideoTime() {
  if (video.duration && !isNaN(video.duration)) {
    targetFraction = getScrollFraction();
    currentFraction = targetFraction; 
    currentVideoTime = video.duration * currentFraction;
    video.currentTime = currentVideoTime; // Set video to initial frame
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

// Start the continuous render loop
requestAnimationFrame(updateVideoFrame);

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
