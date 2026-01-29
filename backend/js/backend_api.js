export async function queryDbMessages(orderBy = "sent_date DESC") {
    const folderSelected = parseInt(document.querySelector("#folder-view-toggle input:checked").value);

    try {
        const response = await fetch("/admin/backend.php?page=db_api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "fetch messages",
                folderView: folderSelected,
                messageSort: orderBy,
            }),
        });

        const text = await response.text(); // read raw text first
        let data = null;

        try {
            data = JSON.parse(text); // attempt to parse JSON
        } catch (jsonErr) {
            console.error("Failed to parse JSON from backend:", text, jsonErr);
            return null;
        }

        // Validate structure
        if (!data || !data.messages || !Array.isArray(data.messages)) {
            console.error("Backend returned unexpected data structure:", data);
            return null;
        }

        return {
            messages: data.messages,
            messageCounts: data.messageCounts
        };
    } catch (err) {
        console.error("Error fetching messages:", err);
    }
}

export async function updateDbAddMessage(message) {
    try {
        const response = await fetch("/admin/backend.php?page=db_api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                action: "insert new message",
                message: { ...message }
            }),
        });
        const data = await response.json();
        
        const messageId = data.message_id;
        const attachmentIds = data.attachment_ids;

        return {
            messageId: data.message_id, 
            attachmentIds: data.attachment_ids
        };
    } catch (error) {
        console.error("Error inserting message: ", error);
        throw error;
    }
}

export function updateDbUpdateMessage(message, updates) {
    return fetch("/admin/backend.php?page=db_api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            action: "update message",
            message: { ...message },
            changes: { ... updates },
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        
    })
    .catch((error) => {
        console.error("Error inserting message: ", error);
    })
}

export function updateDbDeleteMessages(messageIds) {
    fetch("/admin/backend.php?page=db_api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "delete messages",
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
    fetch("/admin/backend.php?page=db_api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "update message folder",
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

export async function updateDbReadStatus(messageId, readStatus) {
    // Send the update to the backend
    fetch("/admin/backend.php?page=db_api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "toggle read status",
            id: messageId,
            readStatus: readStatus,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data.success) console.error("Failed to toggle is-read status", data);
    })
    .catch((err) => console.error(err));
}

export async function queryDbCustomFolders() {    
    try {
        const response = await fetch("/admin/backend.php?page=db_api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "fetch custom folders" }),
        })

        const folders = await response.json();
        return folders;

    } catch (err) {
        console.error("Error fetching folders:", err);
        return [];
    }
}

export function updateDbAddFolder(folderToAdd) {
    return fetch("/admin/backend.php?page=db_api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "add new folder",
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
    return fetch("/admin/backend.php?page=db_api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "delete folder",
            targetFolder: folderId,
        }),
    })
    .then((response) => response.json())
    .then((data) => data.deleted_rows);
}

export async function updateServerSyncAttachments(messageId, attachmentsToAdd, attachmentsToDelete) {
    const formData = new FormData();

    formData.append("action", "sync server attachments");
    attachmentsToAdd.forEach((attachment, index) => {
        formData.append(`file_${index}`, attachment.file);
    })
    formData.append("delete", JSON.stringify(attachmentsToDelete || []));

    try {
        const response = await fetch("/admin/backend.php?page=db_api", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!data.success) throw new Error(data.error || "Failed to upload attachments");

        const attachmentsData = {
            uploadedFilePaths: data.uploaded_files,
            deletedFiles: data.deleted_files
        }
        return attachmentsData;

    } catch (error) {
        console.error("Error uploading attachments: ", error);
        throw error;
    }
}

export async function queryServerDownloadAttachment(file) {
    try {
        const response = await fetch("/admin/backend.php?page=db_api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "serve attachment",
                fileId: file.id
            }),
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const blob = await response.blob();
        return blob;

    } catch (error) {
        console.error(error);
        alert("Failed to download attachment. Please try again");
    }
}

export async function updateDbLogVisitor() {

}

export async function queryDbVisitors() {
    
}