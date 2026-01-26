<?php

function fetch_messages(mysqli $conn, array $input): array 
{
    // Query 1: Get messages for the active folder view
    $folder_id = $input['folderView'];
    $sort_column_and_order = $input['messageSort'];

    $allowed_columns = ['id', 'source','has-reply', 'has-forward', 'has-attachments', 'is-read', 'folder', 'from-name', 'from-email', 'sent', 'subject', 'body'];
    $allowed_orders = ['ASC', 'DESC'];
    list($column, $order) = explode(' ', $sort_column_and_order);

    if(!in_array($column, $allowed_columns)) $column = 'sent_date';
    if(!in_array($order, $allowed_orders)) $order = 'DESC';

    if ($column === "folder") {
        $column = "folders.name";
    } else {
        $column = str_replace("-", "_", $column);
    }
    $order = strtoupper($order);

    $orderBy = "{$column} {$order}";

    $stmt = $conn->prepare("
        SELECT messages.id, source, has_reply, has_forward, has_attachments, is_read, folder_id, folders.name AS 'folder_name', sent_date, from_name, from_email, to_name, to_email, subject, body, thread_id, parent_id
        FROM messages 
        JOIN folders ON messages.folder_id = folders.id
        WHERE folder_id = ?
        ORDER BY $orderBy
    ");
    if ($stmt) {
        $stmt->bind_param("i", $folder_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if (!$result) {
            throw new Exception("Database error: " . $conn->error);
        }

        $messages = [];
        while ($row = $result->fetch_assoc()) {
            $messages[] = $row;            
        }

        $result->free();
        $stmt->close();

        // Query 2: Get attachments for messages where 'has_attachments' = true        
        $messagesWithAttachments = array_column(
            array_filter($messages, fn($msg) => $msg['has_attachments'] === 1), 
            'id'
        );
        if (!empty($messagesWithAttachments)) {
            $attachments = fetch_attachments($messagesWithAttachments);
        }
        foreach ($messages as &$message) {
            $message['attachments'] = $attachments[$message['id']] ?? [];
        }

        // Query 3: Get counts of messages for each folder
        $stmt = $conn->prepare("
            SELECT 
                f.id AS folder_id,
                f.name AS folder_name,
                f.folder_order AS folder_order,
                COUNT(m.id) AS message_count
            FROM folders AS f
            LEFT JOIN messages AS m ON m.folder_id = f.id
            GROUP BY f.id, f.name
            ORDER BY f.folder_order;
        ");
        if ($stmt) {
            $stmt->execute();
            $result = $stmt->get_result();

            $message_counts = [];
            while ($row = $result->fetch_assoc()) {
                $message_counts[] = $row;
            }

            $result->free();
            $stmt->close();
        } else {
            throw new RuntimeException($conn->error);
        }
    } else {
        throw new RuntimeException($conn->error);
    }
    return ['messages' => $messages, 'message_counts' => $message_counts];
}

function update_message_folder(mysqli $conn, array $input): array
{
    $message_ids = $input['targetMessages'];       
    if (!empty($message_ids)) {
        $folder_id = $input['targetFolder'];
        $message_count = count($message_ids);
        $placeholders = implode(",", array_fill(0, $message_count, "?"));
        $types = str_repeat("i", $message_count + 1);

        $stmt = $conn->prepare("
            UPDATE messages 
            SET folder_id = ? 
            WHERE id IN ($placeholders)
        ");
        if ($stmt) {
            $stmt->bind_param($types, $folder_id, ...$message_ids);
            $stmt->execute();
            $result = ['success' => true];

            $stmt->close();
        } else {
            throw new RuntimeException($conn->error);
        }        
    } else {        
        $result = ['success' => false, 'error' => 'No messages specified'];
    }
    return $result;
}

function toggle_read_status(mysqli $conn, array $input): array
{
    $message_id = intval($input['id'] ?? 0);
    $is_read = intval($input['readStatus']);
    if ($message_id > 0) {
        $stmt = $conn->prepare("
            UPDATE messages 
            SET `is_read` = ? 
            WHERE id = ?
        ");
        if ($stmt) {
            $stmt->bind_param("ii", $is_read, $message_id);
            $stmt->execute();
            $result = ['success' => true];
            $stmt->close();
        } else {
            throw new RuntimeException($conn->error);;
        }
    } else {
        $result = ['error' => 'Invalid message ID'];
    }
    return $result;
}

function delete_messages(mysqli $conn, array $input): array
{
    $message_ids = $input['targetMessages'];
    if (empty($message_ids)) {
        $result = ['success' => false, 'message' => 'No messages specified'];
    }
     else {
        $message_count = count($message_ids);
        $placeholders = implode(',', array_fill(0, $message_count, '?'));
        $types = str_repeat('i', $message_count);
        $stmt = $conn->prepare("
            DELETE 
            FROM messages 
            WHERE id IN ($placeholders)
        ");
        if ($stmt) {
            $stmt->bind_param($types, ...$message_ids);
            $stmt->execute();
            $deleted_message_count = $stmt->affected_rows;

            if ($deleted_message_count > 0) {
                $result = ['success' => true, 'deleted_rows' => $deleted_message_count];
            } else {
                $result = ['success' => false, 'message' => 'No rows deleted'];
            }
            $stmt->close();
        } else {
            throw new RuntimeException($conn->error);
        }        
    }
    return $result;
}

function insert_new_message(mysqli $conn, array $input): array
{
    $msg = $input['message'] ?? null;
    if ($msg) {
        $stmt = $conn->prepare("
            INSERT INTO messages
            (thread_id, parent_id, folder_id, has_attachments, has_reply, has_forward, is_read, source, sent_date, from_name, from_email, to_name, to_email, subject, body)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        if ($stmt) {
            $stmt->bind_param(
                "iiiiiiissssssss",
                $msg['threadId'],
                $msg['parentId'],
                $msg['folder_id'],
                $msg['hasAttachments'],
                $msg['hasReply'],
                $msg['hasForward'],
                $msg['isRead'],
                $msg['source'],
                $msg['fromName'],
                $msg['fromEmail'],
                $msg['toName'],
                $msg['toEmail'],
                $msg['sentDate'],
                $msg['subject'],
                $msg['body']
            );
            $stmt->execute();
            $new_message_id = $conn->insert_id;
            $stmt->close();

            $attachments = $msg['attachments']['new'];
            $attachment_ids = [];
            if (!empty($attachments)) {
                $attachment_ids = insert_new_attachments($conn, $new_message_id, $attachments);
            }
        } else {
            throw new RuntimeException($conn->error);
        }
    } else {
        throw new RuntimeException($conn->error);;
    }
    $result = [
        'success' => true,
        'message_id' => $new_message_id,
        'attachment_ids' => $attachment_ids
    ];
    return $result;
}

function update_message(mysqli $conn, $input): array
{
    $message = $input['message'] ?? null;
    $changes = $input['changes'] ?? [];
    $message_updated = false;
    $new_attachment_ids = [];
    $deleted_attachments_count = 0;

    if ($message) {
        $allowed_columns = ['has_attachments', 'from_email', 'to_name', 'to_email', 'sent_date', 'subject', 'body'];
        $set_fields = [];
        $params = [];
        $types = "";

        foreach ($changes as $field => $value) {
            if (in_array($field, $allowed_columns)) {
                $set_fields[] = "$field = ?";
                $params[] = $value;
                $types .= is_int($value) ? "i" : "s";
            }
        }

        if (empty($set_fields)) {
            return ['success' => true, 'message' => 'No changes to update'];
        }

        $message_id = $message['id'];
        $columns_and_values = implode(", ", $set_fields);
        $stmt = $conn->prepare("
            UPDATE messages
            SET $columns_and_values
            WHERE id = ?
        ");
        $params[] = $message_id;
        $types .= "i";

        if ($stmt) {
            $stmt->bind_param($types, ...$params);
            $stmt->execute();
            $stmt->close();

            $message_updated = true;
            
            $new_attachments = $message['attachments']['new'] ?? [];
            $deleted_attachments = $message['attachments']['deleted'] ?? [];

            if (!empty($new_attachments)) {
                $new_attachment_ids = insert_new_attachments($conn, $message_id, $new_attachments);
            }
            if (!empty($deleted_attachments)) {
                $deleted_attachments_count = delete_attachments($conn, $message_id, $deleted_attachments);
            }
        } else {
            throw new RuntimeException($conn->error);
        }
    } else {
        throw new RuntimeException("No message data provided");
    }
    
    $result = [
        'success' => $message_updated,
        'attachments_inserted' => $new_attachment_ids,
        'attachments_deleted' => $deleted_attachments_count
    ];
    return $result;
}