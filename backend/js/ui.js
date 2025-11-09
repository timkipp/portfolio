import { 
    DefaultFolder,
    DialogAction, 
    DialogInteraction, 
    dialog,    
} from "/admin/assets.php?page=js/backend.js";

import { 
    queryDbMessages, 
    updateDbAddFolder,
    updateDbDeleteFolder,
    updateDbDeleteMessages,
    updateDbMessageFolder,
    updateDbReadStatus 
} from "/admin/assets.php?page=js/messages.js";

import { 
    allMessages,
    allSelectedMessages,
    getMessageIds, 
    setAllMessages, 
    setAllSelectedMessages 
} from "/admin/assets.php?page=js/state.js";

import {
    formatAddress
} from "/admin/assets.php?page=js/utils.js";

const moveToFolderSelect = document.getElementById("move-to-folder");
const moveToFolderButton = document.getElementById("move-selected");
let messagesMarkedForDeletion = [];
let messagesArray = [];
let folderOptionSelected = document.getElementById("inbox");
let buttonLastColumnSorted = null;
let keyboardAnchorIndex = null;
let isKeyboardSelection = false;
let lastSelectedMessages = null;
let countOfSelected = 0;
let lastSelectedIndex = null;
let isNonContiguousSelection = false;
let oneOrMoreMessagesSelected = false;

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

export function updateFolderView(event) {
    queryDbMessages();

    const readingPane = document.getElementById("reading-pane");
    const messageDisplay = readingPane.querySelector("#message-body textarea");
    readingPane.dataset.id = "";
    messageDisplay.value = "";
    const messagesCaption = document.querySelector("#message-list table caption");
    
    let folderInputSelected = null;    
    if(event === undefined) {
        folderInputSelected = document.querySelector("#folder-view-toggle input:checked");
    } else {
        folderInputSelected = event.target;
    }
        
    const isDefaultFolder = folderInputSelected.classList.contains("default-folder");
    const folderViewSelected = folderInputSelected.nextElementSibling.childNodes[0].nodeValue.trim();
    const buttonDeleteFolder = document.getElementById("delete-folder");

    messagesCaption.innerText = "Messages: " + folderViewSelected;

    const folderDropdownOption = document.querySelector(`#folder-options select option[data-folder="${folderViewSelected}"]`);
    folderDropdownOption.disabled = true;
    folderOptionSelected.disabled = false;
    folderOptionSelected = folderDropdownOption;
    const firstEnabledOption = Array.from(moveToFolderSelect.options).find((opt) => !opt.disabled);
    if (firstEnabledOption) {
        moveToFolderSelect.value = firstEnabledOption.value;
    }
    buttonDeleteFolder.disabled = isDefaultFolder;
}

export function addCustomFolder() {
    const interaction = dialog.returnValue
    if (interaction === DialogInteraction.INPUT) {
        const sectionAddFolder = document.getElementById("add-new-folder");
        sectionAddFolder.style.display = "block";
        const executeButton = document.getElementById("execute-dialog-action");
        executeButton.value = DialogAction.ADD_FOLDER;
        executeButton.textContent = "Create Folder";
        const cancelButton = document.getElementById("cancel-dialog-action");
        cancelButton.style.display = "block"
        dialog.showModal();
    } else {
        const folderName = document.getElementById("new-folder-name").value.trim();

        if (folderName) {
            updateDbAddFolder(folderName).then((newFolderId) => {
                const deletedFolderOption = document.getElementById("deleted");
                const newFolderOption = document.createElement("option");
                const optionId = folderName.replace(/\s+/g, "-").toLowerCase();
                newFolderOption.id = optionId;
                newFolderOption.value = newFolderId;
                newFolderOption.dataset.folder = folderName;
                newFolderOption.textContent = folderName;
                deletedFolderOption.before(newFolderOption);
                moveToFolderSelect.value = newFolderId;

                const folderButtonLabel = document.createElement("label");
                const inputId = "view".concat("-", optionId);
                folderButtonLabel.className = "toggle-button";
                folderButtonLabel.setAttribute("for", inputId);
                folderButtonLabel.dataset.folder = folderName;
                folderButtonLabel.innerText = folderName;

                const folderButtonInput = document.createElement("input");
                folderButtonInput.id = inputId;
                folderButtonInput.className = "custom-folder";
                folderButtonInput.setAttribute("type", "radio");
                folderButtonInput.setAttribute("name", "folder_view");
                folderButtonInput.value = newFolderId;

                deletedFolderButtonInput = document.querySelector("#folder-view-toggle #view-deleted");
                deletedFolderButtonInput.before(folderButtonInput, folderButtonLabel);
            });
        }
    }
}

