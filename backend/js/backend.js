import { 
    queryDbCustomFolders, 
    queryDbMessages,      
} from "./messages.js";
import { allMessages, allSelectedMessages, setAllMessages, setAllSelectedMessages } from "./state.js";

import { 
    addCustomFolder,
    cycleThroughDialogControls,
    deleteCustomFolder,
    deleteMessages, 
    deselectSelectedMessages, 
    handleDialogClose,
    handleMessagesTableKeyEvents, 
    handleResponseAction,
    moveMessagesToFolder,
    resizeMessageList, 
    toggleColumnSort, 
    updateDate, 
    updateFolderView
} from "./ui.js";

export const dialog = document.getElementsByTagName("dialog")[0];
export const sectionAddFolder = document.getElementById("add-new-folder");
export const pPrompt = document.getElementById("pPrompt");
export const pInformation = document.getElementById("information");
export const executeButton = document.getElementById("execute");
export const cancelButton = document.getElementById("cancel");

export const DefaultFolder = Object.freeze({
    INBOX: 1,
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
    
    const divFolderViewToggle = document.getElementById("folder-view-toggle");
    const divDivider = document.getElementById("divider");
    
    const thMessageHeaders = sectionMessageList.querySelectorAll("table th.message-header");
    const tbodyMessages = sectionMessageList.querySelector("tbody");

    const inputNewFolderName = document.getElementById("new-folder-name");
    
    const selectMoveToFolder = document.getElementById("move-to-folder");
    
    const buttonCancelMessage = document.getElementById("cancel-message")
    const buttonDeleteFolder = document.getElementById("delete-folder");
    const buttonEmptyFolder = document.getElementById("empty-folder");
    const buttonExecuteDialogAction = document.getElementById("execute-dialog-action");
    const buttonForward = document.getElementById("forward")
    const buttonLogout = document.getElementById("logout");
    const buttonMoveSelected = document.getElementById("move-selected");
    const buttonNewFolder = document.getElementById("new-folder");
    const buttonRefresh = document.getElementById("refresh");
    const buttonReply = document.getElementById("reply")
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
    queryDbCustomFolders();

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
    queryDbMessages();
    buttonRefresh.addEventListener("click", () => {
        queryDbMessages();
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
    tbodyMessages.addEventListener("keydown", handleMessagesTableKeyEvents);
    sectionMessageList.addEventListener("click", (event) => {
        if (!event.target.closest("table")) {
            deselectSelectedMessages();
        }
    });
    // Message Reply/Forward
    [buttonReply, buttonForward, buttonCancelMessage].forEach(button => {
        button.addEventListener("click", handleResponseAction)
    })    

    // Sort Messages
    thMessageHeaders.forEach((th) => {
        th.addEventListener("click", toggleColumnSort);
    });

    // -----------------------
    //       UI HANDLING 
    // -----------------------
    buttonLogout.addEventListener("click", function () {
        window.location.href = "php/logout.php";
    });

    updateDate();

    const savedHeight = localStorage.getItem("messageListHeight");
    if (savedHeight) {
        sectionMessageList.style.flexBasis = savedHeight;
    }

    divDivider.addEventListener("mousedown", resizeMessageList);
}