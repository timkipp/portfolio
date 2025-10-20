import { DeviceType, Orientation } from "./main.js";
import { initializeAboutNavigation } from "./about_section.js";
import { enableImageFlipping } from "./image_flip.js";
import { enableProjectImageRotation } from "./image_rotation.js";
import { initializeProjectCarousel } from "./project_carousel.js";

export function setInteraction(viewport) {
    if (viewport.deviceType == DeviceType.TABLET && viewport.orientation == Orientation.PORTRAIT) {
        enableProjectImageRotation();
    } else {
        enableImageFlipping();

        if (viewport.deviceType == DeviceType.PHONE) {
            initializeAboutNavigation();
            initializeProjectCarousel();
        }
    }
}
