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

async function fetchLatestCommit() {
  const username = 'lazoulios';
  const url = `https://api.github.com/users/${username}/events/public`;
  const activityElement = document.getElementById('github-activity');

  if (!activityElement) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response failed');
    const data = await response.json();

    const events = Array.isArray(data) ? data : [];
    const newestEvent = events.length > 0 ? events[0] : null;
    const codeTypes = [
      'PushEvent', 'PullRequestEvent', 'IssuesEvent', 'PullRequestReviewEvent',
      'CreateEvent', 'ForkEvent', 'CommitCommentEvent', 'PullRequestReviewCommentEvent'
    ];
    const codeEvent = events.find(e => codeTypes.includes(e.type));
    const latestEvent = codeEvent || newestEvent;

    const activityText = activityElement.querySelector('#activity-text') || activityElement;
    if (latestEvent) {
      const repoFullName = latestEvent.repo && latestEvent.repo.name ? latestEvent.repo.name : '';
      const repoName = repoFullName ? repoFullName.split('/')[1] : 'a repository';
      const eventDate = new Date(latestEvent.created_at);
      const now = new Date();
      const diffHours = Math.floor((now - eventDate) / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      let timeString = '';
      if (diffHours < 1) timeString = 'just now';
      else if (diffHours < 24) timeString = `${diffHours} hours ago`;
      else timeString = `${diffDays} days ago`;

      const eventInfo = formatEvent(latestEvent, repoFullName, repoName);
      activityText.innerHTML = `<b>Latest Public Activity:</b> ${eventInfo} ${timeString}.`;
      setActivityIndicator('live');
    } else {
      activityText.innerHTML = '<b>Latest Public Activity:</b> No recent public activity found.';
      setActivityIndicator('idle');
    }
  } catch (error) {
    console.error('GitHub API Error:', error);
    const activityText = activityElement.querySelector('#activity-text') || activityElement;
    activityText.innerHTML = '<b>Latest Public Activity:</b> Unable to sync GitHub data right now.';
    setActivityIndicator('error');
  }
}

fetchLatestCommit();

