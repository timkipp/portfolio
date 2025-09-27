import { initializeDebugging } from "./debug.js";
import { checkWrap, initializeSectionObserver, setRealVH } from "./view.js";
import { setProjectsInteraction } from "./interaction.js";
import { initializeResumeTabs, updateTabDisplayMode, setLogoObserver } from "./resume_section.js";

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

export const DeviceType = Object.freeze({
    PHONE: "phone",
    TABLET: "tablet",
    DESKTOP: "desktop",
    LAPTOP: "laptop",
});

export const Orientation = Object.freeze({
    PORTRAIT: "portrait",
    LANDSCAPE: "landscape",
});

export class UserDevice {
    constructor(deviceType, orientation) {
        this.type = deviceType;
        this.orientation = null;
        this.minWidth = null;
        this.maxWidth = null;
        this.minHeight = null;
        this.maxHeight = null;

        switch (deviceType) {
            // Commented Sizes based on D:\OneDrive - TSK\Personal\My Knowledge\Web Development Knowledgebase\Device Sizes and Screen Sizes.xlsm
            // Desktop and Laptop dimensions suggested by ChatGPT
            case DeviceType.TABLET:
                if (orientation === Orientation.LANDSCAPE) {
                    this.minWidth = 600; // 480
                    this.maxWidth = 1280; // 1024
                    this.minHeight = 600; // 667
                    this.maxHeight = 1440; // 1440
                    this.orientation = Orientation.LANDSCAPE;
                } else {
                    this.minWidth = 600; // 667
                    this.maxWidth = 1140; // 1140
                    this.minHeight = 480;
                    this.maxHeight = 1024;
                    this.orientation = Orientation.PORTRAIT;
                }
                break;
            case DeviceType.PHONE:
                if (orientation === Orientation.LANDSCAPE) {
                    this.minWidth = 160; // 160
                    this.maxWidth = 854; // 854
                    this.minHeight = 240; // 240
                    this.maxHeight = 430; // 1067
                    this.orientation = Orientation.LANDSCAPE;
                } else {
                    this.minWidth = 240; // 240
                    this.maxWidth = 599; // 430
                    this.minHeight = 160; // 160
                    this.maxHeight = 854; // 854
                    this.orientation = Orientation.PORTRAIT;
                }
                break;
            case DeviceType.LAPTOP:
                if (orientation === Orientation.LANDSCAPE) {
                    this.minWidth = 1024;
                    this.maxWidth = 3840;
                    this.minHeight = 600;
                    this.maxHeight = 2400;
                    this.orientation = Orientation.LANDSCAPE;
                } else {
                    this.minWidth = 600;
                    this.maxWidth = 1024;
                    this.minHeight = 1024;
                    this.maxHeight = 3840;
                    this.orientation = Orientation.PORTRAIT;
                }
                break;

            case DeviceType.DESKTOP:
                if (orientation === Orientation.LANDSCAPE) {
                    this.minWidth = 1280;
                    this.maxWidth = 7680;
                    this.minHeight = 720;
                    this.maxHeight = 4320;
                    this.orientation = Orientation.LANDSCAPE;
                } else {
                    this.minWidth = 720;
                    this.maxWidth = 1280;
                    this.minHeight = 1280;
                    this.maxHeight = 7680;
                    this.orientation = Orientation.PORTRAIT;
                }
                break;

            default:
                this.minWidth = 0;
                this.maxWidth = Infinity;
                this.minHeight = 0;
                this.maxHeight = Infinity;
                this.orientation = orientation;
        }
    }
}

export class BrowserViewport {
    constructor(device) {
        // console.log("Device: " + device.type + " | Orientation: " + device.orientation);
        this.deviceType = device.type;
        this.orientation = device.orientation;
        this.maxWidth = device.maxWidth;
        this.maxHeight = device.maxHeight;
        this.actualWidth = window.innerWidth;
        this.actualHeight = window.innerHeight;

        this.updateDimensions(device);
    }

    updateDimensions(device) {
        this.orientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
        this.maxWidth = device.maxWidth;
        this.maxHeight = device.maxHeight;
        this.actualWidth = window.innerWidth;
        this.actualHeight = window.innerHeight;
    }
}

function getDevice() {
    const inLandscapeOrientation = window.matchMedia("(orientation: landscape)").matches;
    let userDeviceType = DeviceType.COMPUTER;
    let device = null;

    if (inLandscapeOrientation) {
        if (window.innerHeight <= 430) {
            device = phoneLandscape;
        } else if (window.innerWidth >= 600 && window.innerWidth <= 1280) {
            device = tabletLandscape;
        } else if (window.innerWidth >= 1024 && window.innerWidth <= 3840) {
            device = laptopLandscape;
        } else {
            device = desktopLandscape;
        }
    } else {
        if (window.innerWidth <= 599) {
            device = phonePortrait;
        } else if (window.innerWidth >= 600 && window.innerWidth <= 1024) {
            device = tabletPortrait;
        } else if (window.innerWidth >= 720 && window.innerWidth <= 1280) {
            device = laptopPortrait;
        } else {
            device = desktopPortrait;
        }
    }

    return device;
}

const desktopLandscape = new UserDevice(DeviceType.DESKTOP, Orientation.LANDSCAPE);
const desktopPortrait = new UserDevice(DeviceType.DESKTOP, Orientation.PORTRAIT);
const laptopLandscape = new UserDevice(DeviceType.LAPTOP, Orientation.LANDSCAPE);
const laptopPortrait = new UserDevice(DeviceType.LAPTOP, Orientation.PORTRAIT);
const phonePortrait = new UserDevice(DeviceType.PHONE, Orientation.PORTRAIT);
const phoneLandscape = new UserDevice(DeviceType.PHONE, Orientation.LANDSCAPE);
const tabletPortrait = new UserDevice(DeviceType.TABLET, Orientation.PORTRAIT);
const tabletLandscape = new UserDevice(DeviceType.TABLET, Orientation.LANDSCAPE);

export let currentDevice = getDevice();
export let currentViewport = new BrowserViewport(currentDevice);

window.addEventListener("resize", () => {
    console.log("Browser resized");
    currentDevice = getDevice();
    currentViewport = new BrowserViewport(currentDevice);

    // Debounce to avoid flooding during resize
    clearTimeout(window.wrapTimeout);
    window.wrapTimeout = setTimeout(checkWrap, 100);

    setProjectsInteraction(currentViewport);
    updateTabDisplayMode(currentViewport);
    setLogoObserver();
});

window.addEventListener("load", checkWrap);

setRealVH();

initializeSectionObserver();

setProjectsInteraction(currentViewport);

initializeResumeTabs();

updateTabDisplayMode(currentViewport);
