import { DefaultFolder } from "/admin/assets.php?page=js/dashboard.js";
import { updateDbAddMessage, updateDbUpdateMessage, updateServerSyncAttachments } from "/admin/assets.php?page=js/backend_api.js";
import { insertAttachmentListItem, clearAttachmentsList } from "/admin/assets.php?page=js/message_attachments.js";
import { getSubject, setMessageBody, updateInputWidths } from "/admin/assets.php?page=js/utils.js";
import { takeMessageSnapshot, messageIsModified } from "/admin/assets.php?page=js/state.js";
import { Message } from "/admin/assets.php?page=js/classes.js";

export const inputHasAttachments = document.getElementById("has-attachments");
export const ulAttachmentsList = document.getElementById("attachments-list");
export let newMessage = {};
export let draftMessage = null;

const messagePane = document.getElementById("message-pane");
const formMessage = document.getElementById("message");
const inputId = document.getElementById("id");
const inputThreadId = document.getElementById("thread-id");
const inputParentId = document.getElementById("parent-id");
const inputSource = document.getElementById("source");
const inputHasReply = document.getElementById("has-reply");
const inputHasForward = document.getElementById("has-forward");
const inputIsRead = document.getElementById("is-read");
const inputFolderId = document.getElementById("folder-id");
const inputFromName = document.getElementById("from-name");
const inputFromEmail = document.getElementById("from-email");
const spanFromEmailDisplay = inputFromEmail.previousElementSibling;
const inputToName = document.getElementById("to-name");
const inputToEmail = document.getElementById("to-email");
const spanToEmailDisplay = inputToEmail.previousElementSibling;
const inputSentDate = document.getElementById("sent-date");
const inputSubject = document.getElementById("subject");
const textBody = document.getElementById("body");
const buttonSend = document.getElementById("send-message");
const buttonSave = document.getElementById("save-draft");
const buttonCancel = document.getElementById("cancel-close-message");
const editableFields = [];
const readOnlyFields = [];
const fitToContent = true;
const fitToContainer = !fitToContent;
let selectedMessage = null;
let currentMessageSnapshot = {};

export function populateMessagePane(messageRowSelected) {
    const messagePane = document.getElementById("message-pane");
    const selectedMessagePopulated = messagePane.dataset.messageId === messageRowSelected.dataset.id;
    const isInViewMode = messagePane.classList.contains("view-mode");
    if (selectedMessagePopulated && isInViewMode) return;

    messagePane.dataset.messageId = messageRowSelected.dataset.id;

    selectedMessage = new Message(messageRowSelected);

    const inputs = new Map([
        [inputId, selectedMessage.id],
        [inputThreadId, selectedMessage.threadId],
        [inputParentId, selectedMessage.parentId],
        [inputSource, selectedMessage.source],
        [inputFolderId, selectedMessage.folderId],
        [inputHasReply, selectedMessage.hasReply],
        [inputHasForward, selectedMessage.hasForward],
        [inputHasAttachments, selectedMessage.hasAttachments],
        [inputIsRead, selectedMessage.isRead],
        [inputSentDate, selectedMessage.sentDate],
        [inputSubject, selectedMessage.subject],
        [textBody, selectedMessage.body]
    ])

    for (const [input, value] of inputs) {
        input.value = value;
    }

    const inputsSenderRecipient = new Map([
        [inputFromName, selectedMessage.fromName],
        [inputFromEmail, selectedMessage.fromEmail],
        [inputToName, selectedMessage.toName],
        [inputToEmail, selectedMessage.toEmail]
    ]);

    for (const [input, value] of inputsSenderRecipient) {
        const valueLength = value.length;
        if (valueLength === 0) {
            input.classList.add("empty");
        } else {
            input.classList.remove("empty");
            input.style.width = `${Math.max(valueLength, 1)}ch`;
            input.value = value;
        }

        if (input.classList.contains("email-field")) {
            const inputSpan = input.previousElementSibling;
            inputSpan.textContent = value;
        }
    }

    if (selectedMessage.hasAttachments === 1) {
        ulAttachmentsList.classList.remove("empty");
        selectedMessage.existingAttachments.forEach(attachment => insertAttachmentListItem(attachment));
    } else {
        ulAttachmentsList.classList.add("empty");
    }
}

