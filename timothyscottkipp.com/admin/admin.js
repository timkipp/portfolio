export function initializeAdministrative() {
    const triggerArea = document.querySelector("#admin-trigger");
    const messageIcon = triggerArea?.firstElementChild;

    if (!triggerArea || !messageIcon) return;

    let adminMode = false;
    let hoverActive = false;

    function showIcon() {
        if (adminMode && hoverActive) {
            messageIcon.classList.add("visible");
        }
    }

    function hideIcon() {
        messageIcon.classList.remove("visible");
    }

    triggerArea.addEventListener("mouseenter", () => {
        hoverActive = true;
        showIcon();
    });

    triggerArea.addEventListener("mouseleave", () => {
        hoverActive = false;
        hideIcon();
    });

    // Shift+M only works if you're hovering
    document.addEventListener("keydown", (e) => {
        if (hoverActive && e.key === "M" && e.shiftKey) {
            adminMode = !adminMode;
            if (adminMode) {
                showIcon();
            } else {
                hideIcon();
            }
        }

        // Esc hides icon but doesn't disable adminMode
        if (e.key === "Escape") {
            hideIcon();
        }
    });

    messageIcon.addEventListener("click", () => {
        if (adminMode && hoverActive) {
            window.open("admin/backend.php", "_blank");
        }
    });
}