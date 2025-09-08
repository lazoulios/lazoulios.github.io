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
