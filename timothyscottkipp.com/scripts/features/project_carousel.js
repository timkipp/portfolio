import { delay } from "../debug.js";
import { projectCards } from "./image_rotation.js";

export const leftSideArrow = document.querySelector(".icon-tabler-circle-chevron-left");
export const rightSideArrow = document.querySelector(".icon-tabler-circle-chevron-right");

const projectsMain = document.querySelector("#projects > main");
const progressIndicators = Array.from(document.querySelectorAll(".progress-indicator"));
let currentProjectCard;
let currentProgressIndicator;
let projectCardsWithClones = [];
let cardWidth = 0;
let carouselSynced = false;
let indicatorsSynced = false;
let isTransitioning = false;
let progressIndicatorIsClicked = false;
let projectsSynced = false;

export function initializeProjectCarousel() {
    currentProjectCard = projectCards[0];
    currentProgressIndicator = progressIndicators[0];

    let firstCard = document.querySelector("#projects > main").firstElementChild;
    let lastCard = document.querySelector("#projects > main").lastElementChild;
    let firstCardClone = null;
    let lastCardClone = null;

    // Clone first and last cards if clone cards don't already exist
    if (!firstCard.classList.contains("project-card-clone")) {
        firstCardClone = projectCards[0].cloneNode(true);
    }

    if (!lastCard.classList.contains("project-card-clone")) {
        lastCardClone = projectCards[projectCards.length - 1].cloneNode(true);
    }

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

    // Set initial scroll position to the first real card (index 1 because of prepended lastClone)
    requestAnimationFrame(() => {
        setTimeout(() => {
            cardWidth = projectCardsWithClones[0].offsetWidth;

            projectsMain.scrollLeft = cardWidth;

            setTimeout(() => {
                projectsMain.scrollLeft = cardWidth;
            }, 100);
        }, 50);
    });

    leftSideArrow.addEventListener("click", () => {
        console.log("Left Scroll Button clicked");
        let currentIndex = getCurrentCardIndex();
        scrollToProjectCard(currentIndex - 1);
    });

    rightSideArrow.addEventListener("click", () => {
        console.log("Right Scroll Button clicked");
        let currentIndex = getCurrentCardIndex();
        scrollToProjectCard(currentIndex + 1);
    });

    currentProgressIndicator = progressIndicators[0];
    progressIndicators.forEach((indicator, indicatorIndex) => {
        indicator.addEventListener("click", syncProjectCarousel);
    });

    projectsMain.addEventListener("scroll", triggerProjectCarousel);

    projectsSynced = true;
    indicatorsSynced = true;
    carouselSynced = currentProjectCard.dataset.index === currentProgressIndicator.dataset.index;
}

export function updateCaptionHeight() {
    document.querySelectorAll(".figure-card").forEach((card) => {
        const img = card.querySelector("img");
        const figcaption = card.querySelector("figcaption");
        if (img && figcaption) {
            const rect = img.getBoundingClientRect();
            figcaption.style.width = rect.width + "px";
            figcaption.style.height = rect.height + "px";
        }
    });
}

function triggerProjectCarousel() {
    if (isTransitioning) return;

    const lastCardIndex = projectCardsWithClones.length - 1;
    const cardIndex = getCurrentCardIndex();
    const indicatorIndex = getCurrentIndicatorIndex();

    syncProjectCarousel(indicatorIndex);

    if (cardIndex === 0) {
        isTransitioning = true;
        projectsMain.style.scrollBehavior = "auto";
        requestAnimationFrame(() => {
            projectsMain.scrollLeft = cardWidth * (lastCardIndex - 1);
            projectsMain.style.scrollBehavior = "";
            isTransitioning = false;
        });
    } else if (cardIndex === lastCardIndex) {
        isTransitioning = true;
        projectsMain.style.scrollBehavior = "auto";
        requestAnimationFrame(() => {
            projectsMain.scrollLeft = cardWidth;
            projectsMain.style.scrollBehavior = "";
            isTransitioning = false;
        });
    }
}

