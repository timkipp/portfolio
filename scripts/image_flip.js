import { leftSlideArrow, rightSlideArrow } from "./project_carousel.js";
import { reorderProjects } from "./image_rotation.js";

const figureItems = Array.from(document.querySelectorAll("#projects main .project-card:not(.project-card-clone) figure > *"));
// Handlers for flip mode
export function flipCardOnClick(e) {
    leftSlideArrow.classList.toggle("visible");
    rightSlideArrow.classList.toggle("visible");
    this.parentElement.parentElement.classList.toggle("flipped");
    this.parentElement.parentElement.setAttribute("aria-pressed", this.classList.contains("flipped"));
}

export function flipCardOnKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        leftSlideArrow.classList.toggle("visible");
        rightSlideArrow.classList.toggle("visible");
        this.parentElement.parentElement.parentElement.classList.toggle("flipped");
        this.parentElement.parentElement.parentElement.setAttribute("aria-pressed", this.classList.contains("flipped"));
    }
}

// Add flip mode listeners
export function enableImageFlipping() {
    figureItems.forEach((item) => {
        item.addEventListener("click", flipCardOnClick);
        item.addEventListener("keydown", flipCardOnKeydown);
    });
    // Remove rotate listeners if any
    figureItems.forEach((item) => {
        item.removeEventListener("click", reorderProjects);
    });
}