function formatEvent(event, repoFullName, repoName) {
  const repoLink = repoFullName
    ? `<a href="https://github.com/${repoFullName}" target="_blank" rel="noopener noreferrer">${repoName}</a>`
    : repoName;

  switch (event.type) {
    case 'PushEvent': {
      const commits = (event.payload && event.payload.commits) || [];
      if (commits.length === 0) return `Pushed to ${repoLink}`;
      const commit = commits[0];
      const commitUrl = `https://github.com/${repoFullName}/commit/${commit.sha}`;
      return `Pushed to ${repoLink}: <i><a href="${commitUrl}" target="_blank" rel="noopener noreferrer">"${commit.message}"</a></i>`;
    }
    case 'PullRequestEvent': {
      const pr = event.payload && event.payload.pull_request;
      if (!pr) return `Pull request activity on ${repoLink}`;

      const action = event.payload && event.payload.action ? event.payload.action : '';
      let verb = 'Updated pull request';
      if (action === 'opened') verb = 'Opened pull request';
      else if (action === 'closed') {
        verb = pr.merged ? 'Merged pull request' : 'Closed pull request';
      } else if (action === 'reopened') verb = 'Reopened pull request';

      return `${verb} in ${repoLink}: <i><a href="${pr.html_url}" target="_blank" rel="noopener noreferrer">"${pr.title}"</a></i>`;
    }
    case 'IssuesEvent': {
      const issue = event.payload && event.payload.issue;
      if (!issue) return `Issue activity on ${repoLink}`;

      const action = event.payload && event.payload.action ? event.payload.action : '';
      let verb = 'Updated issue';
      if (action === 'opened') verb = 'Opened issue';
      else if (action === 'closed') verb = 'Closed issue';
      else if (action === 'reopened') verb = 'Reopened issue';

      return `${verb} in ${repoLink}: <i><a href="${issue.html_url}" target="_blank" rel="noopener noreferrer">"${issue.title}"</a></i>`;
    }
    case 'IssueCommentEvent': {
      const issue = event.payload && event.payload.issue;
      if (!issue) return `Commented on issue in ${repoLink}`;
      return `Commented on issue in ${repoLink}: <i><a href="${issue.html_url}" target="_blank" rel="noopener noreferrer">"${issue.title}"</a></i>`;
    }
    case 'PullRequestReviewEvent': {
      const pr = event.payload && event.payload.pull_request;
      if (!pr) return `Reviewed pull request in ${repoLink}`;
      const review = event.payload && event.payload.review;
      const state = review && review.state ? review.state.toLowerCase() : '';
      let verb = 'Reviewed pull request';
      if (state === 'approved') verb = 'Approved pull request';
      else if (state === 'changes_requested') verb = 'Requested changes on pull request';
      else if (state === 'commented') verb = 'Commented on pull request';
      return `${verb} in ${repoLink}: <i><a href="${pr.html_url}" target="_blank" rel="noopener noreferrer">"${pr.title}"</a></i>`;
    }
    case 'PullRequestReviewCommentEvent': {
      const pr = event.payload && event.payload.pull_request;
      if (!pr) return `Commented on pull request in ${repoLink}`;
      return `Commented on pull request in ${repoLink}: <i><a href="${pr.html_url}" target="_blank" rel="noopener noreferrer">"${pr.title}"</a></i>`;
    }
    case 'CommitCommentEvent': {
      const comment = event.payload && event.payload.comment;
      if (!comment) return `Commented on commit in ${repoLink}`;
      return `Commented on commit in ${repoLink}: <i><a href="${comment.html_url}" target="_blank" rel="noopener noreferrer">"${comment.commit_id.slice(0, 7)}"</a></i>`;
    }
    case 'CreateEvent': {
      const refType = event.payload && event.payload.ref_type ? event.payload.ref_type : 'item';
      const ref = event.payload && event.payload.ref ? ` "${event.payload.ref}"` : '';
      return `Created ${refType}${ref} in ${repoLink}`;
    }
    case 'DeleteEvent': {
      const refType = event.payload && event.payload.ref_type ? event.payload.ref_type : 'item';
      const ref = event.payload && event.payload.ref ? ` "${event.payload.ref}"` : '';
      return `Deleted ${refType}${ref} in ${repoLink}`;
    }
    case 'WatchEvent': {
      return `Starred ${repoLink}`;
    }
    case 'ForkEvent': {
      const fork = event.payload && event.payload.forkee;
      if (!fork) return `Forked ${repoLink}`;
      return `Forked ${repoLink} to <i><a href="${fork.html_url}" target="_blank" rel="noopener noreferrer">${fork.full_name}</a></i>`;
    }
    case 'ReleaseEvent': {
      const release = event.payload && event.payload.release;
      if (!release) return `Published release in ${repoLink}`;
      return `Published release in ${repoLink}: <i><a href="${release.html_url}" target="_blank" rel="noopener noreferrer">"${release.name || release.tag_name}"</a></i>`;
    }
    case 'PublicEvent': {
      return `Publicized ${repoLink} repository`;
    }
    case 'MemberEvent': {
      const member = event.payload && event.payload.member;
      if (!member) return `Added a collaborator in ${repoLink}`;
      return `Added <i><a href="${member.html_url}" target="_blank" rel="noopener noreferrer">${member.login}</a></i> to ${repoLink}`;
    }
    default: {
      return `New activity on ${repoLink}`;
    }
  }
}

function setActivityIndicator(status) {
  const el = document.getElementById('activity-indicator');
  if (!el) return;
  el.classList.remove('live', 'error', 'idle');
  if (status === 'live') {
    el.classList.add('live');
    el.setAttribute('aria-hidden', 'true');
  } else if (status === 'error') {
    el.classList.add('error');
    el.setAttribute('aria-hidden', 'false');
  } else {
    el.classList.add('idle');
    el.setAttribute('aria-hidden', 'true');
  }
}