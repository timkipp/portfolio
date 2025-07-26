import { delay } from "./debug.js";
import { projectCards } from "./image_rotation.js";

export const leftSlideArrow = document.querySelector(".icon-tabler-circle-chevron-left");
export const rightSlideArrow = document.querySelector(".icon-tabler-circle-chevron-right");
export const projectsMain = document.querySelector("#projects > main");

const progressIndicators = document.querySelectorAll(".progress-indicator");
let progressIndicatorClicked;
let currentProgressIndicator;
let projectCardsWithClones = [];
let cardWidth = 0;
let isTransitioning = false;
let ignoreNextScroll = false;
let scrollTimeout;

export function initializeProjectCarousel() {
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

    // Set initial scroll position to the first real card (index 1 because of prepended lastClone)
    setTimeout(() => {
        cardWidth = projectCardsWithClones[0].offsetWidth;
        projectsMain.scrollLeft = cardWidth;
    }, 50);

    leftSlideArrow.addEventListener("click", () => {
        console.log("⬅️ Left side arrow clicked!");
        let currentIndex = getVisibleCardIndex();
        scrollToProjectCard(currentIndex - 1);
    });

    rightSlideArrow.addEventListener("click", () => {
        console.log("➡️ Right side arrow clicked!");
        let currentIndex = getVisibleCardIndex();
        scrollToProjectCard(currentIndex + 1);
    });

    // Beginning of ChatGPT Updated Code
    progressIndicators.forEach((indicator, index) => {
        indicator.addEventListener("click", async () => {
            progressIndicatorClicked = indicator;
            const currentCardIndex = getVisibleCardIndex();
            const lastCardIndex = progressIndicators.length;
            const targetCardIndex = index + 1;

            console.log('\n⭐ PROGRESS INDICATOR CLICKED <span data-index="' + progressIndicatorClicked.dataset.index + '" > clicked');
            console.log("Last Card Index: ", lastCardIndex);

            if (targetCardIndex === currentCardIndex) {
                console.log("Clicked on the current project; no action taken.");
                return;
            }

            // Default direction and click count
            let direction = "right";
            let clickCount = 1;

            if (currentCardIndex === 1 && targetCardIndex === lastCardIndex) {
                console.log("1️⃣✔️ First condition met: Wrap backward from first to last 🔁");
                direction = "left";
            } else if (currentCardIndex === lastCardIndex && targetCardIndex === 1) {
                console.log("2️⃣✔️ Second condition met: Wrap forward from last to first 🔁");
                direction = "right";
            } else if (currentCardIndex === lastCardIndex && targetCardIndex < currentCardIndex) {
                // NEW CONDITION: wrap forward from last to earlier card (but not all the way to first)
                console.log("3️⃣ ✔️ Third condition met: Wrap forward from last to earlier card 🔁");
                direction = "right";
                clickCount = targetCardIndex;
            } else if (targetCardIndex > currentCardIndex) {
                console.log("4️⃣✔️ Fourth condition met: Move forward normally ⏭️");
                clickCount = targetCardIndex - currentCardIndex;
            } else if (targetCardIndex < currentCardIndex) {
                console.log("5️⃣✔️ Fifth condition met: Move backward normally ⏮️");
                direction = "left";
                clickCount = currentCardIndex - targetCardIndex;
            } else {
                console.log("No conditions met");
            }

            console.log("🖱️ Click Count:", clickCount);
            console.log("🧭 Direction:", direction);

            const clickEvent = new MouseEvent("click");
            for (let i = 0; i < clickCount; i++) {
                if (direction === "left") {
                    leftSlideArrow.dispatchEvent(clickEvent);
                } else {
                    rightSlideArrow.dispatchEvent(clickEvent);
                }
                await delay(300);
            }
        });
    });
    // End of ChatGPT Updated Code

    projectsMain.addEventListener("scroll", triggerProjectCarousel);
}

