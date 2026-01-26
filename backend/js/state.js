export let allMessages = null;
export let allSelectedMessages = null;

const inputToName = document.getElementById("to-name");
const inputToEmail = document.getElementById("to-email");
const inputSubject = document.getElementById("subject");
const textBody = document.getElementById("body");
let liAttachments = null;

export function setAllMessages() {
    allMessages = document.querySelectorAll("#message-list tbody tr.message-row");
}

export function setAllSelectedMessages() {
    allSelectedMessages = document.querySelectorAll("#message-list tbody tr.message-row.selected");
}

export function getMessageIds(messages) {
    messages = messages instanceof NodeList
        ? Array.from(messages)
        : Array.isArray(messages)
            ? messages
            : [messages];

    const messageIds = messages.map((message) => parseInt(message.dataset.id));

    return messageIds;
}

export function takeMessageSnapshot() {
    liAttachments = document.querySelectorAll("#attachments-list li");
    
    const messageSnapshot = {
        toName: inputToName.value,
        toEmail: inputToEmail.value,
        subject: inputSubject.value,
        body: textBody.value,
        attachments: Array.from(liAttachments).map(li => li.dataset.id)
    };

    return messageSnapshot;
}

export function messageIsModified(previousSnapshot, currentSnapshot) {

    const messageHasChanged = Object.keys(currentSnapshot).some(key => {
        const previousValue = JSON.stringify(previousSnapshot[key]);
        const currentValue = JSON.stringify(currentSnapshot[key]);
        return currentValue !== previousValue;
    });

    return messageHasChanged;
}

export function getChangedFields(previousSnapshot, currentSnapshot) {
    const changes = {};
    for (const key in currentSnapshot) {
        const previousValue = JSON.stringify(previousSnapshot[key]);
        const currentValue = JSON.stringify(currentSnapshot[key]);
        if (currentValue !== previousValue) {
            changes[key] = currentSnapshot[key]
        }
    }
    return changes;
}
