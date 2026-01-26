import { newMessage, inputHasAttachments, ulAttachmentsList, draftMessage } from "/admin/assets.php?page=js/message_pane.js";
import { queryServerDownloadAttachment } from "/admin/assets.php?page=js/backend_api.js";
import { Attachment } from "/admin/assets.php?page=js/classes.js";


export function updateAttachments(event) {
    const inputAttachments = event.currentTarget;
    const filesSelected = Array.from(inputAttachments.files);
    const insertedAttachments = [];

    filesSelected.forEach(file => {
        const attachment = new Attachment({ file });
        insertedAttachments.push(attachment);
        insertAttachmentListItem(attachment);
    }
    );
    newMessage.attachments.new = [...newMessage.attachments.new, ...insertedAttachments];
    newMessage.hasAttachments = Number(newMessage.attachments.new.length > 0 || newMessage.attachments.existing.length > 0);
    inputHasAttachments.value = newMessage.hasAttachments;
    inputAttachments.value = "";
}
export function insertAttachmentListItem(file, isReadOnly) {
    const fileName = file.name;
    const fileExt = file.extension;
    const iconClass = `bi-filetype-${fileExt}`;

    const liAttachment = document.createElement("li");
    const nodeFileName = document.createTextNode(fileName);
    const iFileTypeIcon = document.createElement("i");

    const dataSerialized = JSON.stringify(file);

    iFileTypeIcon.className = iconClass;
    liAttachment.appendChild(iFileTypeIcon);
    liAttachment.appendChild(nodeFileName);
    liAttachment.dataset.fileData = dataSerialized;
    if (isReadOnly) {
        // Provide a download capability for the attachment
        liAttachment.addEventListener("dblclick", async () => {
            try {
                const download = await queryServerDownloadAttachment(file);
                const url = URL.createObjectURL(download);
                const a = document.createElement("a");
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            } catch (error) {
                alert("Failed to download attachment. Please try again.");
            }
        });
    } else {
        // Provide a way to delete attachments added to a new message
        const buttonDelete = document.createElement("button");
        buttonDelete.className = "delete-attachment";
        buttonDelete.addEventListener("click", deleteAttachment);
        buttonDelete.title = "Delete attachment";
        buttonDelete.textContent = "✘";
        liAttachment.appendChild(buttonDelete);
    }
    ulAttachmentsList.appendChild(liAttachment);
}
export function clearAttachmentsList() {
    const liAttachments = document.querySelectorAll("#attachments-list li");
    if (liAttachments.length > 0) {
        liAttachments.forEach(li => {
            li.remove();
        });
    }
}
function deleteAttachment(event) {
    const buttonDelete = event.currentTarget;
    const liAttachment = buttonDelete.parentElement;
    const fileName = liAttachment.textContent.replace(buttonDelete.textContent, "");

    liAttachment.remove();

    const targetMessage = draftMessage ?? newMessage;

    function removeByName(arr, name) {
        const index = arr.findIndex(file => file.name === name);
        if (index !== -1) {
            return arr.splice(index, 1)[0];
        }
        return null;
    }

    let removed = removeByName(targetMessage.attachments.new, fileName);

    if (!removed) {
        removed = removeByName(targetMessage.attachments.existing, fileName);
        if (removed) {
            targetMessage.attachments.deleted.push(removed);
        }
    }
    targetMessage.hasAttachments = Number(targetMessage.attachments.new.length > 0 || targetMessage.attachments.existing.length > 0);
    inputHasAttachments.value = targetMessage.hasAttachments;
}