export function triggerProjectCarousel() {
    if (isTransitioning || ignoreNextScroll) return;

    clearTimeout(scrollTimeout); // Cancel any pending execution

    console.log("🎠Triggering project carousel");

    scrollTimeout = setTimeout(() => {
        // The total number of cards, including the cloned first and last cards
        const maxIndex = projectCardsWithClones.length - 1;

        // Estimate the index based on current scroll position and known card width
        const scrollIndex = Math.round(projectsMain.scrollLeft / cardWidth);

        // Determine which card is currently closest to the center of the viewport
        const visibleCardIndex = projectCardsWithClones.reduce(
            (closest, card, index) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const viewportCenter = window.innerWidth / 2;
                const distance = Math.abs(cardCenter - viewportCenter);
                if (distance < closest.distance) {
                    return { index, distance };
                }
                return closest;
            },
            { index: -1, distance: Infinity }
        ).index;

        // If the user has scrolled to the *first* clone (at scroll index 0),
        // jump to the real last card to simulate an infinite loop
        if (scrollIndex === 0) {
            isTransitioning = true;
            projectsMain.style.scrollBehavior = "auto"; // disable smooth scroll for the jump
            requestAnimationFrame(() => {
                projectsMain.scrollLeft = cardWidth * (maxIndex - 1); // jump to real last card
                projectsMain.style.scrollBehavior = ""; // re-enable smooth scroll
                isTransitioning = false;
            });
        }

        // If the user has scrolled to the *last* clone (at the end),
        // jump to the real first card to simulate an infinite loop
        else if (scrollIndex === maxIndex) {
            isTransitioning = true;
            projectsMain.style.scrollBehavior = "auto"; // disable smooth scroll for the jump
            requestAnimationFrame(() => {
                projectsMain.scrollLeft = cardWidth; // jump to real first card
                projectsMain.style.scrollBehavior = ""; // re-enable smooth scroll
                isTransitioning = false;
            });
        }

        updateProgressIndicator(visibleCardIndex);
    }, 150);
}

export function scrollToProjectCard(index, smooth = true) {
    console.log("📜 Scrolling to Project Card");
    if (isTransitioning) return;
    isTransitioning = true;

    ignoreNextScroll = true;

    // console.log("Ignore next scroll?", ignoreNextScroll);
    projectsMain.scrollTo({
        left: cardWidth * index,
        behavior: smooth ? "smooth" : "auto",
    });

    setTimeout(() => {
        ignoreNextScroll = false;
        // console.log("Ignore next scroll?", ignoreNextScroll);
    }, 400);

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

                // UPDATE THE PROGRESS INDICATOR HERE
                const visibleIndex = getVisibleCardIndex(); // your logic to find current visible card
                updateProgressIndicator(visibleIndex);
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

        // Also update indicators if no smooth scrolling
        const visibleIndex = getVisibleCardIndex();
        updateProgressIndicator(visibleIndex);
    }
}

function checkAndResetPosition() {
    const maxIndex = projectCardsWithClones.length - 1;
    const scrollIndex = Math.round(projectsMain.scrollLeft / cardWidth);

    if (scrollIndex === 0) {
        projectsMain.style.scrollBehavior = "auto";
        requestAnimationFrame(() => {
            // projectsMain.scrollLeft = cardWidth * (maxIndex - 1);
            projectsMain.scrollTo({ left: cardWidth * (maxIndex - 1), behavior: "auto" });
        });
        projectsMain.styel.scrollBehavior = "smooth";
    } else if (scrollIndex === maxIndex) {
        projectsMain.style.scrollBehavior = "auto";
        requestAnimationFrame(() => {
            // projectsMain.scrollLeft = cardWidth;

            projectsMain.scrollTo({ left: cardWidth, behavior: "auto" });
        });
        projectsMain.style.scrollBehavior = "smooth";
    }
}

function getVisibleCardIndex() {
    // Find the card closest to the center of the viewport
    const visibleCardIndex = projectCardsWithClones.reduce(
        (closest, card, index) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const viewportCenter = window.innerWidth / 2;
            const distance = Math.abs(cardCenter - viewportCenter);
            if (distance < closest.distance) {
                return { index, distance };
            }
            return closest;
        },
        { index: -1, distance: Infinity }
    ).index;

    // Adjust for the cloned first card prepended at index 0
    return visibleCardIndex;
}

