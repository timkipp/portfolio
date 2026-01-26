<?php

function sync_server_attachments()
{
    $upload_dir = __DIR__ . '/../../attachments/';

    $file_paths = [];
    $failed_uploads = [];

    foreach ($_FILES as $file) {
        $tmp_name = $file['tmp_name'];
        $original_name = basename($file['name']);
        $target_path = $upload_dir . $original_name;

        if (move_uploaded_file($tmp_name, $target_path)) {
            $file_paths[] = "backend/attachments/" . $original_name;
        } else {
            $failed_uploads[] = $original_name;
        }
    }

    $files_to_delete = json_decode($_POST['delete'] ?? '[]', true);
    $deleted_files = [];
    $failed_deletions = [];

    foreach ($files_to_delete as $file_name) {
        $file_path = $upload_dir . basename($file_name);
        if (file_exists($file_path)) {
            if (unlink($file_path)) {
                $deleted_files[] = $file_name;
            } else {
                $failed_deletions[] = $file_name;
            }
        }
    }

    $result = [
        'success' => true,
        'uploaded_files' => $file_paths,
        'files_not_uploaded' => $failed_uploads,
        'deleted_files' => $deleted_files,
        'files_not_deleted' => $failed_deletions
    ];

    return $result;
}

function serve_attachment(array $attachment): void
{
    $file_name = $attachment['file_name'];
    $file_path = $attachment['file_path'];
    $mime_type = $attachment['mime_type'];

    header('Content-Description: File Transfer');
    header('Content-Type: ' . $mime_type);
    header('Content-Disposition: attachment; filename="' . basename($file_name) . '"');
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file_path));

    ob_clean();
    flush();
    readfile($file_path);
    exit;
}

function fetch_attachment(mysqli $conn, int $id): array
{
    $stmt = $conn->prepare("
        SELECT id, file_name, file_path, mime_type
        FROM attachments
        WHERE id = ?
    ");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $attachment = $result->fetch_assoc();
    $stmt->close();

    return $attachment;
}

function fetch_attachments(array $messages): array 
{
    $conn = get_connection();

    $id_column = array_column($messages, 'id');
    $message_ids = implode(',', array_map('intval', $id_column));

    $sql = "
        SELECT id, message_id AS message_id, file_name AS name, file_path AS path, mime_type AS type, file_extension AS extension, file_size AS size, last_modified AS last_modified
        FROM attachments
        WHERE message_id IN ($message_ids)
        ORDER BY id
    ";
    $result = $conn->query($sql);
    $attachments = [];
    if ($result) {            
        while ($row = $result->fetch_assoc()) {
            $attachments[$row['message_id']][] = $row;
        }
        $result->free();
    } else {
        throw new RuntimeException($conn->error);
    }
    
    return $attachments;
}

function insert_new_attachments(mysqli $conn, int $message_id, array $attachments): array
{
    $attachment_ids = [];

    foreach ($attachments as $attach) {
        $file_name = $attach['name'];
        $file_path = $attach['path'];
        $mime_type = $attach['type'];
        $extension = $attach['extension'];
        $file_size = $attach['size'];
        $last_modified = date('Y-m-d H:i:s', $attach['lastModified'] / 1000);
        
        $stmt = $conn->prepare("
            INSERT INTO attachments
            (message_id, file_name, file_path, mime_type, file_extension, file_size, last_modified)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        if ($stmt) {
            $stmt->bind_param(
                "issssis",
                $message_id,
                $file_name,
                $file_path,
                $mime_type,
                $extension,
                $file_size,
                $last_modified
            );
            $stmt->execute();
            $attachment_ids[] = $conn->insert_id;
            $stmt->close();
        } else {
            throw new RuntimeException($conn->error);
        }
    }
    return attachment_ids;
}

function delete_attachments(mysqli $conn, int $message_id, array $attachments): int 
{
    $types = "i";
    $attachment_ids = [];
    $placeholders = [];
    foreach ($attachments as $attach) {
        $attachment_ids[] = $attach['id'];
        $placeholders[] = "?";
    }
    $attach_placeholders = implode(", ", $placeholders);
    $stmt = $conn->prepare("
        DELETE FROM attachments
        WHERE message_id = ? AND id IN ($attach_placeholders);
    ");
    if ($stmt) {
        $types = str_repeat("i", count($attachment_ids)) . "i";
        $stmt->bind_param($types, $message_id, ...$attachment_ids);
        $stmt->execute();
        $deleted_attachment_count = $stmt->affected_rows;
        $stmt->close();
    } else {
        throw new RuntimeException($conn->error);
    }
    return $deleted_attachment_count;
}