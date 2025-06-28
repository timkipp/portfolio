const sectionTitle = document.getElementById("section-title");
const sections = ["landing", "about-me", "projects", "resume", "email"];
const options = {
  root: null,
  threshold: 0.6,
};

let hasLoaded = false; // <-- New flag

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const targetId = entry.target.id;

      const updateTitle = () => {
        switch (targetId) {
          case "landing":
            sectionTitle.textContent = "Welcome";
            break;
          case "about-me":
            sectionTitle.textContent = "About Me";
            break;
          case "projects":
            sectionTitle.textContent = "My Projects";
            break;
          case "resume":
            sectionTitle.textContent = "My Resume";
            break;
          case "email":
            sectionTitle.textContent = "Email Me";
            break;
          default:
            sectionTitle.textContent = "";
        }
      };

      if (!hasLoaded && targetId === "landing") {
        // First load: just set text with no animation
        sectionTitle.textContent = "Welcome";
        sectionTitle.setAttribute("data-state", "visible");
        hasLoaded = true;
        return;
      }

      // Fade out
      sectionTitle.setAttribute("data-state", "hidden");

      // Wait for fade-out to finish, then update text and fade back in
      setTimeout(() => {
        updateTitle();

        requestAnimationFrame(() => {
          sectionTitle.setAttribute("data-state", "visible");
        });
      }, 500);
    }
  });
}, options);

// Observe all sections
sections.forEach((id) => {
  const section = document.getElementById(id);
  if (section) observer.observe(section);
});

if (document.readyState === "complete") {
  document.body.classList.remove("loading");
  void document.body.offsetHeight;
} else {
  window.addEventListener("load", () => {
    document.body.classList.remove("loading");
    void document.body.offsetHeight;
  });
}

function setRealVH() {
    // Get the viewport height in pixels
    let vh = window.innerHeight * 0.01;
    // Set CSS variable --vh to the value in pixels
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initial call
setRealVH();

// Update on resize or orientation change
window.addEventListener('resize', setRealVH);
window.addEventListener('orientationchange', setRealVH);

document.querySelectorAll('.figure-card').forEach(card => {
  const isHoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (isHoverable) {
    // Simulate hover effect using JS
    card.addEventListener('mouseenter', () => {
      if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
        card.setAttribute('aria-pressed', 'true');
      }
    });

    card.addEventListener('mouseleave', () => {
      if (card.classList.contains('flipped')) {
        card.classList.remove('flipped');
        card.setAttribute('aria-pressed', 'false');
      }
    });
  } else {
    // Mobile/touch behavior: click toggles flip
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', card.classList.contains('flipped'));
    });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
        card.setAttribute('aria-pressed', card.classList.contains('flipped'));
      }
    });
  }
});
