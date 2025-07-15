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
let displaySlideArrows = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const targetId = entry.target.id;

            const updateTitle = () => {
                switch (targetId) {
                    case "home":
                        sectionTitle.textContent = "Welcome";
                        displaySlideArrows = false;
                        break;
                    case "about":
                        sectionTitle.textContent = "About Me";
                        displaySlideArrows = false;
                        break;
                    case "projects":
                        sectionTitle.textContent = "My Projects";
                        displaySlideArrows = true;
                        break;
                    case "resume":
                        sectionTitle.textContent = "My Resume";
                        displaySlideArrows = false;
                        break;
                    case "email":
                        sectionTitle.textContent = "Email Me";
                        displaySlideArrows = false;
                        break;
                    default:
                        sectionTitle.textContent = "";
                        displaySlideArrows = false;
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

                if (displaySlideArrows) {
                    document.querySelectorAll("svg.slide-arrow").forEach((arrow) => {
                        arrow.classList.add("visible");
                    });
                } else {
                    document.querySelectorAll("svg.slide-arrow").forEach((arrow) => {
                        arrow.classList.remove("visible");
                    });
                }

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

const figureItems = Array.from(document.querySelectorAll("#projects main .project-card:not(.project-card-clone) figure > *"));
const projectImages = Array.from(document.querySelectorAll("#projects main .project-card:not(.project-card-clone) img"));
const leftSlideArrow = document.querySelector(".icon-tabler-circle-chevron-left");
const rightSlideArrow = document.querySelector(".icon-tabler-circle-chevron-right");
let projectCards = Array.from(document.querySelectorAll(".project-card:not(.project-card-clone)"));
let positionStack = [
    { top: "50px", left: "50px", z: 10 },
    { top: "15px", left: "15px", z: 8 },
    { top: "-20px", left: "-20px", z: 6 },
    { top: "-55px", left: "-55px", z: 4 },
];

// Handlers for flip mode
function flipCardOnClick(e) {
    leftSlideArrow.classList.toggle("visible");
    rightSlideArrow.classList.toggle("visible");
    this.parentElement.parentElement.classList.toggle("flipped");
    this.parentElement.parentElement.setAttribute("aria-pressed", this.classList.contains("flipped"));
}

function flipCardOnKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        leftSlideArrow.classList.toggle("visible");
        rightSlideArrow.classList.toggle("visible");
        this.parentElement.parentElement.parentElement.classList.toggle("flipped");
        this.parentElement.parentElement.parentElement.setAttribute("aria-pressed", this.classList.contains("flipped"));
    }
}

// Show only the active card, hide others
function rotateCards(e) {
    clickedImage = e.currentTarget;
    targetIndex = projectImages.indexOf(clickedImage);

    targetIndex = targetIndex === 0 ? 1 : targetIndex;

    for (let i = 0; i < targetIndex; i++) {
        projectImages.push(projectImages.shift()); // Reorder the array
        projectCards.push(projectCards.shift()); // If needed for "active" card logic
    }

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
        // card.style.zIndex = pos.z;
        img.style.top = pos.top;
        img.style.left = pos.left;
        img.style.zIndex = pos.z;
    });
}

// Add flip mode listeners
function enableFlipMode() {
    figureItems.forEach((item) => {
        item.addEventListener("click", flipCardOnClick);
        item.addEventListener("keydown", flipCardOnKeydown);
    });
    // Remove rotate listeners if any
    figureItems.forEach((item) => {
        item.removeEventListener("click", rotateCards);
    });
}

// Add rotate mode listeners
function enableRotateMode() {
    // Remove flip listeners first
    projectImages.forEach((image) => {
        image.removeEventListener("click", flipCardOnClick);
        image.removeEventListener("keydown", flipCardOnKeydown);
    });
    // Add rotate listener
    projectImages.forEach((image) => {
        image.addEventListener("click", rotateCards);
        image.setAttribute("title", "");
    });
}

