import { moveToFolderSelect } from "/admin/assets.php?page=js/ui.js";
import { deleteMessages, populateMessageTable } from "/admin/assets.php?page=js/message_list.js";
import {
    DefaultFolder,
    DialogAction,
    DialogInteraction,
    dialog
} from "/admin/assets.php?page=js/dashboard.js";

import {
    queryDbCustomFolders,
    updateDbAddFolder,
    updateDbDeleteFolder
} from "/admin/assets.php?page=js/backend_api.js";

import {
    allMessages, 
    allSelectedMessages, 
    setAllMessages
} from "/admin/assets.php?page=js/state.js";

let folderOptionSelected = document.getElementById("inbox");

export async function displayCustomFolders() {    
    const folders = await queryDbCustomFolders();

    if (folders && folders.length > 0) {
        const folderViewTogglesContainer = document.getElementById("folder-view-toggle");
        const deleteFolderOption = moveToFolderSelect.querySelector("#deleted");

        folders.forEach((folder) => {
            const folderName = folder.name;
            const folderType = folder.type;
            const folderId = folder.id;
            const messageCount = folder.message_count;
            const newFolderOption = document.createElement("option");
            const optionId = folderName.replaceAll(" ", "-").toLowerCase();
            newFolderOption.value = folderId;
            newFolderOption.id = optionId;
            newFolderOption.dataset.folder = folderName;
            newFolderOption.textContent = folderName;
            moveToFolderSelect.insertBefore(newFolderOption, deleteFolderOption);
            moveToFolderSelect.value = newFolderOption.value;

            const folderButtonLabel = document.createElement("label");
            const inputId = "view".concat("-", optionId);
            folderButtonLabel.className = "toggle-button";
            folderButtonLabel.setAttribute("for", inputId);
            folderButtonLabel.innerText = folderName;

            const spanMessageCount = document.createElement("span");
            spanMessageCount.classList.add("message-count");
            spanMessageCount.dataset.folder = folderName;
            spanMessageCount.innerText = ` (${messageCount})`;

            folderButtonLabel.append(spanMessageCount);

            const folderButtonInput = document.createElement("input");
            folderButtonInput.id = inputId;
            folderButtonInput.className = folderType + "-folder";
            folderButtonInput.dataset.folder = folderName;
            folderButtonInput.value = folderId;
            folderButtonInput.setAttribute("type", "radio");
            folderButtonInput.setAttribute("name", "folder_view");

            const toggleButtonControl = document.createDocumentFragment(folderButtonLabel, folderButtonInput);
            toggleButtonControl.append(folderButtonInput);
            toggleButtonControl.append(folderButtonLabel);
            const inputDeletedFolder = document.getElementById("view-deleted");
            folderViewTogglesContainer.insertBefore(toggleButtonControl, inputDeletedFolder);
            setAllSelectedMessages();
            moveToFolderSelect.disabled = allSelectedMessages.length === 0;
        });
    }
}

export function updateFolderView(event) {
    populateMessageTable();

    const messagePane = document.getElementById("message-pane");
    const messageDisplay = messagePane.querySelector("#message-body textarea");
    messagePane.dataset.messageId = "";
    messageDisplay.value = "";
    const messagesCaption = document.querySelector("#message-list table caption");

    let folderInputSelected = null;
    if (event === undefined) {
        folderInputSelected = document.querySelector("#folder-view-toggle input:checked");
    } else {
        folderInputSelected = event.target;
    }
    const folderId = Number(folderInputSelected.value);
    const isDefaultFolder = folderInputSelected.classList.contains("default-folder");
    const isDraftsFolder = folderId === DefaultFolder.DRAFTS;
    const folderViewSelected = folderInputSelected.nextElementSibling.childNodes[0].nodeValue.trim();
    const buttonDeleteFolder = document.getElementById("delete-folder");
    const selectMoveToFolder = document.getElementById("move-to-folder");
    const buttonMoveSelected = document.getElementById("move-selected");
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
    selectMoveToFolder.disabled = isDraftsFolder;
    buttonMoveSelected.disabled = isDraftsFolder;
}

export function addCustomFolder() {
    const interaction = dialog.returnValue;
    if (interaction === DialogInteraction.INPUT) {
        const sectionAddFolder = document.getElementById("add-new-folder");
        sectionAddFolder.style.display = "block";
        const executeButton = document.getElementById("execute-dialog-action");
        executeButton.value = DialogAction.ADD_FOLDER;
        executeButton.textContent = "Create Folder";
        const cancelButton = document.getElementById("cancel-dialog-action");
        cancelButton.style.display = "block";
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
    messageCount = allMessages.length;
    if (action === DialogInteraction.CONFIRM) {
        const messageCountText = messageCount + " message" + (messageCount > 1 ? "s" : "");
        let confirmationPrompt = "";
        if (messageCount > 0) {
            confirmationPrompt = `Deleting this folder will delete ${messageCountText} currently in the ${folderName} folder.<br><br>Are you sure you want to delete this folder and its messages?`;
        } else {
            confirmationPrompt = `Are you sure you want to delete the ${folderName} folder?`;
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
                        populateMessageTable();
                    }
                });
            }
        }
    }
}
