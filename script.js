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

// Variables for smoothing the video scrubbing
let currentVideoTime = 0; // This will be the smoothed time the video is currently at
const easingFactor = 0.1; // Controls how quickly the video catches up to the scroll (0.1 is a good starting point for smoothness)

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
    const targetVideoTime = video.duration * scrollFraction;
    // Smoothly interpolate currentVideoTime towards the targetVideoTime based on scroll
    currentVideoTime = lerp(currentVideoTime, targetVideoTime, easingFactor);
    video.currentTime = currentVideoTime;
  }

  // Update Progress Bar
  progressBar.style.width = `${scrollFraction * 100}%`;

  // Text Fade Logic
  // msg1 (Ahmed Rayen) starts visible, fades out as we scroll
  const msg1Opacity = scrollFraction < 0.2 ? 1 : Math.max(0, 1 - (scrollFraction - 0.2) * 5);
  msg1.style.opacity = msg1Opacity;
  // Apply a slight upward parallax effect as it fades
  msg1.style.transform = `translate(-50%, calc(-50% - ${scrollFraction * 100}px))`;
  // Disable pointer events when fading out to allow interaction with elements below
  msg1.style.pointerEvents = scrollFraction < 0.25 ? "auto" : "none";

  // msg2 (SaaS Developer) appears in the middle of the scroll range
  if (scrollFraction > 0.35 && scrollFraction < 0.85) {
    // Calculate opacity for fade-in and fade-out within its active range
    const fadeInProgress = (scrollFraction - 0.35) / (0.5 - 0.35); // Fade in from 0.35 to 0.5
    const fadeOutProgress = (scrollFraction - 0.7) / (0.85 - 0.7); // Fade out from 0.7 to 0.85
    let msg2Opacity = 1;
    if (scrollFraction < 0.5) { // During fade-in phase
      msg2Opacity = Math.min(1, fadeInProgress);
    } else if (scrollFraction > 0.7) { // During fade-out phase
      msg2Opacity = Math.max(0, 1 - fadeOutProgress);
    }
    msg2.style.opacity = msg2Opacity;
    // Apply a slight upward parallax effect
    msg2.style.transform = `translate(-50%, calc(-50% - ${(scrollFraction - 0.6) * 40}px))`;
  } else {
    msg2.style.opacity = 0;
    msg2.style.transform = `translate(-50%, calc(-50% + 40px))`; // Move slightly down when hidden
  }
}

// Function to initialize video time based on current scroll position
function initializeVideoTime() {
  if (video.duration && !isNaN(video.duration)) {
    const scrollFraction = getScrollFraction();
    currentVideoTime = video.duration * scrollFraction; // Set initial smoothed time
    video.currentTime = currentVideoTime; // Set video to initial frame
    updateVideoFrame(); // Call once to ensure initial state is correct
  }
}

// Ensure video is ready for scrubbing by listening to metadata and canplay events
video.addEventListener('loadedmetadata', initializeVideoTime);
video.addEventListener('canplay', initializeVideoTime);

// Initialize if metadata is already there (e.g., from cache or fast loading)
if (video.readyState >= 1) { // HAVE_METADATA or higher
  initializeVideoTime();
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