export function deleteCustomFolder() {
    document.getElementById("add-new-folder").style.display = "none";
    let action = dialog.returnValue;
    let inputFolderSelected = document.querySelector("#folder-view-toggle input:checked");
    const folderName = inputFolderSelected.dataset.folder;
    const folderId = parseInt(inputFolderSelected.value);
    const executeButton = document.getElementById("execute-dialog-action");
    let messageCount = 0;
    setAllMessages();
    messageCount = allMessages.length
    if (action === DialogInteraction.CONFIRM) {        
        const messageCountText = messageCount + " message" + (messageCount > 1 ? "s" : "");
        let confirmationPrompt = "";
        if (messageCount > 0) {
            confirmationPrompt = `Deleting this folder will delete ${messageCountText} currently in the ${folderName} folder.<br><br>Are you sure you want to delete this folder and its messages?`
        } else {
            confirmationPrompt = `Are you sure you want to delete the ${folderName} folder?`
        }
        const dialogPrompt = document.getElementById("dialog-prompt");                
        dialogPrompt.innerHTML = confirmationPrompt;
        executeButton.textContent = "Delete Folder";
        executeButton.disabled = false;
        executeButton.value = DialogAction.DELETE_FOLDER;
        dialog.showModal();
        document.getElementById("cancel-dialog-action").focus();
    } else {  
        action = executeButton.value;
        if (action === DialogAction.DELETE_FOLDER) {
            if (messageCount > 0) {
                deleteMessages(allMessages);
            }
            if (folderId > DefaultFolder.ARCHIVED) {
                updateDbDeleteFolder(folderId).then((deletedCount) => {
                    if (deletedCount > 0) {
                        const labelFolderSelected = inputFolderSelected.nextElementSibling;
                        inputFolderSelected.remove();
                        labelFolderSelected.remove();

                        inputFolderSelected = document.getElementById("view-inbox");
                        inputFolderSelected.checked = true;
                        queryDbMessages();
                    }
                });
            }
        }        
    }    
}

export function moveMessagesToFolder(targetFolder, messages) {
    const inputChecked = document.querySelector("#folder-view-toggle input:checked")
    const currentFolder = parseInt(inputChecked.value);
    const currentFolderIsDeleted = currentFolder === DefaultFolder.DELETED;
    const targetFolderIsDeleted = targetFolder === DefaultFolder.DELETED;
    
    if (currentFolderIsDeleted && targetFolderIsDeleted) {
        deleteMessages(messages);
    } else {
        const messageIds = getMessageIds(messages);
        updateDbMessageFolder(targetFolder, messageIds);
    }
}

export function deleteMessages(messages) { 
    let messageIds = [];
    if (messages === undefined) {
        messageIds = messagesMarkedForDeletion;
    } else {
        messageIds = getMessageIds(messages)
        messagesMarkedForDeletion = messageIds;
    }        
    const currentFolderView = document.querySelector("#folder-view-toggle input:checked").dataset.folder;
    const permanentlyDeleteMessages = currentFolderView === "Deleted";
    const messageCount = messageIds.length + " message" + (messageIds.length === 1 ? "" : "s");
    
    if (permanentlyDeleteMessages) {      
        const dialog = document.querySelector("dialog");
        const sectionAddNewFolder = dialog.querySelector("section#add-new-folder");
        sectionAddNewFolder.style.display = "none";
        
        const promptForConfirmation = dialog.returnValue === "";
        const actionCancelled = dialog.returnValue === "cancel"
        const buttonExecute = dialog.querySelector("button#execute-dialog-action");
        const buttonCancel = dialog.querySelector("button#cancel-dialog-action");
        const communication = document.getElementById("dialog-prompt");
        let focusCancelButton = false;

        sectionAddNewFolder.style.display = "none";

        if (promptForConfirmation) {
            const prompt = `You are about to permanently delete ${messageCount}.<br><br>Click 'Delete' to confirm deletion or 'cancel' to abort.`           
            communication.innerHTML = prompt;
            buttonExecute.value = DialogAction.DELETE_MESSAGES;
            buttonExecute.disabled = false;
            buttonExecute.textContent = "Delete";
            buttonCancel.style.display = "inline";
            focusCancelButton = true;
        } else {     
            let acknowledgement       
            if (actionCancelled) {
                acknowledgement = "No messages will be deleted."
                communication.textContent = acknowledgement
                buttonExecute.textContent = "OK";
                buttonExecute.value = DialogInteraction.CLOSE;
                buttonCancel.style.display = "none";
            } else {
                updateDbDeleteMessages(messageIds).then((messagesDeletedCount) => {
                    messageCountText = messagesDeletedCount + " message" + (messagesDeletedCount === 1 ? "" : "s");
                    acknowledgement = `${messageCountText} have been deleted.`
                    communication.textContent = acknowledgement;
                    buttonExecute.value = DialogInteraction.ACKNOWLEDGE;
                });
            }
        }          
        dialog.showModal();
        if (focusCancelButton) {
            buttonCancel.focus();
        }
        
    } else {
        updateDbMessageFolder(DefaultFolder.DELETED, messageIds);
    }
}

