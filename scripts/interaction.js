import { enableImageFlipping } from "./image_flip.js";
import { enableProjectImageRotation } from "./image_rotation.js";
import { initializeProjectCarousel } from "./project_carousel.js";
import { DeviceType, Orientation } from "./main.js";

export function setProjectsInteraction(viewport) {
    // if (window.innerWidth >= 600 && window.innerWidth < 1024 && window.matchMedia("(orientation: portrait)").matches) {
    //     enableProjectImageRotation();
    // } else {
    //     enableImageFlipping();

    //     if (window.innerWidth <= 599 || (window.innerHeight <= 430 && window.matchMedia("(orientation: landscape)").matches)) {
    //         initializeProjectCarousel();
    //     }
    // }

    if (viewport.deviceType == DeviceType.TABLET && viewport.orientation == Orientation.PORTRAIT) {
        enableProjectImageRotation();
    } else {
        enableImageFlipping();

        if (viewport.deviceType == DeviceType.PHONE) {
            initializeProjectCarousel();
        }
    }
}