export function clearMessagePane() {
    const messagePane = document.getElementById("message-pane");
    messagePane.dataset.messageId = "";
    const messagePaneFields = messagePane.querySelectorAll("form input, form .display-email, form textarea");
    messagePaneFields.forEach(field => {
        if (field.matches("span")) {
            field.textContent = "";
        } else {
            field.value = "";
        }
    });
    clearAttachmentsList();
}

export function toggleSaveButton() {
    const buttonSave = document.getElementById("save-draft");
    const previousMessageSnapshot = currentMessageSnapshot;
    currentMessageSnapshot = takeMessageSnapshot();
    const hasUserInput = messageIsModified(previousMessageSnapshot, currentMessageSnapshot);

    buttonSave.disabled = !hasUserInput;
}

export function toggleSendButton() {
    const buttonSave = document.getElementById("save-draft");
    const buttonSend = document.getElementById("send-message");
    const localPart = "(?!\\.)(?!.*\\.\\.)[a-zA-Z0-9._-]+(?<!\\.)";
    const domainPart = "[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
    const singleEmail = `${localPart}@${domainPart}`;
    const emailPattern = new RegExp(`^${singleEmail}(?:[\\s,;]+${singleEmail})*$`);
    const emailFields = Array.from(document.querySelectorAll("#message-pane form input.email-field:not([readonly])"));

    let allFieldsValid = true;

    emailFields.forEach(field => {
        const value = field.value.trim();

        if (value === "" || !emailPattern.test(value)) {
            field.setCustomValidity("Please enter valid email address(es).");
            allFieldsValid = false;
        } else {
            field.setCustomValidity(""); // clear previous message
        }

        // Optionally trigger the browser to show message if user tries to submit
        field.reportValidity();
    });

    const saveButtonEnabled = !buttonSave.disabled;
    buttonSend.disabled = !allFieldsValid || !saveButtonEnabled;
}

export async function handleMessageAction(event) {
    const buttonClicked = event.currentTarget;    
    const isSendingMessage = buttonClicked.id === "send-message";
    const isSavingDraft = buttonClicked.id === "save-draft";
    const messageIsSelected = messagePane.dataset.messageId != 0;
    const actionClass = buttonClicked.className;
    const mode = actionClass === "primary-action" ? "action-mode" : "view-mode";
    const action = mode === "action-mode" ? buttonClicked.id : "";
    let selectedMessageId = null;
    let selectedMessageRow = null;
    let fieldToFocus = null;
    let beginMessageDraft = false;

    editableFields.length = 0;
    readOnlyFields.length = 0;

    if (messageIsSelected) {
        selectedMessageId = messagePane.dataset.messageId;
        selectedMessageRow = document.querySelector(`#message-list tr[data-id="${selectedMessageId}"]`);
    }

    // Toggle readonly property, set field values, determine which field to focus
    switch (action) {
        case "new-message":
            initiateNewMessage();
            fieldToFocus = inputToName;
            beginMessageDraft = true;
            break;
            
        case "reply-message":
            initiateReplyMessage(selectedMessageId, selectedMessageRow);
            fieldToFocus = textBody;
            beginMessageDraft = true;
            break;
            
        case "forward-message":
            initiateForwardMessage(selectedMessageId, selectedMessageRow);
            fieldToFocus = inputToName;
            beginMessageDraft = true;
            break;

        default:
            let resetMessagePane = false
            if (isSendingMessage || isSavingDraft) {
                const messageAction = isSendingMessage ? "Sending" : "Saving";
                resetMessagePane = processMessageDraft(messageAction);
            } else {
                // Cancel/Close Button clicked
                resetMessagePane = true;
            }

            if (resetMessagePane) {
                readOnlyFields.push(inputToName, inputToEmail, inputSubject, textBody);
                clearAttachmentsList();
                if (messageIsSelected) {
                    populateMessagePane(selectedMessageRow);
                } else {                    
                    clearMessagePane();
                    selectedMessage = null;
                }
                buttonSend.disabled = true;
                buttonSave.disabled = true;
                messagePane.classList.remove("action-mode");
                messagePane.classList.add("view-mode");
            }
    }

    editableFields.forEach(field => { 
        field.readOnly = false;
    });
    readOnlyFields.forEach(field => {
        field.readOnly = true;        
    });

    // Update mode/action classes
    messagePane.className = "";
    messagePane.className = mode.concat(" ", action).trim();

    if (beginMessageDraft) {
        newMessage = new Message(formMessage);
        if (buttonClicked === "forward-message") {
            newMessage.attachments.existing = selectedMessage.attachments.existing;
        }
    }

    // Set focus on the appropriate field
    if (fieldToFocus) {
        fieldToFocus.focus()
    };
}

