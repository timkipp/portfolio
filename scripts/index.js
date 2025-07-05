const body = document.querySelector("body");
const asides = document.querySelectorAll("aside");
const sectionTitle = document.getElementById("section-title");
const sections = [
    { id: "home", color: "#412F30" },
    { id: "about", color: "#FFFFEB" },
    { id: "projects", color: "#412F30" },
    { id: "resume", color: "#412F30" },
    { id: "email", color: "#FFFFEB" },
];
const options = {
    root: null,
    rootMargin: "0px 0px -30% 0px", // triggers when 50% of section is visible
    threshold: 0.6,
};
let hasLoaded = false;
let currentCard = 0;

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const targetId = entry.target.id;

            const updateTitle = () => {
                switch (targetId) {
                    case "home":
                        sectionTitle.textContent = "Welcome";                        
                        break;
                    case "about":
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

            if (!hasLoaded && targetId === "home") {
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

sections.forEach(({ id }) => {
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
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Initial call
setRealVH();

const projectCards = Array.from(document.querySelectorAll('.project-card'));
const projectImages = Array.from(document.querySelectorAll("#projects main .project-card img"));
let positionStack = [
  { top: "50px", left: "50px", z: 10 },
  { top: "15px", left: "15px", z: 8 },
  { top: "-20px", left: "-20px", z: 6 },
  { top: "-55px", left: "-55px", z: 4 }
];

// Handlers for flip mode
function flipCardOnClick(e) {
    this.classList.toggle("flipped");
    this.setAttribute("aria-pressed", this.classList.contains("flipped"));
}

function flipCardOnKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.classList.toggle("flipped");
        this.setAttribute("aria-pressed", this.classList.contains("flipped"));
    }
}

// Show only the active card, hide others
function rotateCards() {
    projectImages.push(projectImages.shift()); // Reorder the array
    projectCards.push(projectCards.shift());   // If needed for "active" card logic

    projectCards.forEach((card, i) => {
        const isActive = i === 0;
        card.classList.toggle("active", isActive);

        // Reset flip state
        if (isActive) {
            card.classList.remove("flipped");
            card.setAttribute("aria-pressed", "false");

            // toggleDescription(card.querySelector("figcaption"));
        }

        // Apply image position
        const img = projectImages[i];
        const pos = positionStack[i];
        img.style.top = pos.top;
        img.style.left = pos.left;
        img.style.zIndex = pos.z;
    });
}

// Add flip mode listeners
function enableFlipMode() {
    console.log("Enabling 'Flip' Mode");
    projectCards.forEach(card => {
        card.addEventListener("click", flipCardOnClick);
        card.addEventListener("keydown", flipCardOnKeydown);
    });
    // Remove rotate listeners if any
    projectCards.forEach(card => {
        card.removeEventListener("click", rotateCards);
    });    
}

// Add rotate mode listeners
function enableRotateMode() {
    console.log("Enabling 'Rotate' Mode");
    // Remove flip listeners first
    projectCards.forEach(card => {
        card.removeEventListener("click", flipCardOnClick);
        card.removeEventListener("keydown", flipCardOnKeydown);
    });
    // Add rotate listener
    projectCards.forEach(card => {
        card.addEventListener("click", rotateCards);
    });
}

// Initially enable flip mode (or whatever your default is)
enableFlipMode();

function updateInteractionMode() {
  if (
    window.innerWidth >= 600 &&
    window.innerWidth < 1024 &&
    window.matchMedia("(orientation: portrait)").matches
  ) {
    enableRotateMode();
  } else {
    enableFlipMode();
  }
}

// Run on load
updateInteractionMode();

// Run on resize
window.addEventListener("resize", updateInteractionMode);
window.addEventListener("DOMContentLoaded", () => {
    const activeCard = document.querySelector("#projects .project-card.active");
    if (activeCard) {
        const figcaption = activeCard.querySelector("figcaption");
        figcaption.style.height = figcaption.scrollHeight + "px";
    }
});

function toggleDescription(activeFigcaption) {
    document.querySelectorAll("#projects figcaption").forEach(figcaption => {
        figcaption.style.transition = "height 0.5s ease";
        figcaption.style.overflow = "hidden";

        if (figcaption === activeFigcaption) {
            // Expand
            figcaption.style.height = figcaption.scrollHeight + "px";

            // Optional: reset to auto after transition
            figcaption.addEventListener("transitionend", function handler() {
                figcaption.style.height = "auto";
                figcaption.removeEventListener("transitionend", handler);
            });
        } else {
            // Collapse
            figcaption.style.height = figcaption.scrollHeight + "px"; // Set current height first
            void figcaption.offsetHeight; // Force reflow
            figcaption.style.height = "0px";
        }
    });
}

const aboutMain = document.querySelector('#about > main');
const bodyMain = document.querySelector('body > main');
const panels = [...document.querySelectorAll('#about > main .value-panel')];

let lastPanelInView = false;

// 1. Observe LAST panel to know when it’s in view
const lastPanelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    lastPanelInView = entry.isIntersecting && entry.intersectionRatio >= 0.9;
  });
}, {
  root: aboutMain,
  threshold: 0.9
});

lastPanelObserver.observe(panels[panels.length - 1]);

// 2. Allow scrolling inside aboutMain unless at bottom and last panel not in view

// -- WHEEL (Desktop)
aboutMain.addEventListener('wheel', (e) => {
  const atBottom = Math.ceil(aboutMain.scrollTop + aboutMain.clientHeight) >= aboutMain.scrollHeight;
  if (e.deltaY > 0 && atBottom && !lastPanelInView) {
    // Trying to scroll down past the last panel before it's fully in view
    e.preventDefault();
  }
}, { passive: false });

// -- TOUCH (Mobile)
let startY = 0;

aboutMain.addEventListener('touchstart', (e) => {
  startY = e.touches[0].clientY;
}, { passive: true });

aboutMain.addEventListener('touchmove', (e) => {
  const currentY = e.touches[0].clientY;
  const deltaY = startY - currentY;

  const atBottom = Math.ceil(aboutMain.scrollTop + aboutMain.clientHeight) >= aboutMain.scrollHeight;

  if (deltaY > 0 && atBottom && !lastPanelInView) {
    // Trying to scroll down past inner container before seeing all panels
    e.preventDefault();
  }
}, { passive: false });