export function toggleColumnSort(event) {
    const headerClicked = event.currentTarget;
    let sortButton = headerClicked.querySelector("button.sort-on");

    if (sortButton === null) {
        // header not currently sorted clicked
        sortButton = headerClicked.querySelector("button.sort-asc");
    } else {
        // header currently sorted clicked
        // Get the other sort button of the header clicked
        sortButton = headerClicked.querySelector("button:not(.sort-on)");

        // Get the button of the last column  that was sorted and remove the 'sort-on' class
        buttonLastColumnSorted = document.querySelector("#message-list th button.sort-on");
        if (buttonLastColumnSorted) {
            buttonLastColumnSorted.classList.remove("sort-on");
        }
    }

    if (sortButton === buttonLastColumnSorted) return;

    const columnSorted = headerClicked.classList.contains("index") ? "id" : headerClicked.classList[1];
    const sortOrder = sortButton.classList.contains("sort-asc") ? "ASC" : "DESC";
    const sortBy = columnSorted + " " + sortOrder;

    sortButton.classList.add("sort-on");

    queryDbMessages(sortBy);

    buttonLastColumnSorted = sortButton;
}

export function toggleDateGroupView(event) {
    const buttonExpandCollapse = event.currentTarget;
    const trSubheader = buttonExpandCollapse.closest("tr");
    const dateGroup = trSubheader.dataset.dateGroup;
    const trDateGroup = document.querySelectorAll(`#message-list table tr.message-row[data-date-group='${dateGroup}']`);
    const imgRightChevron = buttonExpandCollapse.firstElementChild;

    trDateGroup.forEach((tr) => {
        tr.classList.toggle("collapsed");
    });

    imgRightChevron.classList.toggle("collapsed");
}

export function handleMessagesTableKeyEvents(event) {
    const keyInput = event.key.toLowerCase();
    if (event.type === "keyup") {
        if (keyInput === "Shift") {
            keyboardAnchorIndex = null;
        }
    } else {      
        switch (keyInput) {
            case "a":
                const focusedElement = document.activeElement
                const tbodyFocused = focusedElement.matches("tbody");
                const elementId = focusedElement.id;
                const tbodyIdMatches = elementId === "messages"
                const messagesTableFocused = tbodyFocused && tbodyIdMatches;
                if (messagesTableFocused) {
                    const ctrlOrCmdKeyDown = event.ctrlKey || event.metaKey
                    if (ctrlOrCmdKeyDown) {
                        event.preventDefault();
                        setAllMessages();
                        allMessages.forEach(msg => {
                            msg.classList.add("selected");
                        });
                    }
                }
                break;

            case "delete":
                setAllSelectedMessages();
                if (allSelectedMessages.length > 0) {
                    deleteMessages(allSelectedMessages);
                }
                break;

            case "arrowdown":
            case "arrowup":
                const isArrowDown = event.key === "ArrowDown";
                const isArrowUp = event.key === "ArrowUp";
                if (isArrowDown || isArrowUp) {
                    isKeyboardSelection = true;
                    messagesArray = Array.from(document.querySelectorAll("#message-list tbody tr.message-row"));
                    if (messagesArray.length === 0) return;

                    const currentIndex = lastSelectedIndex === null ? 0 : lastSelectedIndex;

                    if (!event.shiftKey || keyboardAnchorIndex === null) {
                        keyboardAnchorIndex = currentIndex;
                    }

                    let newIndex = null;

                    if (isArrowDown) {
                        newIndex = Math.min(currentIndex + 1, messagesArray.length - 1);
                    } else if (isArrowUp) {
                        newIndex = Math.max(currentIndex - 1, 0);
                    } else {
                        return;
                    }

                    event.preventDefault();
                    const rowToSelect = messagesArray[newIndex];
                    const messageEvent = {
                        currentTarget: rowToSelect,
                        shiftKey: event.shiftKey,
                        ctrlKey: event.ctrlKey,
                        anchorIndex: keyboardAnchorIndex,
                    };
                    handleMessageSelection(messageEvent);

                    lastSelectedIndex = newIndex;
                    isKeyboardSelection = false;
                }
                break;
        }
    }
}