function updateProgressIndicator(index) {
    progressIndicators.forEach((indicator, i) => {
        indicator.classList.toggle("current", i === index - 1);
        let classes = Array.from(indicator.classList);
        let includesCurrent = classes.includes("current") ? "🟢" : "";
        let classesList = classes.join(" ");
        console.log(' <span data-index="' + indicator.dataset.index + '" class="' + classesList + '"> ' + includesCurrent);
    });

    if (progressIndicatorClicked != null) {
        // console.log("Document readyState:", document.readyState);

        const allIndicators = Array.from(document.querySelectorAll("span.progress-indicator"));
        // console.log(
        //     "All .progress-indicator elements:",
        //     allIndicators.map((el) => el.outerHTML)
        // );

        const currentIndicator = document.querySelector("span.progress-indicator.current");

        if (currentIndicator) {
            console.log("🔍 Current .progress-indicator element found:");
            // console.log("→ outerHTML:", currentEl.outerHTML);
            // console.log("→ data-index:", currentEl.dataset.index);
        } else {
            console.warn("⚠️ No element found with 'span.progress-indicator.current' at this time.");
        }

        // Freeze the current progress indicator immediately
        currentProgressIndicator = currentIndicator;

        if (currentProgressIndicator) {
            const clickedIndex = progressIndicatorClicked.dataset.index;
            const currentIndex = currentProgressIndicator.dataset.index;
            const indexesMatch = clickedIndex === currentIndex;
            console.log(`→ Clicked index: ${clickedIndex}, Current index: ${currentIndex}`);
            if (indexesMatch) {
                console.log(`✅ Progress Indicator Clicked = Current Progress Indicator? ${indexesMatch}`);
            } else {
                console.error(`❌ Progress Indicator Clicked = Current Progress Indicator? ${indexesMatch}`);
            }
        } else {
            console.warn("⚠️ Cannot compare because currentProgressIndicator is null.");
        }
    }
}

// import { delay } from "./debug.js";
// import { projectCards } from "./image_rotation.js";

// export const leftSlideArrow = document.querySelector(".icon-tabler-circle-chevron-left");
// export const rightSlideArrow = document.querySelector(".icon-tabler-circle-chevron-right");
// export const projectsMain = document.querySelector("#projects > main");

// const progressIndicators = document.querySelectorAll(".progress-indicator");
// let progressIndicatorClicked;
// let currentProgressIndicator;
// let projectCardsWithClones = [];
// let cardWidth = 0;
// let isTransitioning = false;
// let ignoreNextScroll = false;
// let scrollTimeout;

// export function initializeProjectCarousel() {
//     const firstCardClone = projectCards[0].cloneNode(true);
//     const lastCardClone = projectCards[projectCards.length - 1].cloneNode(true);

//     [firstCardClone, lastCardClone].forEach((cardClone) => {
//         cardClone.removeAttribute("id");
//         cardClone.setAttribute("aria-hidden", "true");
//         cardClone.style.pointerEvents = "none";
//         cardClone.classList.add("project-card-clone");
//     });

//     projectsMain.appendChild(firstCardClone);
//     projectsMain.insertBefore(lastCardClone, projectCards[0]);

//     projectCardsWithClones = Array.from(projectsMain.querySelectorAll(".project-card"));

//     setTimeout(() => {
//         cardWidth = projectCardsWithClones[0].offsetWidth;
//         projectsMain.scrollLeft = cardWidth;
//     }, 50);

//     leftSlideArrow.addEventListener("click", () => {
//         const currentIndex = getVisibleCardIndex();
//         scrollToProjectCard(currentIndex - 1);
//     });

//     rightSlideArrow.addEventListener("click", () => {
//         const currentIndex = getVisibleCardIndex();
//         scrollToProjectCard(currentIndex + 1);
//     });

//     progressIndicators.forEach((indicator, index) => {
//         indicator.addEventListener("click", async () => {
//             progressIndicatorClicked = indicator;
//             const currentCardIndex = getVisibleCardIndex();
//             const lastCardIndex = progressIndicators.length;
//             const targetCardIndex = index + 1;

//             if (targetCardIndex === currentCardIndex) return;

//             let direction = "right";
//             let clickCount = 1;

//             if (currentCardIndex === 1 && targetCardIndex === lastCardIndex) {
//                 direction = "left";
//             } else if (currentCardIndex === lastCardIndex && targetCardIndex === 1) {
//                 direction = "right";
//             } else if (currentCardIndex === lastCardIndex && targetCardIndex < currentCardIndex) {
//                 direction = "right";
//                 clickCount = targetCardIndex;
//             } else if (targetCardIndex > currentCardIndex) {
//                 clickCount = targetCardIndex - currentCardIndex;
//             } else if (targetCardIndex < currentCardIndex) {
//                 direction = "left";
//                 clickCount = currentCardIndex - targetCardIndex;
//             }

