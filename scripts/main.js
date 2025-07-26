import { initializeDebugging } from "./debug.js";
import { checkWrap, initializeSectionObserver, setRealVH } from "./view.js";
import { setProjectsInteraction } from "./interaction.js";
// import { projectsMain, triggerProjectCarousel } from "./project_carousel.js";

// debugger;

initializeDebugging();

if (document.readyState === "complete") {
    document.body.classList.remove("loading");
    void document.body.offsetHeight;
} else {
    window.addEventListener("load", () => {
        document.body.classList.remove("loading");
        void document.body.offsetHeight;
    });
}

window.addEventListener("resize", () => {
    setProjectsInteraction();

    // Debounce to avoid flooding during resize
    clearTimeout(window.wrapTimeout);
    window.wrapTimeout = setTimeout(checkWrap, 100);
});

// window.addEventListener("DOMContentLoaded", () => {
//     const activeCard = document.querySelector("#projects .project-card.active");
//     if (activeCard) {
//         const figcaption = activeCard.querySelector("figcaption");
//         figcaption.style.height = figcaption.scrollHeight + "px";
//     }
// });

window.addEventListener("load", checkWrap);

setRealVH();

initializeSectionObserver();

setProjectsInteraction();