function updateInteractionMode() {
    if (window.innerWidth >= 600 && window.innerWidth < 1024 && window.matchMedia("(orientation: portrait)").matches) {
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

function checkWrap() {
    const h1 = document.querySelector("#about > header > h1");
    const divs = h1.querySelectorAll("div");

    // Compare the offsetTop values
    if (divs[0].offsetTop !== divs[1].offsetTop) {
        h1.classList.add("wrapped");
    } else {
        h1.classList.remove("wrapped");
    }
}

// Run on page load
window.addEventListener("load", checkWrap);

// Run on resize
window.addEventListener("resize", () => {
    // Debounce to avoid flooding during resize
    clearTimeout(window.wrapTimeout);
    window.wrapTimeout = setTimeout(checkWrap, 100);
});

function toggleDescription(activeFigcaption) {
    document.querySelectorAll("#projects figcaption").forEach((figcaption) => {
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

const projectsMain = document.querySelector("#projects > main");

// Clone first and last cards
const firstCardClone = projectCards[0].cloneNode(true);
const lastCardClone = projectCards[projectCards.length - 1].cloneNode(true);

[firstCardClone, lastCardClone].forEach((cardClone) => {
    cardClone.removeAttribute("id");
    cardClone.setAttribute("aria-hidden", "true");
    cardClone.style.pointerEvents = "none";
    cardClone.classList.add("project-card-clone");
});

// Insert clones
projectsMain.appendChild(firstCardClone);
projectsMain.insertBefore(lastCardClone, projectCards[0]);

// Refresh list to include clones
projectCardsWithClones = Array.from(projectsMain.querySelectorAll(".project-card"));

// Recalculate cardWidth after clones are inserted and layout updated
let cardWidth = 0;

// Set initial scroll position to the first real card (index 1 because of prepended lastClone)
requestAnimationFrame(() => {
    setTimeout(() => {
        cardWidth = projectCardsWithClones[0].offsetWidth;

        projectsMain.scrollLeft = cardWidth;

        setTimeout(() => {
            projectsMain.scrollLeft = cardWidth; // force again if needed
        }, 100);
    }, 50);
});

let isTransitioning = false;

function scrollToProjectCard(index, smooth = true) {
    if (isTransitioning) return;
    isTransitioning = true;

    projectsMain.scrollTo({
        left: cardWidth * index,
        behavior: smooth ? "smooth" : "auto",
    });

    if (smooth) {
        // Listen for scroll stop
        let lastScrollLeft = projectsMain.scrollLeft;
        const checkScrollEnd = () => {
            const currentScrollLeft = projectsMain.scrollLeft;
            if (currentScrollLeft === lastScrollLeft) {
                // Scroll stopped
                projectsMain.removeEventListener("scroll", onScroll);
                isTransitioning = false;
                checkAndResetPosition();
            } else {
                lastScrollLeft = currentScrollLeft;
                // Check again after a short delay
                setTimeout(checkScrollEnd, 50);
            }
        };
        const onScroll = () => {
            // No-op; just to trigger event
        };
        projectsMain.addEventListener("scroll", onScroll);
        setTimeout(checkScrollEnd, 50);
    } else {
        isTransitioning = false;
        checkAndResetPosition();
    }
}

function checkAndResetPosition() {
    const maxIndex = projectCardsWithClones.length - 1;
    const scrollIndex = Math.round(projectsMain.scrollLeft / cardWidth);

    if (scrollIndex === 0) {
        requestAnimationFrame(() => {
            projectsMain.scrollLeft = cardWidth * (maxIndex - 1);
        });
    } else if (scrollIndex === maxIndex) {
        requestAnimationFrame(() => {
            projectsMain.scrollLeft = cardWidth;
        });
    }
}

function getCurrentCardIndex() {
    let curIndex = Math.round(projectsMain.scrollLeft / cardWidth);
    return curIndex;
}

leftSlideArrow.addEventListener("click", () => {
    let currentIndex = getCurrentCardIndex();
    scrollToProjectCard(currentIndex - 1);
});

rightSlideArrow.addEventListener("click", () => {
    let currentIndex = getCurrentCardIndex();
    scrollToProjectCard(currentIndex + 1);
});

projectsMain.addEventListener("scroll", () => {
    if (isTransitioning) return;

    const maxIndex = projectCardsWithClones.length - 1;
    const scrollIndex = Math.round(projectsMain.scrollLeft / cardWidth);

    if (scrollIndex === 0) {
        isTransitioning = true;
        projectsMain.style.scrollBehavior = "auto";
        requestAnimationFrame(() => {
            projectsMain.scrollLeft = cardWidth * (maxIndex - 1);
            projectsMain.style.scrollBehavior = "";
            isTransitioning = false;
        });
    } else if (scrollIndex === maxIndex) {
        isTransitioning = true;
        projectsMain.style.scrollBehavior = "auto";
        requestAnimationFrame(() => {
            projectsMain.scrollLeft = cardWidth;
            projectsMain.style.scrollBehavior = "";
            isTransitioning = false;
        });
    }
});

/* FOR HANDLING SCROLL ISSUES */
// const aboutSection = document.querySelector("#about");
// const aboutMain = document.querySelector("#about > main");
// const panels = document.querySelectorAll("#about > main > .value-panel");
// const bodyMain = document.querySelector("body > main");

// let isInsideAbout = false;
// const viewedPanels = new Set();

// // Disable body scroll
// function disableBodyScroll() {
//     bodyMain.style.overflow = "hidden";
// }

// // Enable body scroll
// function enableBodyScroll() {
//     bodyMain.style.overflow = "";
// }

// // === ABOUT OBSERVER ===
// const aboutObserver = new IntersectionObserver(
//     ([entry]) => {
//         const ratio = entry.intersectionRatio;
//         console.log(`#about intersectionRatio: ${ratio}`);

//         if (entry.isIntersecting && ratio > 0.7 && !isInsideAbout) {
//             isInsideAbout = true;
//             viewedPanels.clear();
//             console.log("#about section entered ('isInsideAbout': true). Clearing viewed panels.");

//             // Lock scroll inside about
//             aboutMain.style.overscrollBehavior = "contain";
//             disableBodyScroll();
//         } else if (!entry.isIntersecting && isInsideAbout) {
//             isInsideAbout = false;
//             console.log("#about section exited ('isInsideAbout': false).");

//             // Re-enable body scroll
//             aboutMain.style.overscrollBehavior = "";
//             enableBodyScroll();
//         }
//     },
//     {
//         root: bodyMain,
//         threshold: [0, 0.2, 0.7, 1.0],
//     }
// );

// // === PANEL OBSERVER ===
// const panelsObserver = new IntersectionObserver(
//     (entries) => {
//         if (!isInsideAbout) return;

//         entries.forEach((entry) => {
//             if (entry.isIntersecting) {
//                 const panelId = entry.target.id;
//                 const ratio = entry.intersectionRatio;

//                 if (!viewedPanels.has(panelId)) {
//                     viewedPanels.add(panelId);
//                     console.log(`${panelId} entered (ratio: ${ratio}) and added to set. Number of panels viewed is ${viewedPanels.size}.`);

//                     if (viewedPanels.size === panels.length) {
//                         console.log("✅ All div.value-panels viewed. Unlocking scroll.");

//                         // Unlock scrolling
//                         aboutMain.style.overscrollBehavior = "auto";
//                         enableBodyScroll();

//                         // Optional: scroll to bottom to nudge toward next section
//                         aboutMain.scrollTop = aboutMain.scrollHeight;
//                     }
//                 }
//             }
//         });
//     },
//     {
//         root: aboutMain,
//         threshold: 0.2,
//     }
// );

// // Observe about section and panels
// aboutObserver.observe(aboutSection);
// panels.forEach((panel) => panelsObserver.observe(panel));

// // === OPTIONAL: Scroll Logging (throttled) ===
// let lastLogTime = 0;
// const throttleDelay = 200;
// aboutMain.addEventListener("scroll", () => {
//     const now = Date.now();
//     if (now - lastLogTime < throttleDelay) return;
//     lastLogTime = now;

//     console.log(`aboutMain scrollTop: ${aboutMain.scrollTop}, scrollHeight: ${aboutMain.scrollHeight}, clientHeight: ${aboutMain.clientHeight}`);
// });

// // === iOS TOUCH SCROLL TRAP FIX ===
// aboutMain.addEventListener(
//     "touchstart",
//     (e) => {
//         aboutMain._startY = e.touches[0].clientY;
//     },
//     { passive: true }
// );

// aboutMain.addEventListener(
//     "touchmove",
//     (e) => {
//         if (!isInsideAbout) return;

//         const scrollTop = aboutMain.scrollTop;
//         const scrollHeight = aboutMain.scrollHeight;
//         const clientHeight = aboutMain.clientHeight;
//         const currentY = e.touches[0].clientY;
//         const deltaY = currentY - aboutMain._startY;

//         const isAtTop = scrollTop === 0;
//         const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

//         // Prevent scrolling out of bounds
//         if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
//             e.preventDefault();
//         }
//     },
//     { passive: false }
// );
