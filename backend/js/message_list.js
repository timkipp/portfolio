import { DefaultFolder, DialogAction, DialogInteraction } from "/admin/assets.php?page=js/dashboard.js";
import { moveToFolderSelect, moveToFolderButton } from "/admin/assets.php?page=js/ui.js";
import { populateMessagePane, clearMessagePane } from "/admin/assets.php?page=js/message_pane.js";
import { 
    queryDbMessages, 
    updateDbDeleteMessages, 
    updateDbMessageFolder, 
    updateDbReadStatus 
} from "/admin/assets.php?page=js/backend_api.js";

import { 
    allMessages, 
    allSelectedMessages,
    getMessageIds, 
    setAllMessages,
    setAllSelectedMessages 
} from "/admin/assets.php?page=js/state.js";

import { 
    escapeHTML, 
    formatDateString, 
    getDateGroupLabel
} from "/admin/assets.php?page=js/utils.js";

let messagesArray = [];
let messagesMarkedForDeletion = [];
let buttonLastColumnSorted = null;
let keyboardAnchorIndex = null;
let isKeyboardSelection = false;
let lastSelectedMessages = null;
let countOfSelected = 0;
let lastSelectedIndex = null;
let isNonContiguousSelection = false;
let oneOrMoreMessagesSelected = false;

export async function populateMessageTable(orderBy = "sent_date DESC") {
    const data = await queryDbMessages(orderBy);
    if (!data) return;

    const { messages, messageCounts } = data;
    const tbody = document.querySelector("#message-list table tbody");
    tbody.innerHTML = "";
    let lastDateGroupLabel = null;

    messages.forEach((msg, index) => {
        const sentDateTime = msg.sent_date;
        const messageDate = new Date(sentDateTime);
        const dateGroupLabel = getDateGroupLabel(messageDate);

        if (orderBy === "sent_date DESC" || orderBy === "sent_date ASC") {
            if (dateGroupLabel !== lastDateGroupLabel) {
                const columnCount = document.querySelectorAll("#message-list thead th").length;
                const trSubheader = document.createElement("tr");
                trSubheader.classList.add("subheader-row");
                trSubheader.dataset.dateGroup = dateGroupLabel.toLowerCase().replaceAll(" ", "-");

                const buttonExpandCollapse = document.createElement("button");
                buttonExpandCollapse.type = "button";
                buttonExpandCollapse.classList.add("expand-collapse");
                buttonExpandCollapse.addEventListener("click", toggleDateGroupView);

                const imgRightChevron = document.createElement("img");
                imgRightChevron.src = "/images/icons/right_chevron.png";
                imgRightChevron.alt = "expand-collapse button";
                buttonExpandCollapse.appendChild(imgRightChevron);

                const tdGroupHeader = document.createElement("td");
                tdGroupHeader.colSpan = columnCount;
                tdGroupHeader.classList.add("date-group-header");
                tdGroupHeader.textContent = dateGroupLabel;
                tdGroupHeader.insertBefore(buttonExpandCollapse, tdGroupHeader.firstChild);

                trSubheader.appendChild(tdGroupHeader);
                tbody.appendChild(trSubheader);

                lastDateGroupLabel = dateGroupLabel;
            }
        }

        const sentFormatted = formatDateString(sentDateTime);
        const tr = document.createElement("tr");
        const classValue = "message-row";
        const readStatus = msg.is_read ? "read-message" : "unread-message";

        tr.className = `${classValue} ${readStatus}`;
        tr.dataset.id = msg.id;
        tr.dataset.threadId = msg.thread_id;
        tr.dataset.parentId = msg.parent_id;
        tr.dataset.dateGroup = dateGroupLabel.toLowerCase().replaceAll(" ", "-");

        const from = msg.from_name || msg.from_email;
        const to = msg.to_name || msg.to_email;
        const hasReply = msg.has_reply ? `<img src="/images/icons/has_reply.png" alt="Message has reply">` : "";
        const hasForward = msg.has_forward ? `<img src="/images/icons/has_forward.png" alt="Message has forward">` : "";
        const hasAttachments = msg.has_attachments ? `<img src="/images/icons/has_attachments.png" alt="Message has attachments">` : "";
        const attachments = JSON.stringify(msg.attachments);

        tr.innerHTML = `
            <td class="index">${index + 1}</td>
            <td class="source" data-value="${msg.source}"><img src="/images/icons/${msg.source}.png" alt="Message is from ${msg.source}"></td>
            <td class="has-reply" data-value="${msg.has_reply}">${hasReply}</td>
            <td class="has-forward" data-value="${msg.has_forward}">${hasForward}</td>
            <td class="has-attachments" data-value="${msg.has_attachments}" data-attachments="${attachments}">${hasAttachments}</td>
            <td class="is-read" data-value="${msg.is_read}">${msg.is_read ? "✔" : ""}</td>
            <td class="folder" data-value="${msg.folder_id}">${msg.folder_name}</td>
            <td class="sent-date">${sentFormatted}</td>
            <td class="from" data-from-name='${msg.from_name}' data-from-email='${msg.from_email}'>${escapeHTML(from)}</td>
            <td class="to" data-to-name='${msg.to_name}' data-to-email='${msg.to_email}'>${escapeHTML(to)}</td>
            <td class="subject">${escapeHTML(msg.subject)}</td>
            <td class="body">${escapeHTML(msg.body)}</td>
            <td class="delete-message"><img src="/images/icons/delete.png" alt="Delete this message"></td>
        `;

        tr.addEventListener("click", handleMessageSelection);
        tr.querySelector("td.is-read").addEventListener("click", (event) => updateDbReadStatus(event, tr));
        tr.querySelector("td.delete-message").addEventListener("click", (event) => {
            event.stopPropagation();
            setAllSelectedMessages();
            deleteMessages(allSelectedMessages.length > 0 ? allSelectedMessages : event.currentTarget.closest("tr"));
        });

        tbody.appendChild(tr);
    });

    messageCounts.forEach((msgCount) => {
        const spanMessageCount = document.querySelector(`#folder-view-toggle label span[data-folder='${msgCount.folder_name}']`);
        if (spanMessageCount) spanMessageCount.textContent = ` (${msgCount.message_count})`;
    });
    
    setAllMessages();
}

