<?php 

function fetch_custom_folders(mysqli $conn) {
    $stmt = $conn->prepare("
        SELECT folders.id, folders.name, folders.type, COUNT(messages.id) AS message_count
        FROM folders
        LEFT JOIN messages ON messages.folder_id = folders.id
        WHERE folders.type = 'custom'
        GROUP BY folders.id, folders.name, folders.type, folders.folder_order
        ORDER BY folder_order ASC
    ");
    if ($stmt) {
        $stmt->execute();
        $result = $stmt->get_result();

        $custom_folders = [];

        while($row = $result->fetch_assoc()) {
            $custom_folders[] = $row;
        }
        $result->free();
        $stmt->close();
    } else {
        throw new RuntimeException($conn->error);
    }

    return $custom_folders;
}
        
function add_new_folder(mysqli $conn, array $input) {
    // Query 1: Get the number of custom folders, add 1 to that number for folder order
    $stmt = $conn->prepare("
        SELECT COUNT(*) AS folder_count
        FROM folders
        WHERE type = 'custom'
    ");
    if ($stmt) {
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $folder_count = $row['folder_count'];
        $folder_order = $folder_count + 1;

        $result->free();
        $stmt->close();

        // Query 2: Insert new folder record
        $folder_name = $input['folderName'];
        $folder_type = $input['folderType'];
        $stmt = $conn->prepare("
            INSERT INTO folders (name, type, folder_order)
            VALUES (?, ?, ?)
        ");
        if ($stmt) {
            $stmt->bind_param("ssi", $folder_name, $folder_type, $folder_order);
            $stmt->execute();
            $new_folder_id = $conn->insert_id;
            
            $stmt->close();
        } else {
            throw new RuntimeException($conn->error);
        }
    } else {
        throw new RuntimeException($conn->error);
    }

    return ['folder_id' => $new_folder_id];
}

function delete_folder(mysqli $conn, array $input) {
    $folder_id = $input['targetFolder'];
    $stmt = $conn->prepare("
        DELETE FROM folders
        WHERE id = ?
    ");
    if ($stmt) {
        $stmt->bind_param("i", $folder_id);
        $stmt->execute();
        $deleted_folder_count = $stmt->affected_rows; 

        if ($deleted_folder_count > 0) {
            $result = ['success' => true, 'deleted_rows' => $deleted_folder_count];
        } else {
            $result = ['success' => false, 'message' => 'No rows deleted'];
        }
        
        $stmt->close();
    } else {
        throw new RuntimeException($conn->error);
    }

    return $result;
}