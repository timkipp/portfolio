export let allMessages = null;
export let allSelectedMessages = null;

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
