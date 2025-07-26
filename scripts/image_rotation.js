import { flipCardOnClick, flipCardOnKeydown } from "./image_flip.js";

export const projectCards = Array.from(document.querySelectorAll(".project-card:not(.project-card-clone)"));
const projectImages = Array.from(document.querySelectorAll("#projects main .project-card:not(.project-card-clone) img"));

let positionStack = [
    { top: "50px", left: "50px", z: 10 },
    { top: "15px", left: "15px", z: 8 },
    { top: "-20px", left: "-20px", z: 6 },
    { top: "-55px", left: "-55px", z: 4 },
];

// Add rotate mode listeners
export function enableProjectImageRotation() {
    // Remove flip listeners first
    projectImages.forEach((image) => {
        image.removeEventListener("click", flipCardOnClick);
        image.removeEventListener("keydown", flipCardOnKeydown);
    });
    // Add rotate listener
    projectImages.forEach((image) => {
        image.addEventListener("click", reorderProjects);
        image.setAttribute("title", "");
    });
}

export function reorderProjects(e) {
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
        }

        // Apply image position
        const img = projectImages[i];
        const pos = positionStack[i];
        img.style.top = pos.top;
        img.style.left = pos.left;
        img.style.zIndex = pos.z;
    });
}