export function handleMessageSelection(event) {
    // console.log("Message selected!");
    const messageSelected = event.currentTarget;

    if (lastSelectedMessages) {
        lastSelectedMessages.forEach((msg) => {
            const isRead = msg.classList.contains("read-message");
            if (!isRead) {
                updateDbReadStatus(event, msg);
            }
        });
    }

    messagesArray = Array.from(document.querySelectorAll("#message-list tbody tr.message-row"));
    const currentSelectedIndex = messagesArray.indexOf(messageSelected);

    setAllSelectedMessages();
    countOfSelected = allSelectedMessages.length;
    if (countOfSelected > 0) {
        oneOrMoreMessagesSelected = true;
        if (event.shiftKey) {
            toggleContiguousSelection(messageSelected, currentSelectedIndex);
        } else if (event.ctrlKey) {
            toggleNonContiguousSelection(messageSelected, currentSelectedIndex);
        } else {
            toggleSingleSelection(messageSelected, currentSelectedIndex);
        }
    } else {
        toggleSingleSelection(messageSelected, currentSelectedIndex);
    }

    lastSelectedMessages = new Set(document.querySelectorAll("#message-list tbody tr.message-row.selected"));
    setAllMessages();
    setAllSelectedMessages();
    countOfSelected = allSelectedMessages.length;
    document.getElementById("move-to-folder").disabled = countOfSelected === 0;
    document.getElementById("move-selected").disabled = countOfSelected === 0;
    document.getElementById("reply").disabled = countOfSelected === 0;
    document.getElementById("forward").disabled = countOfSelected === 0;
}

export function toggleContiguousSelection(message, messageIndex) {
    if (!isNonContiguousSelection) {
        deselectSelectedMessages();
    }

    const startIndex = isKeyboardSelection ? keyboardAnchorIndex : lastSelectedIndex;
    const [start, end] = [startIndex, messageIndex].sort((a, b) => a - b);
    for (let i = start; i <= end; i++) {
        messagesArray[i].classList.add("selected");
    }
    isNonContiguousSelection = false;
    populateReadingPane(message);
}

export function toggleNonContiguousSelection(message, messageIndex) {
    message.classList.toggle("selected");
    const isSelected = message.classList.contains("selected");
    if (isSelected) {
        isNonContiguousSelection = true;
        lastSelectedIndex = messageIndex;
        populateReadingPane(message);
    } else {
        const selectedMessages = document.querySelectorAll("#message-list tbody tr.message-row.selected");
        if (selectedMessages && selectedMessages.length > 0) {
            const messageSelected = selectedMessages[0];
            populateReadingPane(messageSelected);
        } else {
            clearReadingPane();
        }
    }
}

export function toggleSingleSelection(message, messageIndex) {
    const isSelected = message.classList.contains("selected");
    const deselectMessage = isSelected && countOfSelected === 1;

    if (oneOrMoreMessagesSelected) {
        deselectSelectedMessages();

        if (deselectMessage) {
            message.classList.remove("selected");
            lastSelectedIndex = messageIndex;
            clearReadingPane();            
        } else {
            message.classList.add("selected");
            lastSelectedIndex = messageIndex;
        }
    }
    if (!isSelected) {
        message.classList.add("selected");
        lastSelectedIndex = messageIndex;
        populateReadingPane(message);
    }
    isNonContiguousSelection = false;
}
export function deselectSelectedMessages() {
    setAllSelectedMessages();
    allSelectedMessages.forEach((msg) => {
        msg.classList.remove("selected");
    });
    moveToFolderSelect.disabled = true;
    moveToFolderButton.disabled = true;
    
    clearReadingPane();
}

