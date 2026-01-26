import { 
    cycleThroughDialogControls,
    handleDialogClose,
    resizeMessageList, 
    updateDate
} from "/admin/assets.php?page=js/ui.js";

import { 
    addCustomFolder,
    deleteCustomFolder,
    displayCustomFolders,
    updateFolderView
} from "/admin/assets.php?page=js/folders.js";

import { 
    deleteMessages, 
    deselectSelectedMessages, 
    handleMessagesTableKeyEvents, 
    moveMessagesToFolder,
    populateMessageTable,
    toggleColumnSort,
} from "/admin/assets.php?page=js/message_list.js";

import { 
    handleMessageAction,
    toggleSaveButton,
    toggleSendButton,
} from "/admin/assets.php?page=js/message_pane.js";

import {
    updateAttachments
} from "/admin/assets.php?page=js/message_attachments.js"

import { 
    allMessages, 
    allSelectedMessages, 
    setAllMessages, 
    setAllSelectedMessages
 } from "/admin/assets.php?page=js/state.js";

export const dialog = document.getElementsByTagName("dialog")[0];
// export const sectionAddFolder = document.getElementById("add-new-folder");
// export const pPrompt = document.getElementById("dialog-prompt");
// export const pInformation = document.getElementById("information");
// export const executeButton = document.getElementById("execute-dialog-action");
// export const cancelButton = document.getElementById("cancel");

export const DefaultFolder = Object.freeze({
    INBOX: 1,
    DRAFTS: 8,
    SENT: 9,
    DELETED: 2,
    ARCHIVED: 3
})

export const DialogAction = Object.freeze({
    ADD_FOLDER: "add-folder",
    DELETE_FOLDER: "delete-folder",
    DELETE_MESSAGES: "delete-messages",
    EMPTY_FOLDER: "empty-folder",
});

export const DialogInteraction = Object.freeze({
    INPUT: "input",
    CONFIRM: "confirm",
    ACKNOWLEDGE: "acknowledge",
    CANCEL: "cancel",
    CLOSE: "close"
});

document.addEventListener("DOMContentLoaded", initializeBackend);

