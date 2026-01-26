export class Message {
    constructor(source) {
        this.id = 0;
        this.threadId = null;
        this.parentId = null;
        this.folderId = null;
        this.hasReply = 0;
        this.hasForward = 0;
        this.hasAttachments = 0;
        this.attachments = { new: [], existing: [], deleted: [] };
        this.isRead = 0;
        this.source = "";
        this.sentDate = null;
        this.fromName = "";
        this.fromEmail = "";
        this.toName = "";
        this.toEmail = "";
        this.subject = "";
        this.body = "";

        if (!source) return;

        if (source instanceof HTMLTableRowElement) {
            const attachmentsData = source.querySelector("td.has-attachments").dataset.attachments;
            
            this.id = Number(source.dataset.id);
            this.threadId = Number(source.dataset.threadId);
            this.parentId = Number(source.dataset.parentId);
            this.folderId = Number(source.querySelector("td.folder").dataset.value);
            this.hasReply = Number(source.querySelector("td.has-reply").dataset.value);
            this.hasForward = Number(source.querySelector("td.has-forward").dataset.value);
            this.hasAttachments = Number(source.querySelector("td.has-attachments").dataset.value)
            this.attachments.existing = attachmentsData ? JSON.parse(attachmentsData) : [];
            this.isRead = Number(source.querySelector("td.is-read").dataset.value);
            this.source = source.querySelector("td.source").dataset.value;
            this.sentDate = source.querySelector("td.sent-date").textContent;
            this.fromName = source.querySelector("td.from").dataset.fromName;
            this.fromEmail = source.querySelector("td.from").dataset.fromEmail;
            this.toName = source.querySelector("td.to").dataset.toName;
            this.toEmail = source.querySelector("td.to").dataset.toEmail;
            this.subject = source.querySelector("td.subject").textContent;
            this.body = source.querySelector("td.body").innerHTML.replace(/<br\s*\/?>/gi, "\n");
        } else if (source instanceof HTMLFormElement) {
            this.id = Number(source.querySelector("#id").value);
            this.threadId = Number(source.querySelector("#thread-id").value);
            this.parentId = Number(source.querySelector("#parent-id").value);
            this.folderId = Number(source.querySelector("#folder-id").value);
            this.hasReply = Number(source.querySelector("#has-reply").value);
            this.hasForward = Number(source.querySelector("#has-forward").value);
            this.hasAttachments = Number(source.querySelector("#source"));
            this.source = source.querySelector("#source").value;
            this.isRead = Number(source.querySelector("#is-read").value);
            this.sentDate = source.querySelector("#sent-date").value;
            this.fromName = source.querySelector("#from-name").value;
            this.fromEmail = source.querySelector("#from-email").value;
            this.toName = source.querySelector("#to-name").value;
            this.toEmail = source.querySelector("#to-email").value;
            this.subject = source.querySelector("#subject").value;
            this.body = source.querySelector("#body").value;
        } else if (typeof source === "object") {
            Object.assign(this, source);
        }
    }
}

export class Attachment {
    constructor({
        id = null,
        messageId = null,
        file = null,
        name = "",
        path = "",
        type = "",
        extension = "",
        size = 0,
        lastModified = null
    } = {}) {
        this.id = id;
        this.messageId = messageId;
        this.file = file;
        this.name = name || (file ? file.name : "");
        this.path = path;
        this.type = type || (file ? file.type : "");
        this.extension = extension || this.getExtension(this.name);
        this.size = size || (file ? file.size : 0);
        this.lastModified = lastModified || (file ? file.lastModified : null);
    }

    getExtension(filename) {
        const parts = filename.split(".");
        return parts.length > 1 ? parts.pop().toLowerCase() : "";
    }
}