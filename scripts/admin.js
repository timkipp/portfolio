export function intializeAdministrative() {
    const triggerArea = document.querySelector("#admin-trigger");
    const messageIcon = triggerArea.firstElementChild;

    let hoverActive = false;
    let keyComboActive = false;

    function checkAccessConditions() {
        if (hoverActive && keyComboActive) {
            messageIcon.classList.add("visible");
        }
    }

    function hideMessageIcon() {
        messageIcon.classList.remove("visible");
    }

    triggerArea.addEventListener("mouseenter", () => (hoverActive = true));
    triggerArea.addEventListener("mouseleave", () => {
        hoverActive = false;
        hideMessageIcon();
    });

    messageIcon.addEventListener("click", () => {
        window.open("backend/login.php", "_blank");
    });

    document.addEventListener("keydown", (e) => {
        if (e.shiftKey && e.key === "M") {
            keyComboActive = true;
            checkAccessConditions();
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === "Shift" || e.key === "M") {
            keyComboActive = false;
            hideMessageIcon();
        }
    });
}