export function populateReadingPane(selectedMessage) {
    const readingPane = document.getElementById("reading-pane");
    const selectedMessagePopulated = readingPane.dataset.id === selectedMessage.dataset.id;
    const isInViewMode = readingPane.classList.contains("view-mode");
    if (selectedMessagePopulated && isInViewMode) return;

    readingPane.dataset.id = selectedMessage.dataset.id;
    
    const [
        inputFromName, inputFromEmail, inputToName, inputToEmail, inputSent, inputSubject, textBody
    ] = document.querySelectorAll("#from-name, #from-email, #to-name, #to-email, #sent, #subject, #body");
    
    const tdTo = selectedMessage.querySelector(".to");
    const tdFrom = selectedMessage.querySelector(".from");
    const tdSent = selectedMessage.querySelector(".sent");
    const tdSubject = selectedMessage.querySelector(".subject");
    const tdBody = selectedMessage.querySelector(".body");
    
    const fromName = tdFrom.dataset.fromName;
    const fromNameIsEmpty = fromName === "";
    let fromEmail = tdFrom.dataset.fromEmail;
    fromEmail = (fromNameIsEmpty ? "" : "<") + fromEmail + (fromNameIsEmpty ? "" : ">");
    const toName = tdTo.dataset.toName;
    const toNameIsEmpty = toName === "";
    let toEmail = tdTo.dataset.toEmail;
    toEmail = (toNameIsEmpty ? "" : "<") + toEmail + (toNameIsEmpty ? "" : ">");

    // const fromValue = formatAddress(fromName, fromEmail);
    // const toValue = formatAddress(toName, toEmail);
    const sentValue = tdSent.textContent;
    const subjectValue = tdSubject.textContent
    const bodyValue = tdBody.innerHTML.replace(/<br\s*\/?>/gi, "\n")

    const inputMapping = new Map([
        [inputFromName, fromName], 
        [inputFromEmail, fromEmail], 
        [inputToName, toName], 
        [inputToEmail, toEmail]
    ]);

    for (const [input, value] of inputMapping) {
        const valueLength = value.length;
        // input.size = valueLength;
        if (valueLength === 0) {
            input.style.display = "none"
        } else {
            input.style.width = `${Math.max(valueLength, 1)}ch`;
            input.value = value;
        }        
    }

    inputSent.value = sentValue;
    inputSubject.value = subjectValue;
    textBody.value = bodyValue;
}

export function clearReadingPane() {
    const readingPane = document.getElementById("reading-pane");
    readingPane.dataset.id = "";
    const readingPaneFields = readingPane.querySelectorAll("form input, form textarea:read-only");
    readingPaneFields.forEach(field => {
        field.value = "";
    })
}

export function handleResponseAction(event) { 
    const [
        readingPane, inputName, inputEmail, divSentField, divSubjectField, inputSubject, 
        buttonReply, buttonForward, buttonSend, buttonCancel, textMessageBody
    ] = document.querySelectorAll("#reading-pane, #name, #email, #sent-field, #subject-field, #subject, #reply, #forward, #send-message, #cancel-message, #body");

    readingPane.classList.remove("view-mode");
    readingPane.classList.add("response-mode");

    const buttonClicked = event.currentTarget;
    const isSendingMessage = buttonClicked.id === "send-message";
    const isCancelMessage = buttonClicked.id === "cancel-message";
    const isForwardMessage = buttonClicked.id === "forward";
    let displayStyle = "";

    if (isSendingMessage) {

    }

    [divSentField, buttonReply, buttonForward].forEach(element => {
        displayStyle = isCancelMessage
            ? element.matches("div") ? "flex" : "inline"
            : "none";
        element.style.display = displayStyle;
    })
    
    let formElements = [divSubjectField, buttonSend, buttonCancel];
    formElements.forEach(element => {
        displayStyle = isCancelMessage
            ? "none"
            : element.matches("div") ? "flex" : "inline";        
        element.style.display = displayStyle;
    })
    
    formElements = [inputName, inputEmail, textMessageBody];
    formElements.forEach(element => {
        element.readOnly = element === textMessageBody ? isCancelMessage : !isForwardMessage;
    })

    if (isCancelMessage) {
        const selectedMessageId = document.getElementById("reading-pane").dataset.id;
        const selectedMessage = document.querySelector(`#messages tr[data-id='${selectedMessageId}']`);
        populateReadingPane(selectedMessage);
        readingPane.classList.remove("response-mode");
        readingPane.classList.add("view-mode");
    }   else {
        if (isForwardMessage) {
            inputName.value = "";
            inputEmail.value = ""
            inputSubject.value = "FW: "
        } else {
            inputSubject.value = "RE: "
        }    
        
        const [origMsgSender, origMsgEmail, origMsgText] = [inputName.value, inputEmail.value, textMessageBody.value];
        const messageHeaderData = ["\n", "—————————— Original Message ——————————", "Name:  " + origMsgSender, "Email:  " + origMsgEmail, "", origMsgText];
        const origMsgMessageHeader = messageHeaderData.join("\n");

        textMessageBody.value = origMsgMessageHeader;
        textMessageBody.focus();
        textMessageBody.setSelectionRange(0, 0);
        if (isForwardMessage) {
            inputName.focus();
        } else {
            inputSubject.focus();
        }
    } 
}

export function enableSendButton() {
    
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
