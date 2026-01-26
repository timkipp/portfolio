import { DeviceType, Orientation } from "../main.js";
import { initializeAboutNavigation } from "../sections/about.js";
import { enableImageFlipping } from "../features/image_flip.js";
import { enableProjectImageRotation } from "../features/image_rotation.js";
import { initializeProjectCarousel } from "../features/project_carousel.js";

export function enableResumeDownload() {
    const resumeDownload = document.querySelector("header span:has(img)");

    resumeDownload.addEventListener("click", (event) => {
        event.stopPropagation();
        window.open("documents/TimKipp_Resume.pdf");
    });
}

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
