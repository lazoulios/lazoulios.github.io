
// Theme toggle
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
  // Apply saved theme if exists; else follow system
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const defaultTheme = savedTheme || (prefersDark ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", defaultTheme);
  themeToggle.setAttribute(
    "aria-label",
    defaultTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
  );

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeToggle.setAttribute(
      "aria-label",
      next === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  });
}

// --- Keep anchor jumps below the sticky header ---
function setScrollPaddingTop() {
  const header = document.querySelector('header');
  if (!header) return;
  const h = header.offsetHeight;
  document.documentElement.style.setProperty('--header-h', `${h}px`);
}

// Run on load, after fonts, and on resize (header can wrap on mobile)
window.addEventListener('load', setScrollPaddingTop);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(setScrollPaddingTop);
}
window.addEventListener('resize', setScrollPaddingTop);

// --- Highlight active nav link based on scroll ---
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

// Map href="#id" → link
const linkMap = {};
navLinks.forEach(link => {
  const id = link.getAttribute("href").replace("#", "");
  linkMap[id] = link;
});

// Clear all active classes
function clearActive() {
  navLinks.forEach(link => link.classList.remove("active"));
}

const observer = new IntersectionObserver(
  entries => {
    let mostVisible = null;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!mostVisible || entry.intersectionRatio > mostVisible.intersectionRatio) {
          mostVisible = entry;
        }
      }
    });
    if (mostVisible) {
      clearActive();
      const id = mostVisible.target.id;
      if (linkMap[id]) linkMap[id].classList.add("active");
    }
  },
  {
    threshold: [0.25, 0.5, 0.75],
    rootMargin: "-40% 0px -40% 0px" // “middle band” of the screen
  }
);

// Start observing each section
sections.forEach(section => observer.observe(section));

// Remove focus outline sticking after tapping a nav link
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    setTimeout(() => link.blur(), 200);
  });
});