export function moveMessagesToFolder(targetFolder, messages) {
    const inputChecked = document.querySelector("#folder-view-toggle input:checked");
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
        messageIds = getMessageIds(messages);
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
        const actionCancelled = dialog.returnValue === "cancel";
        const buttonExecute = dialog.querySelector("button#execute-dialog-action");
        const buttonCancel = dialog.querySelector("button#cancel-dialog-action");
        const communication = document.getElementById("dialog-prompt");
        let focusCancelButton = false;

        sectionAddNewFolder.style.display = "none";

        if (promptForConfirmation) {
            const prompt = `You are about to permanently delete ${messageCount}.<br><br>Click 'Delete' to confirm deletion or 'cancel' to abort.`;
            communication.innerHTML = prompt;
            buttonExecute.value = DialogAction.DELETE_MESSAGES;
            buttonExecute.disabled = false;
            buttonExecute.textContent = "Delete";
            buttonCancel.style.display = "inline";
            focusCancelButton = true;
        } else {
            let acknowledgement;
            if (actionCancelled) {
                acknowledgement = "No messages will be deleted.";
                communication.textContent = acknowledgement;
                buttonExecute.textContent = "OK";
                buttonExecute.value = DialogInteraction.CLOSE;
                buttonCancel.style.display = "none";
            } else {
                updateDbDeleteMessages(messageIds).then((messagesDeletedCount) => {
                    messageCountText = messagesDeletedCount + " message" + (messagesDeletedCount === 1 ? "" : "s");
                    acknowledgement = `${messageCountText} have been deleted.`;
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

    populateMessageTable(sortBy);

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
                const focusedElement = document.activeElement;
                const tbodyFocused = focusedElement.matches("tbody");
                const elementId = focusedElement.id;
                const tbodyIdMatches = elementId === "messages";
                const messagesTableFocused = tbodyFocused && tbodyIdMatches;
                if (messagesTableFocused) {
                    const ctrlOrCmdKeyDown = event.ctrlKey || event.metaKey;
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

export async function handleMessageSelection(event) {
    const messageSelected = event.currentTarget;

    if (lastSelectedMessages) {
        lastSelectedMessages.forEach(async (msg) => {
            const isRead = msg.classList.contains("read-message");
            if (!isRead) {
                event.stopPropagation();
                const messageId = parseInt(message.dataset.id);
                const messageRead = message.querySelector("td.is-read");
                const isRead = message.classList.contains("read-message");
                const newReadStatus = !isRead; // compute the new state

                // Update the DOM
                message.classList.toggle("read-message", newReadStatus);
                message.classList.toggle("unread-message", !newReadStatus);
                messageRead.textContent = newReadStatus ? "✔" : "";
                await updateDbReadStatus(messageId, newReadStatus);        
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
    document.getElementById("reply-message").disabled = countOfSelected === 0;
    document.getElementById("forward-message").disabled = countOfSelected === 0;
}

export function toggleContiguousSelection(messageRow, messageIndex) {
    if (!isNonContiguousSelection) {
        deselectSelectedMessages();
    }

    const startIndex = isKeyboardSelection ? keyboardAnchorIndex : lastSelectedIndex;
    const [start, end] = [startIndex, messageIndex].sort((a, b) => a - b);
    for (let i = start; i <= end; i++) {
        messagesArray[i].classList.add("selected");
    }
    isNonContiguousSelection = false;
    populateMessagePane(messageRow);
}

export function toggleNonContiguousSelection(messageRow, messageIndex) {
    messageRow.classList.toggle("selected");
    const isSelected = messageRow.classList.contains("selected");
    if (isSelected) {
        isNonContiguousSelection = true;
        lastSelectedIndex = messageIndex;
        populateMessagePane(messageRow);
    } else {
        const selectedMessages = document.querySelectorAll("#message-list tbody tr.message-row.selected");
        if (selectedMessages && selectedMessages.length > 0) {
            const messageSelected = selectedMessages[0];
            populateMessagePane(messageSelected);
        } else {
            clearMessagePane();
        }
    }
}

export function toggleSingleSelection(messageRow, messageIndex) {
    const isSelected = messageRow.classList.contains("selected");
    const deselectMessage = isSelected && countOfSelected === 1;

    if (oneOrMoreMessagesSelected) {
        deselectSelectedMessages();

        if (deselectMessage) {
            messageRow.classList.remove("selected");
            lastSelectedIndex = messageIndex;
            clearMessagePane();
        } else {
            messageRow.classList.add("selected");
            lastSelectedIndex = messageIndex;
        }
    }
    if (!isSelected) {
        messageRow.classList.add("selected");
        lastSelectedIndex = messageIndex;
        populateMessagePane(messageRow);
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

    clearMessagePane();
}
