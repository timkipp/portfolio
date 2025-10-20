const aboutMain = document.querySelector("#about > main");
const valueNavigationArrows = document.querySelectorAll("#about > main .value-panel h3 svg");

let valuePanels = Array.from(aboutMain.querySelectorAll("#about .value-panel:not(#about .value-panel-clone)"));
let valuePanelsWithClones = [];
let currentIndex = 1; // Start at first real panel (after prepending last clone)
let panelWidth = 0;
let isTransitioning = false;

export function initializeAboutNavigation() {
    // Clone first and last panels if clones don't exist
    const firstPanel = valuePanels[0];
    const lastPanel = valuePanels[valuePanels.length - 1];
    let firstPanelClone, lastPanelClone;

    if (!firstPanel.classList.contains("value-panel-clone")) {
        firstPanelClone = firstPanel.cloneNode(true);
        lastPanelClone = lastPanel.cloneNode(true);

        [firstPanelClone, lastPanelClone].forEach((clone) => {
            const newId = clone.id + "-clone";
            clone.setAttribute("id", newId);
            clone.setAttribute("aria-hidden", "true");
            clone.style.pointerEvents = "none";
            clone.classList.add("value-panel-clone");
        });

        // Insert clones
        aboutMain.insertBefore(lastPanelClone, firstPanel);
        aboutMain.appendChild(firstPanelClone);
    }

    // Refresh panel list including clones
    valuePanelsWithClones = Array.from(aboutMain.querySelectorAll(".value-panel"));

    // Set initial scroll position to first real panel
    requestAnimationFrame(() => {
        panelWidth = valuePanels[0].offsetWidth;
        aboutMain.scrollLeft = panelWidth;

        setTimeout(() => {
            panelWidth = valuePanels[0].offsetWidth;
            // alert("Scrolling to", panelWidth);
            aboutMain.scrollLeft = panelWidth;
        }, 200);
    });

    // Add arrow click listeners
    valueNavigationArrows.forEach((arrow) => {
        arrow.addEventListener("click", () => navigateAbout(arrow));
    });

    // Optional: handle direct scroll events (if you allow swipe scrolling)
    aboutMain.addEventListener("scroll", handleCloneScroll);
}

function navigateAbout(arrowClicked) {
    if (isTransitioning) return;
    isTransitioning = true;

    const isNext = arrowClicked.id.startsWith("next-value-");
    let nextIndex = currentIndex + (isNext ? 1 : -1);
    const targetPanel = valuePanelsWithClones[nextIndex];

    aboutMain.scrollTo({
        left: targetPanel.offsetLeft,
        behavior: "smooth",
    });

    currentIndex = nextIndex;

    // After scroll ends, snap if on clone
    targetPanel.addEventListener("transitionend", () => jumpIfClone(targetPanel), { once: true });
}

// Optional: detect scroll snapping (for touch/trackpad)
function handleCloneScroll() {
    const index = Math.round(aboutMain.scrollLeft / panelWidth);
    if (index !== currentIndex) {
        currentIndex = index;
        jumpIfClone(valuePanelsWithClones[index]);
    }
}

function jumpIfClone(panel) {
    if (!panel.classList.contains("value-panel-clone")) {
        isTransitioning = false;
        return;
    }

    // Snap to real panel instantly
    if (currentIndex === 0) {
        // Jump from prepended last clone → last real panel
        currentIndex = valuePanelsWithClones.length - 2;
    } else if (currentIndex === valuePanelsWithClones.length - 1) {
        // Jump from appended first clone → first real panel
        currentIndex = 1;
    }

    aboutMain.style.scrollBehavior = "auto";
    aboutMain.scrollLeft = valuePanelsWithClones[currentIndex].offsetLeft;
    aboutMain.style.scrollBehavior = "smooth";

    isTransitioning = false;
}
