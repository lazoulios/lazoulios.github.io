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

// Fax button joke
document.addEventListener("DOMContentLoaded", function () {
  var faxBtn = document.getElementById("fax-btn");
  var faxBubble = document.getElementById("fax-bubble");
  var hideTimeout;
  if (faxBtn && faxBubble) {
    faxBtn.addEventListener("click", function (e) {
      e.preventDefault();
      faxBubble.style.display = "block";
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(function () {
        faxBubble.style.display = "none";
      }, 1600);
    });
    document.addEventListener("click", function (e) {
      if (
        faxBubble.style.display === "block" &&
        !faxBtn.contains(e.target)
      ) {
        faxBubble.style.display = "none";
        clearTimeout(hideTimeout);
      }
    });
  }
});

// Mobile side menu behavior
document.addEventListener('DOMContentLoaded', function () {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileClose = document.getElementById('mobile-nav-close');

  function openMobileNav() {
    if (!mobileNav || !mobileBackdrop) return;
    mobileNav.classList.add('open');
    mobileBackdrop.classList.add('open');
    mobileBackdrop.hidden = false;
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNav || !mobileBackdrop) return;
    mobileNav.classList.remove('open');
    mobileBackdrop.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { mobileBackdrop.hidden = true; }, 260);
  }

  if (mobileBtn) mobileBtn.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileNav);

  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  // close when a link is clicked (navigate)
  const links = document.querySelectorAll('#mobile-nav a');
  links.forEach(a => a.addEventListener('click', () => { closeMobileNav(); }));
});

// Project dropdown toggle
function toggleProject(header) {
  const content = header.nextElementSibling;
  const isExpanded = header.classList.contains('expanded');
  
  if (isExpanded) {
    header.classList.remove('expanded');
    content.classList.remove('expanded');
  } else {
    header.classList.add('expanded');
    content.classList.add('expanded');
  }
}

// Show/Hide more projects
document.addEventListener("DOMContentLoaded", function () {
  const toggleLine = document.getElementById("toggle-projects");
  const hiddenProjects = document.querySelectorAll(".project-hidden");
  let isExpanded = false;

  if (toggleLine && hiddenProjects.length > 0) {
    toggleLine.addEventListener("click", function () {
      isExpanded = !isExpanded;

      hiddenProjects.forEach(project => {
        if (isExpanded) {
          project.classList.add("visible");
        } else {
          project.classList.remove("visible");
        }
      });

      toggleLine.textContent = isExpanded ? "Hide" : "Show More";
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const sel = document.querySelectorAll('a, button, img, svg');
  sel.forEach(el => {
    try { el.draggable = false; } catch (e) {}
    el.addEventListener('dragstart', e => e.preventDefault());
    el.addEventListener('selectstart', e => e.preventDefault());
  });
});
