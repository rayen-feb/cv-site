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

  // Text Fade Logic
  // msg1 (Ahmed Rayen) starts visible, fades out as we scroll
  const msg1Opacity = scrollFraction < 0.2 ? 1 : Math.max(0, 1 - (scrollFraction - 0.2) * 5);
  // Apply a more noticeable upward parallax effect as it fades
  msg1.style.opacity = msg1Opacity;
  msg1.style.transform = `translate(-50%, calc(-50% - ${scrollFraction * 150}px))`; // Increased parallax
  // Disable pointer events when fading out to allow interaction with elements below
  msg1.style.pointerEvents = scrollFraction < 0.25 ? "auto" : "none";

  // msg2 (SaaS Developer) appears in the middle of the scroll range
  // Active between 0.4 and 0.9 scroll fraction
  const msg2ActiveStart = 0.4;
  const msg2ActiveEnd = 0.9;
  if (scrollFraction > msg2ActiveStart && scrollFraction < msg2ActiveEnd) {
    // Fade in from msg2ActiveStart to msg2ActiveStart + 0.15
    const fadeInDuration = 0.15;
    const fadeInProgress = Math.min(1, (scrollFraction - msg2ActiveStart) / fadeInDuration);
    // Fade out from msg2ActiveEnd - 0.15 to msg2ActiveEnd
    const fadeOutDuration = 0.15;
    const fadeOutProgress = Math.min(1, (msg2ActiveEnd - scrollFraction) / fadeOutDuration);

    msg2.style.opacity = Math.min(fadeInProgress, fadeOutProgress);
    // Apply a subtle upward parallax effect
    msg2.style.transform = `translate(-50%, calc(-50% - ${(scrollFraction - msg2ActiveStart) * 80}px))`; // Increased parallax
  } else {
    msg2.style.opacity = 0;
    msg2.style.transform = `translate(-50%, calc(-50% + 80px))`; // Move slightly down when hidden
  }

  // 6. Optional: Fade-to-black transition at end of hero section
  // Starts fading in around 70% of the scroll section, fully black at 95%
  const fadeStart = 0.7;
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
