import { DeviceType } from "./main.js";
import { Orientation } from "./main.js";
import { currentViewport } from "./main.js";

const resumeNavigation = document.querySelector("#resume-tabs");
const resumeTabs = document.querySelectorAll("#resume-tabs li");
const tabLabels = document.querySelectorAll("#resume-tabs .tab-label");
const tabIcons = document.querySelectorAll("#resume-tabs .tab-icon");
const resumeSections = document.querySelectorAll("#resume .resume-section");
const academicsDetails = document.querySelectorAll("#resume li.academics details");
const projectsDetails = document.querySelectorAll("#resume li.project details");
const jobsDetails = document.querySelectorAll("#resume li.job details");
const allResumeDetails = [academicsDetails, projectsDetails, jobsDetails];
const detailsNames = ["academic-record", "project-record", "employment-record"];

export function initializeResumeTabs() {
    resumeTabs.forEach((tab) => {
        tab.addEventListener("click", toggleResumeTab);
    });

    resumeNavigation.className = "display-summary";

    const isPhoneInLandscape = currentViewport.deviceType === DeviceType.PHONE && currentViewport.orientation === Orientation.LANDSCAPE;

    if (isPhoneInLandscape) {
        const h1 = document.querySelector("#resume > header  > h1");
        h1.classList.remove("visible");
        tabLabels[0].removeAttribute("hidden");
        tabIcons[0].setAttribute("hidden", true);
    }
}

function toggleResumeTab(event) {
    const tabClicked = event.currentTarget;
    const lastTabSelected = document.querySelector("#resume-tabs .selected-tab");
    const tabDisplayedHeadings = document.querySelectorAll("#resume h1");

    lastTabSelected.classList.remove("selected-tab");
    tabClicked.classList.add("selected-tab");

    const tabClickedId = tabClicked.id;
    const resumeSection = tabClickedId.replace(/-tab$/, "");
    const displaySection = "display-" + resumeSection;
    const tabDisplayed = resumeSection
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    tabDisplayedHeadings.forEach((heading, index) => {
        const isClickedTab = displaySection === heading.classList[0];
        const section = resumeSections[index];
        const tabLabel = tabLabels[index];
        const tabIcon = tabIcons[index];

        const sectionId = section.id;
        section.classList.toggle("visible", sectionId === resumeSection);

        const isPhoneInLandscape = currentViewport.deviceType === DeviceType.PHONE && currentViewport.orientation === Orientation.LANDSCAPE;
        // console.log(currentViewport.deviceType, currentViewport.orientation);
        // console.log("Is phone in landscape?", isPhoneInLandscape);

        if (isClickedTab) {
            resumeNavigation.className = displaySection;
        }

        if (!isPhoneInLandscape) {
            heading.classList.toggle("visible", isClickedTab);

            tabLabel.hidden = isClickedTab;
            tabIcon.hidden = !isClickedTab;
        }
    });
}

export function updateTabDisplayMode(viewport) {
    const isPhoneDevice = viewport.deviceType === DeviceType.PHONE;
    const isTabletDevice = viewport.deviceType === DeviceType.TABLET;
    const isLaptopDevice = viewport.deviceType === DeviceType.LAPTOP;
    const isDesktopDevice = viewport.deviceType === DeviceType.DESKTOP;
    const isLandscapeOrientation = viewport.orientation === Orientation.LANDSCAPE;

    allResumeDetails.forEach((sectionDetails, index) => {
        const sectionName = sectionDetails[0].parentElement.className;
        const isNotEducationSection = sectionName !== "academics";
        const isShortLandscapeTablet = isLandscapeOrientation && viewport.actualHeight < 800;
        // const displayDetailsAccordionStyle = !isDesktopDevice && !isLaptopDevice && (isPhoneDevice || (isTabletDevice && ((!isLandscapeOrientation && isNotEducationSection) || (isNotEducationSection && isShortLandscapeTablet))));
        const displayDetailsAccordionStyle = false;
        const record = detailsNames[index];

        sectionDetails.forEach((details, index) => {
            let displayDetailsOpen = true;

            if (displayDetailsAccordionStyle) {
                details.setAttribute("name", record);
                displayDetailsOpen = index === 0;
            } else {
                details.removeAttribute("name");
            }

            if (displayDetailsOpen) {
                details.setAttribute("open", "true");
            } else {
                details.removeAttribute("open");
            }
        });
    });
}

const summarySection = document.querySelector("#resume #summary");
const webTechLogos = document.querySelector(".web-technology-logos");
const logosList = webTechLogos.querySelector(".logos-list");
let logoObserver = null;
let featuredLogo = null;
let featuredWebTech = null;

document.addEventListener("DOMContentLoaded", () => {
    // Duplicate the original list twice
    for (let i = 0; i < 2; i++) {
        webTechLogos.appendChild(logosList.cloneNode(true));
    }

    setLogoObserver();
});

export function setLogoObserver() {
    const logos = document.querySelectorAll("#resume #summary .logos-list img");
    const summaryRect = summarySection.getBoundingClientRect();
    const bandSize = 40;
    const halfBand = bandSize / 2;
    const isLandscapeOrientation = window.innerWidth > window.innerHeight;
    const rootSize = isLandscapeOrientation ? summaryRect.height : summaryRect.width;

    const startMargin = -(rootSize / 2 - halfBand);
    const endMargin = -(rootSize / 2 - halfBand);
    const rootMargin = isLandscapeOrientation ? `${startMargin}px 0px ${endMargin}px 0px` : `0px ${startMargin}px 0px ${endMargin}px`;

    const observerOptions = {
        root: summarySection,
        rootMargin: rootMargin,
        threshold: 0,
    };

    if (logoObserver) {
        logoObserver.disconnect();
    }

    logoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const logoImage = entry.target;

                if (featuredLogo) {
                    featuredLogo.classList.remove("featured");
                    featuredWebTech.classList.remove("featured");
                }
                featuredLogo = logoImage;
                const webTechnology = logoImage.classList[0];
                featuredWebTech = document.querySelector(`#resume #summary > p span.${webTechnology}`);
                const webTechColor = logoImage.dataset.color;
                document.documentElement.style.setProperty("--featured-web-tech-color", webTechColor);
                logoImage.classList.add("featured");
                featuredWebTech.classList.add("featured");
            }
        });
    }, observerOptions);

    logos.forEach((logo) => logoObserver.observe(logo));
}