function initiateNewMessage() {
    messagePane.dataset.messageId = messagePane.dataset.messageId || 0;
    inputId.value = "";
    inputThreadId.value = ""
    inputParentId.value = ""
    inputFolderId.value = DefaultFolder.DRAFTS;
    inputSource.value = "email";
    inputIsRead.value = 0;
    inputHasAttachments.value = 0;
    inputHasReply.value = 0;
    inputHasForward.value = 0;
    inputFromName.value = "Tim Kipp";
    inputFromName.classList.remove("empty");
    inputFromEmail.value = "me@timothyscottkipp.com";
    spanFromEmailDisplay.textContent = inputFromEmail.value;
    editableFields.push(inputToName, inputToEmail, inputSubject, textBody);
    editableFields.forEach(field => { field.value = ""; });
    updateInputWidths(fitToContent, inputFromName, inputFromEmail);
    updateInputWidths(fitToContainer, inputToName, inputToEmail);

    currentMessageSnapshot = takeMessageSnapshot();
}

function initiateReplyMessage(messageId, messageRow) {
    inputId.value = "";
    inputThreadId.value = messageRow.dataset.threadId;
    inputParentId.value = messageId;
    inputFolderId.value = DefaultFolder.DRAFTS;
    inputSource.value = messageRow.querySelector("td.source").dataset.value;
    inputIsRead.value = 0;
    inputHasAttachments.value = 0;
    inputHasReply.value = 0;
    inputHasForward.value = 0;
    setMessageBody(inputFromName.value, inputFromEmail.value, inputToName.value, inputToEmail.value, inputSentDate.value, inputSubject.value);
    editableFields.push(inputSubject, textBody);
    readOnlyFields.push(inputToName, inputToEmail);
    const namesAndEmails = [[inputFromName, inputToName], [inputFromEmail, inputToEmail]];
    namesAndEmails.forEach(([fromField, toField]) => {
        [fromField.value, toField.value] = [toField.value, fromField.value];
    });
    const inputNames = [inputFromName, inputToName];
    inputNames.forEach(input => {
        if (input.value === "") {
            input.classList.add("empty");
        } else {
            input.classList.remove("empty");
        }
    });
    spanFromEmailDisplay.textContent = inputFromEmail.value;
    spanToEmailDisplay.textContent = inputToEmail.value;
    inputSubject.value = getSubject("replay-message");
    updateInputWidths(fitToContent, inputFromName, inputFromEmail, inputToName, inputToEmail);

    currentMessageSnapshot = takeMessageSnapshot();
}