function syncProjectCarousel(indicatorIndex) {
    if (this instanceof Element) {
        progressIndicatorIsClicked = true;

        currentProjectCard = document.querySelector(".project-card.active");
        console.log("Current Project Card:", currentProjectCard);
        const clickedProgressIndicator = this;
        const indicatorClickedIndex = progressIndicators.indexOf(clickedProgressIndicator);
        currentProgressIndicator.classList.remove("current");
        clickedProgressIndicator.classList.add("current");

        const currentCardIndex = getCurrentCardIndex();
        const lastCardIndex = progressIndicators.length;
        const targetCardIndex = indicatorClickedIndex + 1;

        if (targetCardIndex === currentCardIndex) {
            return;
        }

        let clickCount = 1;
        let direction = "right";

        if (currentCardIndex === 1 && targetCardIndex === lastCardIndex) {
            direction = "left";
        } else if (currentCardIndex === lastCardIndex && targetCardIndex === 1) {
            direction = "right";
        } else if (currentCardIndex === lastCardIndex && targetCardIndex < currentCardIndex) {
            direction = "right";
            clickCount = targetCardIndex;
        } else if (targetCardIndex > currentCardIndex) {
            clickCount = targetCardIndex - currentCardIndex;
        } else if (targetCardIndex < currentCardIndex) {
            direction = "left";
            clickCount = currentCardIndex - targetCardIndex;
        }

        console.log("🖱️ Click Count:", clickCount, "🧭 Direction:", direction);

        let nextCardIndex = currentCardIndex;
        for (let i = 0; i < clickCount; i++) {
            if (direction === "right") {
                nextCardIndex = (nextCardIndex + 1) % projectCardsWithClones.length;
                nextCardIndex = nextCardIndex === 0 ? 2 : nextCardIndex;
            } else {
                nextCardIndex = (nextCardIndex - 1 + projectCardsWithClones.length) % projectCardsWithClones.length;
            }

            console.log("Scrolling to project card", nextCardIndex);
            scrollToProjectCard(nextCardIndex);
        }

        const activeProjectCard = document.querySelector("div.active");
        const activeProjectIndex = activeProjectCard.dataset.index;

        const activeProgressIndicator = document.querySelector("span.current");
        const activeIndicatorIndex = progressIndicators.indexOf(activeProgressIndicator);

        projectsSynced = activeProjectIndex == activeIndicatorIndex + 1;
        indicatorsSynced = activeIndicatorIndex == indicatorClickedIndex;
        carouselSynced = projectsSynced && indicatorsSynced;

        progressIndicatorIsClicked = false;
    } else {
        progressIndicators.forEach((indicator, i) => {
            const isNewCurrentIndicator = i === indicatorIndex;
            indicator.classList.toggle("current", isNewCurrentIndicator);

            if (isNewCurrentIndicator) {
                currentProgressIndicator = indicator;
            }
        });
    }
}

function scrollToProjectCard(index, smooth = true) {
    console.log("'scrollToProjectCard' called");
    if (isTransitioning && !progressIndicatorIsClicked) return;
    isTransitioning = true;

    projectsMain.scrollTo({
        left: cardWidth * index,
        behavior: smooth ? "smooth" : "auto",
    });

    currentProjectCard.classList.remove("active");
    let dataIndex = index === 5 ? 1 : index === 0 ? 4 : index;
    currentProjectCard = document.querySelector(`.project-card[data-index="${dataIndex}"]`);
    currentProjectCard.classList.add("active");

    if (smooth) {
        let lastScrollLeft = projectsMain.scrollLeft;
        const currentScrollLeft = projectsMain.scrollLeft;
        if (currentScrollLeft === lastScrollLeft) {
            isTransitioning = false;

            const indicatorIndex = getCurrentIndicatorIndex();
            if (!indicatorsSynced) {
                syncProjectCarousel(indicatorIndex);
            }
            checkAndResetPosition();
        } else {
            lastScrollLeft = currentScrollLeft;
        }
    } else {
        isTransitioning = false;

        const indicatorIndex = getCurrentIndicatorIndex();
        if (!progressIndicatorIsClicked) {
            syncProjectCarousel(indicatorIndex);
        }

        checkAndResetPosition();
    }
}

function checkAndResetPosition() {
    console.log("'checkAndResetPosition' called");
    const lastCardIndex = projectCardsWithClones.length - 1;
    const cardIndex = getCurrentCardIndex();

    if (cardIndex === 0) {
        requestAnimationFrame(() => {
            console.log("Clone Card! Scrolling to original last card now...");
            projectsMain.scrollLeft = cardWidth * (lastCardIndex - 1);
        });
    } else if (cardIndex === lastCardIndex) {
        requestAnimationFrame(() => {
            console.log("Clone card! Scrolling to original first card now...");
            projectsMain.scrollLeft = cardWidth;
        });
    }
}

function getCurrentCardIndex() {
    let cardIndex = Math.round(projectsMain.scrollLeft / cardWidth);
    return cardIndex;
}

function getCurrentIndicatorIndex() {
    const cardIndex = getCurrentCardIndex();
    let indicatorIndex = cardIndex - 1;

    if (indicatorIndex < 0) {
        indicatorIndex = progressIndicators.length - 1;
    } else if (indicatorIndex >= progressIndicators.length) {
        indicatorIndex = 0;
    }

    return indicatorIndex;
}
