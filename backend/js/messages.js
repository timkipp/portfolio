import { deleteMessages, handleMessageSelection, toggleDateGroupView } from "./ui.js";
import { allMessages, allSelectedMessages, setAllMessages, setAllSelectedMessages } from "./state.js";
import { formatDateString, getDateGroupLabel, escapeHTML } from "./utils.js";

const moveToFolderSelect = document.getElementById("move-to-folder");

export function queryDbMessages(orderBy = "sent DESC") {
    const folderSelected = parseInt(document.querySelector("#folder-view-toggle input:checked").value);
    const tbody = document.querySelector("#message-list table tbody");
    let lastDateGroupLabel = null;

    fetch("../backend/php/messages_api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "fetchMessages",
            folderView: folderSelected,
            messageSort: orderBy,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            const messages = data.messages;
            const messageCounts = data.messageCounts;

            tbody.innerHTML = "";

            messages.forEach((msg, index) => {
                const sentDateTime = msg.sent;
                const messageDate = new Date(sentDateTime);
                const dateGroupLabel = getDateGroupLabel(messageDate);

                if (orderBy === "sent DESC" || orderBy === "sent ASC") {
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
                const readStatus = msg.read ? "read-message" : "unread-message";
                tr.className = classValue.concat(" ", readStatus);
                tr.dataset.id = msg.id;
                tr.dataset.folder = msg.folder_name;
                tr.dataset.dateGroup = dateGroupLabel.toLowerCase().replaceAll(" ", "-");

                tr.innerHTML = `
                    <td class="index">${index + 1}</td>
                    <td class="read">${msg.read ? "✔" : ""}</td>
                    <td class="sent">${sentFormatted}</td>
                    <td class="name">${escapeHTML(msg.name)}</td>
                    <td class="email">${escapeHTML(msg.email)}</td>
                    <td class="message">${escapeHTML(msg.message)}</td>
                    <td class="delete-message"><img src="/images/icons/delete.png" alt="Delete this message"></td>
                `;
                tr.addEventListener("click", handleMessageSelection);
                tr.querySelector("td.read").addEventListener("click", (event) => {
                    updateDbReadStatus(event, tr);
                });
                tr.querySelector("td.delete-message").addEventListener("click", (event) => {
                    event.stopPropagation();
                    const message = event.currentTarget.closest("tr");
                    setAllSelectedMessages();
                    if (allSelectedMessages.length > 0) {
                        deleteMessages(allSelectedMessages);
                    } else {
                        deleteMessages(message);
                    }                    
                });
                tbody.appendChild(tr);
            });

            messageCounts.forEach((msgCount) => {
                const count = msgCount.message_count;
                const folderName = msgCount.folder_name;

                const spanMessageCount = document.querySelector(`#folder-view-toggle label span[data-folder='${folderName}']`);
                if (spanMessageCount) {
                    spanMessageCount.textContent = ` (${count})`;
                }
            });
        })
        .catch((err) => console.error("Error fetching messages:", err));
    setAllMessages();
}

export function updateDbDeleteMessages(messageIds) {
    fetch("../backend/php/messages_api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "deleteMessages",
            targetMessages: messageIds,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (!data.success) {
                console.error("Failed to empty folder", data);
                return;
            }
        })
        .catch((err) => console.error(err));
}

export function updateDbMessageFolder(folderId, messages) {
    fetch("../backend/php/messages_api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "updateMessageFolder",
            targetMessages: messages,
            targetFolder: folderId,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (!data.success) {
                console.error("Failed to move messages", data);
                return;
            }
        })
        .catch((err) => console.error(err));

    queryDbMessages();
}

export function updateDbReadStatus(event, message) {
    if (event) event.stopPropagation();
    console.log("Element with Event Listener:", event.currentTarget.id);
    const messageId = parseInt(message.dataset.id);
    const messageRead = message.querySelector("td.read");
    const isRead = message.classList.contains("read-message");
    const newReadStatus = !isRead; // compute the new state

    // Update the DOM
    message.classList.toggle("read-message", newReadStatus);
    message.classList.toggle("unread-message", !newReadStatus);
    messageRead.textContent = newReadStatus ? "✔" : "";

    // Send the update to the backend
    fetch("../backend/php/messages_api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "toggleReadStatus",
            id: messageId,
            readStatus: newReadStatus,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (!data.success) console.error("Failed to toggle read status", data);
        })
        .catch((err) => console.error(err));
}

export function queryDbCustomFolders() {
    const folderViewTogglesContainer = document.getElementById("folder-view-toggle");
    fetch("../backend/php/messages_api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "fetchCustomFolders" }),
    })
        .then((response) => response.json())
        .then((folders) => {
            if (folders && folders.length > 0) {
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
        })
        .catch((err) => console.error("Error fetching folders:", err));
}

export function updateDbAddFolder(folderToAdd) {
    return fetch("../backend/php/messages_api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "addNewFolder",
            folderName: folderToAdd,
            folderType: "custom",
        }),
    })
        .then((response) => response.json())
        .then((folderData) => {
            const folderId = folderData.folder_id;
            return folderId;
        });
}

export function updateDbDeleteFolder(folderId) {
    return fetch("../backend/php/messages_api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "deleteFolder",
            targetFolder: folderId,
        }),
    })
        .then((response) => response.json())
        .then((data) => data.deleted_rows);
}