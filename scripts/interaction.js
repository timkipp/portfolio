import { enableImageFlipping } from "./image_flip.js";
import { enableProjectImageRotation } from "./image_rotation.js";
import { initializeProjectCarousel } from "./project_carousel.js";

export function setProjectsInteraction() {
    if (window.innerWidth >= 600 && window.innerWidth < 1024 && window.matchMedia("(orientation: portrait)").matches) {
        enableProjectImageRotation();
    } else {
        enableImageFlipping();

        if (window.innerWidth <= 599 || (window.innerHeight <= 430 && window.matchMedia("(orientation: landscape)").matches)) {
            initializeProjectCarousel();
        }
    }
}
