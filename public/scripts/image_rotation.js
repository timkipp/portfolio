import { flipCardOnClick, flipCardOnKeydown } from "./image_flip.js";

export const projectCards = Array.from(document.querySelectorAll(".project-card:not(.project-card-clone)"));
const projectImages = Array.from(document.querySelectorAll("#projects main .project-card:not(.project-card-clone) img"));

// let positionStack = [
//     { top: "110px", left: "175px", z: 10 },
//     { top: "58.33px", left: "116.6666667px", z: 8 },
//     { top: "6.67px", left: "58.33333333px", z: 6 },
//     { top: "-45px", left: "0px", z: 4 },
// ];

let positionStack = [
    { top: "9.44cqh", left: "17.86cqw", z: 10 },
    { top: "5.00cqh", left: "11.90cqw", z: 8 },
    { top: "0.57cqh", left: "5.95cqw", z: 6 },
    { top: "-3.86cqh", left: "0.00cqw", z: 4 },
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
    const clickedImage = e.currentTarget;
    let targetIndex = projectImages.indexOf(clickedImage);

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