function initializeBackend() {
    const sectionMessageList = document.getElementById("message-list");
    const sectionMessagePane = document.getElementById("message-pane");
    
    const divFolderViewToggle = document.getElementById("folder-view-toggle");
    const divDivider = document.getElementById("divider");
    
    const ulAttachmentsList = document.getElementById("attachments-list");

    const thMessageHeaders = sectionMessageList.querySelectorAll("table th.message-header");
    const tbodyMessages = sectionMessageList.querySelector("tbody");

    const formMessagePane = sectionMessagePane.querySelector("form");
    const nonEmailFormFields = formMessagePane.querySelectorAll("input:not(input.email-field), textarea");
    const emailFormFields = formMessagePane.querySelectorAll("input.email-field");

    const inputNewFolderName = document.getElementById("new-folder-name");
    const inputAttachments = document.getElementById("attachments");
    
    const selectMoveToFolder = document.getElementById("move-to-folder");
    
    const buttonCancelMessage = document.getElementById("cancel-close-message")
    const buttonDeleteFolder = document.getElementById("delete-folder");
    const buttonEmptyFolder = document.getElementById("empty-folder");
    const buttonExecuteDialogAction = document.getElementById("execute-dialog-action");
    const buttonForward = document.getElementById("forward-message")
    const buttonLogout = document.getElementById("logout");
    const buttonMoveSelected = document.getElementById("move-selected");
    const buttonNewFolder = document.getElementById("new-folder");
    const buttonNewMessage = document.getElementById("new-message");
    const buttonRefresh = document.getElementById("refresh");
    const buttonReply = document.getElementById("reply-message")
    const buttonSaveDraft = document.getElementById("save-draft")
    const buttonSendMessage = document.getElementById("send-message")

    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    // -------------------------------
    //       DIALOG BOX HANDLING 
    // -------------------------------
    dialog.addEventListener("close", handleDialogClose);
    inputNewFolderName.addEventListener("input", () => {
        buttonExecuteDialogAction.disabled = inputNewFolderName.value.trim() === "";
    });
    dialog.addEventListener('keydown', cycleThroughDialogControls);

    // ---------------------------
    //       FOLDER HANDLING 
    // ---------------------------
    displayCustomFolders();

    divFolderViewToggle.addEventListener("change", updateFolderView);
    buttonNewFolder.addEventListener("click", () => {        
        dialog.returnValue = DialogInteraction.INPUT;
        addCustomFolder();
    });    
    buttonDeleteFolder.addEventListener("click", () => {
        dialog.returnValue = DialogInteraction.CONFIRM;
        deleteCustomFolder();
    });

    // -----------------------------
    //       MESSAGE HANDLING 
    // -----------------------------
    // Message Retrieval
    populateMessageTable();
    buttonRefresh.addEventListener("click", () => {
        populateMessageTable();
    });

    // Message Move & Deletion
    selectMoveToFolder.addEventListener("click", (event) => event.stopPropagation());
    buttonMoveSelected.addEventListener("click", (event) => {
        setAllSelectedMessages();
        const targetFolderId = parseInt(selectMoveToFolder.value);
        moveMessagesToFolder(targetFolderId, allSelectedMessages);
    });
    buttonEmptyFolder.addEventListener("click", (event) => {
        setAllMessages();
        deleteMessages(allMessages);
    });    
    // Message Selection & Deletion
    tbodyMessages.addEventListener("keydown", handleMessagesTableKeyEvents);
    tbodyMessages.addEventListener("keyup", handleMessagesTableKeyEvents);
    sectionMessageList.addEventListener("click", (event) => {
        if (!event.target.closest("table")) {
            deselectSelectedMessages();
        }
    });
    // Message Reply/Forward    
    [buttonNewMessage, buttonReply, buttonForward, buttonSendMessage, buttonSaveDraft, buttonCancelMessage].forEach(button => {
        button.addEventListener("click", handleMessageAction)
    })
    inputAttachments.addEventListener("change", updateAttachments);

    // Sort Messages
    thMessageHeaders.forEach((th) => {
        th.addEventListener("click", toggleColumnSort);
    });

    // -----------------------
    //       UI HANDLING 
    // -----------------------
    buttonLogout.addEventListener("click", function () {
        window.location.href = "backend.php?page=logout";
    });

    updateDate();

    const savedHeight = localStorage.getItem("messageListHeight");
    if (savedHeight) {
        sectionMessageList.style.flexBasis = savedHeight;
    }

    divDivider.addEventListener("mousedown", resizeMessageList);

    // When the Message Pane is in "action-mode", prevent tabbing outside of the form
    formMessagePane.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
            let formControls = Array.from(formMessagePane.querySelectorAll("[tabindex]:not([readonly])"))
            formControls = formControls.filter(element => element.offsetParent !== null);
            formControls.sort((a, b) => a.tabIndex - b.tabIndex);

            if (formControls.length) {
                const firstControl = formControls[0];
                const lastControl = formControls[formControls.length - 1];
                if (!event.shiftKey && document.activeElement === lastControl) {
                    event.preventDefault();
                    firstControl.focus();
                } else if (event.shiftKey && document.activeElement === firstControl) {
                    event.preventDefault();
                    lastControl.focus();
                }
            }
        }
    });

    // Toggle Save/Send buttons disabled attribute
    nonEmailFormFields.forEach(field => {
        field.addEventListener("input", toggleSaveButton);
    });
    emailFormFields.forEach(field => {
        field.addEventListener("blur", toggleSendButton);
    });
    const attachmentsObserver = new MutationObserver(toggleSaveButton);
    attachmentsObserver.observe(ulAttachmentsList, { childList: true });
}