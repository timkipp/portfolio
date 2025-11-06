import { leftSideArrow, rightSideArrow } from "./project_carousel.js";
import { reorderProjects } from "./image_rotation.js";

const figureItems = Array.from(document.querySelectorAll("#projects main .project-card:not(.project-card-clone) figure > *"));
const figures = Array.from(document.querySelectorAll("#projects main .project-card:not(.project-card-clone) figure"));

// Handlers for flip mode
export function flipCardOnClick(e) {
    // alert("Clicked!");
    leftSideArrow.classList.toggle("visible");
    rightSideArrow.classList.toggle("visible");
    this.parentElement.classList.toggle("flipped");
    this.parentElement.setAttribute("aria-pressed", this.classList.contains("flipped"));
}

export function flipCardOnKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        leftSideArrow.classList.toggle("visible");
        rightSideArrow.classList.toggle("visible");
        this.parentElement.classList.toggle("flipped");
        this.parentElement.setAttribute("aria-pressed", this.classList.contains("flipped"));
    }
}

// Add flip mode listeners
export function enableImageFlipping() {
    figures.forEach((item) => {
        item.addEventListener("click", flipCardOnClick);
        item.addEventListener("keydown", flipCardOnKeydown);
    });
    // Remove rotate listeners if any
    figures.forEach((item) => {
        item.removeEventListener("click", reorderProjects);
    });
}