//             const clickEvent = new MouseEvent("click");
//             for (let i = 0; i < clickCount; i++) {
//                 if (direction === "left") {
//                     leftSlideArrow.dispatchEvent(clickEvent);
//                 } else {
//                     rightSlideArrow.dispatchEvent(clickEvent);
//                 }
//                 await delay(300);
//             }
//         });
//     });

//     projectsMain.addEventListener("scroll", triggerProjectCarousel);
// }

// export function triggerProjectCarousel() {
//     if (isTransitioning || ignoreNextScroll) return;

//     clearTimeout(scrollTimeout);

//     scrollTimeout = setTimeout(() => {
//         const maxIndex = projectCardsWithClones.length - 1;
//         const scrollIndex = Math.round(projectsMain.scrollLeft / cardWidth);

//         const visibleCardIndex = projectCardsWithClones.reduce(
//             (closest, card, index) => {
//                 const rect = card.getBoundingClientRect();
//                 const cardCenter = rect.left + rect.width / 2;
//                 const viewportCenter = window.innerWidth / 2;
//                 const distance = Math.abs(cardCenter - viewportCenter);
//                 return distance < closest.distance ? { index, distance } : closest;
//             },
//             { index: -1, distance: Infinity }
//         ).index;

//         if (scrollIndex === 0) {
//             isTransitioning = true;
//             projectsMain.style.scrollBehavior = "auto";
//             requestAnimationFrame(() => {
//                 projectsMain.scrollLeft = cardWidth * (maxIndex - 1);
//                 projectsMain.style.scrollBehavior = "";
//                 isTransitioning = false;
//             });
//         } else if (scrollIndex === maxIndex) {
//             isTransitioning = true;
//             projectsMain.style.scrollBehavior = "auto";
//             requestAnimationFrame(() => {
//                 projectsMain.scrollLeft = cardWidth;
//                 projectsMain.style.scrollBehavior = "";
//                 isTransitioning = false;
//             });
//         }

//         updateProgressIndicator(visibleCardIndex);
//     }, 150);
// }

// export function scrollToProjectCard(index, smooth = true) {
//     if (isTransitioning) return;
//     isTransitioning = true;
//     ignoreNextScroll = true;

//     projectsMain.scrollTo({
//         left: cardWidth * index,
//         behavior: smooth ? "smooth" : "auto",
//     });

//     setTimeout(() => {
//         ignoreNextScroll = false;
//     }, 400);

//     if (smooth) {
//         let lastScrollLeft = projectsMain.scrollLeft;

//         const checkScrollEnd = () => {
//             const currentScrollLeft = projectsMain.scrollLeft;
//             if (currentScrollLeft === lastScrollLeft) {
//                 isTransitioning = false;
//                 checkAndResetPosition();
//                 const visibleIndex = getVisibleCardIndex();
//                 updateProgressIndicator(visibleIndex);
//             } else {
//                 lastScrollLeft = currentScrollLeft;
//                 setTimeout(checkScrollEnd, 50);
//             }
//         };

//         setTimeout(checkScrollEnd, 50);
//     } else {
//         isTransitioning = false;
//         checkAndResetPosition();
//         const visibleIndex = getVisibleCardIndex();
//         updateProgressIndicator(visibleIndex);
//     }
// }

// function checkAndResetPosition() {
//     const maxIndex = projectCardsWithClones.length - 1;
//     const scrollIndex = Math.round(projectsMain.scrollLeft / cardWidth);

//     if (scrollIndex === 0) {
//         requestAnimationFrame(() => {
//             projectsMain.scrollLeft = cardWidth * (maxIndex - 1);
//         });
//     } else if (scrollIndex === maxIndex) {
//         requestAnimationFrame(() => {
//             projectsMain.scrollLeft = cardWidth;
//         });
//     }
// }

// function getVisibleCardIndex() {
//     return projectCardsWithClones.reduce(
//         (closest, card, index) => {
//             const rect = card.getBoundingClientRect();
//             const cardCenter = rect.left + rect.width / 2;
//             const viewportCenter = window.innerWidth / 2;
//             const distance = Math.abs(cardCenter - viewportCenter);
//             return distance < closest.distance ? { index, distance } : closest;
//         },
//         { index: -1, distance: Infinity }
//     ).index;
// }

// function updateProgressIndicator(index) {
//     progressIndicators.forEach((indicator, i) => {
//         indicator.classList.toggle("current", i === index - 1);
//     });
// }
