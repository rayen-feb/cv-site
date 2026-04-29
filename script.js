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

let lastScrollTop = 0;

function updateVideoFrame() {
  const containerRect = scrollContainer.getBoundingClientRect();
  const containerHeight = scrollContainer.scrollHeight - window.innerHeight;
  
  // How far we have scrolled into the section (0 when at top)
  const relativeScroll = -containerRect.top;
  
  // Calculate scroll fraction (0 to 1)
  let fraction = relativeScroll / containerHeight;
  fraction = Math.max(0, Math.min(fraction, 1));

  // Scrub video
  if (video.duration) {
    video.currentTime = video.duration * fraction;
  }

  // Update Progress Bar
  progressBar.style.width = `${fraction * 100}%`;

  // Text Fade Logic
  // msg1 fades out between 0.1 and 0.3
  msg1.style.opacity = fraction < 0.3 ? 1 - (fraction * 4) : 0;
  msg1.style.transform = `translateY(${fraction * -100}px)`;
  msg1.style.pointerEvents = fraction < 0.25 ? "auto" : "none";

  // msg2 fades in/out based on specific scroll points
  if (fraction > 0.4 && fraction < 0.75) {
    const subFraction = (fraction - 0.4) / 0.35;
    msg2.style.opacity = subFraction < 0.8 ? 1 : 1 - (subFraction - 0.8) * 5;
    msg2.style.transform = `translateY(0)`;
  } else {
    msg2.style.opacity = 0;
    msg2.style.transform = `translateY(20px)`;
  }
}

// Ensure video is ready for scrubbing
video.addEventListener('loadedmetadata', () => {
  // Briefly "play" and "pause" to initialize the video stream for seeking
  video.play().then(() => {
    video.pause();
    updateVideoFrame();
  });
});

// Initialize if metadata is already there
if (video.readyState >= 1) {
    updateVideoFrame();
}

window.addEventListener('scroll', () => {
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
