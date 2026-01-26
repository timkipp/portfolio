import { addCustomFolder, deleteCustomFolder } from "/admin/assets.php?page=js/folders.js";
import { 
    DialogAction, 
    DialogInteraction, 
    dialog,    
} from "/admin/assets.php?page=js/dashboard.js";

import { deleteMessages } from "/admin/assets.php?page=js/message_list.js";

export const moveToFolderSelect = document.getElementById("move-to-folder");
export const moveToFolderButton = document.getElementById("move-selected");
export const messagePane = document.getElementById("message-pane");
export const ulAttachmentsList = document.getElementById("attachments-list");

export function handleDialogClose() {
    const interaction = dialog.returnValue
    const terminateDialog = interaction === DialogInteraction.CLOSE
    if (terminateDialog) {
        dialog.returnValue = "";
        return;
    } else {
        const action = dialog.returnValue;
        switch (action) {
            case DialogAction.ADD_FOLDER:
                addCustomFolder();
                break;

            case DialogAction.DELETE_FOLDER:
                deleteCustomFolder();
                break;

            case DialogAction.DELETE_MESSAGES:
                deleteMessages();
                break;

            default:
                return;
        }
    }
}

export function cycleThroughDialogControls(event) {
    if (event.key !== 'Tab') return;
    
    const focusableElements = Array.from(dialog.querySelectorAll(focusableSelectors))
        .filter(el => !el.disabled && el.offsetParent !== null);

    if (focusableElements.length === 0) return;

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstEl) {
            lastEl.focus();
            event.preventDefault();
        }
    } else {
        // Tab
        if (document.activeElement === lastEl) {
            firstEl.focus();
            event.preventDefault();
        }
    }
}

export function resizeMessageList(event) {
    event.preventDefault();
    const sectionMessageList = document.getElementById("message-list");
    const startY = event.clientY;
    const startTopHeight = sectionMessageList.getBoundingClientRect().height;

    const minHeight = 100; // minimum height in px for sectionMessageList
    const maxHeight = window.innerHeight - 100; // maximum height

    function onMouseMove(event) {
        const deltaY = event.clientY - startY;

        let newHeight = startTopHeight + deltaY;
        // Clamp height
        newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

        sectionMessageList.style.flexBasis = `${newHeight}px`;
    }

    function onMouseUp() {
        localStorage.setItem("messageListHeight", sectionMessageList.style.flexBasis);

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
}

export function updateDate() {
    const timeElement = document.querySelector("header time");
    const now = new Date();

    timeElement.setAttribute("datetime", now.toISOString());
    const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    timeElement.textContent = now.toLocaleDateString(undefined, dateOptions);
}
