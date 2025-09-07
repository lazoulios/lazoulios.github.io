
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

// ---- Active nav link based on scroll (header-aware) ----
const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));

// Map id -> link
const linkById = {};
navLinks.forEach(a => {
  const id = (a.getAttribute('href') || '').replace('#', '');
  if (id) linkById[id] = a;
});

function setActive(id) {
  navLinks.forEach(a => a.classList.toggle('active', a === linkById[id]));
}

function updateActiveByScroll() {
  const header = document.querySelector('header');
  const headerH = header ? header.offsetHeight : 0;

  // the line we care about is just below the sticky header
  const lineY = window.scrollY + headerH + 1;

  // find the section whose vertical range contains lineY
  let currentId = null;
  for (const sec of sections) {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (lineY >= top && lineY < bottom) {
      currentId = sec.id;
      break;
    }
  }

  // Clear highlight if above first section
  if (!currentId && sections.length && lineY < sections[0].offsetTop) {
    setActive(null);
    return;
  }

  if (currentId) setActive(currentId);
}

// Run on load, scroll, and resize (layout can change on mobile)
window.addEventListener('load', updateActiveByScroll);
window.addEventListener('scroll', updateActiveByScroll, { passive: true });
window.addEventListener('resize', updateActiveByScroll);

// Avoid “stuck focus” look after tapping a nav link on mobile
navLinks.forEach(a => {
  a.addEventListener('click', () => setTimeout(() => a.blur(), 150));
});