function initiateForwardMessage(messageId, messageRow)  {
    inputId.value = "";
    inputThreadId.value = messageRow.dataset.threadId;
    inputParentId.value = messageId;
    inputFolderId.value = DefaultFolder.DRAFTS;
    inputSource.value = messageRow.querySelector("td.source").dataset.value;
    inputIsRead.value = messageRow.querySelector("td.is-read").dataset.value;
    inputHasAttachments.value = selectedMessage.attachments.existing.length > 0;
    inputHasReply.value = "";
    inputHasForward.value = "";
    setMessageBody(inputFromName.value, inputFromEmail.value, inputToName.value, inputToEmail.value, inputSentDate.value, inputSubject.value);
    editableFields.push(inputToName, inputToEmail, inputSubject, textBody);
    [inputFromName.value, inputFromEmail.value] = [inputToName.value, inputToEmail.value];
    if (inputFromName.value === "") {
        inputFromName.classList.add("empty");
    } else {
        inputFromName.classList.remove("empty");
    }
    [inputToName.value, inputToEmail.value] = ["", ""];
    spanFromEmailDisplay.textContent = inputFromEmail.value;
    spanToEmailDisplay.textContent = "";
    inputSubject.value = getSubject("forward-message");
    updateInputWidths(fitToContent, inputFromName, inputFromEmail);
    updateInputWidths(fitToContainer, inputToName, inputToEmail);

    currentMessageSnapshot = takeMessageSnapshot();
}

async function processMessageDraft(sendMessage) {
    let resetMessagePane = false;
    let isInitialDraft = false;

    // CODE LOGIC TO PREPARE FOR CALLS TO 'backend_api.js'
    const messageId = messagePane.dataset.messageId;
    isInitialDraft = messageId == 0;

    function updateAttachmentPaths(message, filePaths) {
        filePaths.forEach((filePath, index) => {
            message.attachments.new[index].path = filePath;
        })
    }

    if (isInitialDraft) {
        if (newMessage.attachments.new.length > 0) {
            // Upload attachments
            const attachmentFiles = await updateServerSyncAttachments(newMessage.id, newMessage.attachments.new, null);
            updateAttachmentPaths(newMessage, attachmentFiles.uploadedFilePaths);

            // Add message and its attachments to the database
            const { messageId, attachmentIds } = await updateDbAddMessage(newMessage);

            // Update attachments with ids
            newMessage.attachments.new.forEach((attachment, index) => {
                attachment.messageId = messageId
                attachment.id = attachmentIds[index];
            })
            newMessage.attachments.existing.push(...newMessage.attachments.new);
            newMessage.attachments.new = [];
            buttonCancel.innerText = "Close";
        }
    } else {
        // Determine what fields have been changed
        const previousMessageSnapshot = currentMessageSnapshot;
        currentMessageSnapshot = takeMessageSnapshot();
        const updatedFields = getChangedFields(previousMessageSnapshot, currentMessageSnapshot);
        
        // Upload any new attachments to the server and remove any deleted attachments from the server
        if ("attachments" in updatedFields) {
            let newAttachments = null;
            let deletedAttachments = null;
            if (draftMessage.attachments.new.length > 0) {
                newAttachments = draftMessage.attachments.new;
            }
            if (draftMessage.attachments.deleted.length > 0) {
                deletedAttachments = draftMessage.attachments.deleted;
            }
            const attachmentFiles = await updateServerSyncAttachments(draftMessage.id, newAttachments, deletedAttachments);
            if (newAttachments !== null) {
                updateAttachmentPaths(draftMessage, attachmentFiles.uploadedFilePaths);
            }
        }

        // Update the messages table with the new message data and add/delete attachments from the attachments table
        updateDbUpdateMessage(draftMessage, updatedFields);
    }
    if (newMessage !== null) {
        draftMessage = newMessage;
        newMessage = null;
    }

    if (sendMessage) {
        // Call to email_api.php
        

        draftMessage = null;
        resetMessagePane = true;

    } else {
        
    }
    return resetMessagePane;
}