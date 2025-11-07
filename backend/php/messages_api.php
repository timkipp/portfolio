<?php
    ob_start();
    // ini_set('display_errors', 1);
    // error_reporting(E_ALL);
    
    set_error_handler(function($severity, $message, $file, $line) {
        echo json_encode(['error' => "$message in $file on line $line"]);
        exit;
    });
    require_once 'config.php';
    session_start();
    header('Content-Type: application/json');

    $conn = get_connection();
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'error' => "Connection failed: " . $conn->connect_error]);
        exit;
    }

    $input = json_decode(file_get_contents("php://input"), true);
    $action = $input['action'] ?? '';

    switch ($action) {       
        // —————————— FOLDER ACTIONS ——————————
        case 'fetchCustomFolders':
            $stmt = $conn->prepare("
                SELECT folders.id, folders.name, folders.type, COUNT(messages.id) AS message_count
                FROM folders
                LEFT JOIN messages ON messages.folder_id = folders.id
                WHERE folders.type = 'custom'
                GROUP BY folders.id, folders.name
                ORDER BY folder_order ASC
            ");
            if (!$stmt) {
                echo json_encode(['success' => false, 'error' => $conn->error]);
                exit;
            }
            $stmt->execute();
            $result = $stmt->get_result();

            $customerFolders = [];            

            while($row = $result->fetch_assoc()) {
                $customerFolders[] = $row;
            }

            echo json_encode($customerFolders);
            $result->free();
            $stmt->close();
            break;
        
        case 'addNewFolder':
            // Query 1: Get the number of custom folders, add 1 to that number for folder order
            $stmt = $conn->prepare("
                SELECT COUNT(*) AS folder_count
                FROM folders
                WHERE type = 'custom'
            ");
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $folderCount = $row['folder_count'];
            $folderOrder = $folderCount + 1;

            $result->free();
            $stmt->close();

            // Query 2: Insert new folder record
            $folderName = $input['folderName'];
            $folderType = $input['folderType'];
            $stmt = $conn->prepare("
                INSERT INTO folders (name, type, folder_order)
                VALUES (?, ?, ?)
            ");
            $stmt->bind_param("ssi", $folderName, $folderType, $folderOrder);
            $stmt->execute();
            $newFolderId = $conn->insert_id;
            
            echo json_encode(['folder_id' => $newFolderId]);

            $stmt->close();

            break;

        case 'deleteFolder':
            $folderId = $input['targetFolder'];
            $stmt = $conn->prepare("
                DELETE FROM folders
                WHERE id = ?
            ");
            if (!$stmt) {
                echo json_encode(['success' => false, 'error' => $conn->error]);
                exit;
            }
            $stmt->bind_param("i", $folderId);
            $stmt->execute();
            $deletedFolderCount = $stmt->affected_rows;
            if ($deletedFolderCount > 0) {
                echo json_encode(['success' => true, 'deleted_rows' => $deletedFolderCount]);
            } else {
                echo json_encode(['success' => false, 'message' => 'No rows deleted']);
            }
            $stmt->close();

            break;
        
        // —————————— FOLDER ACTIONS ——————————
        case 'fetchMessages':
            // Query 1: Get messages for the active folder view
            $folderId = $input['folderView'];
            $sortColumnAndOrder = $input['messageSort'];

            $allowedColumns = ['id', 'read', 'name', 'email', 'body'];
            $allowedOrders = ['ASC', 'DESC'];
            list($column, $order) = explode(' ', $sortColumnAndOrder);

            if(!in_array($column, $allowedColumns)) $column = 'sent';
            if(!in_array($order, $allowedOrders)) $order = 'DESC';
            $orderBy = "${column} ${order}";

            $stmt = $conn->prepare("
                SELECT messages.id, source, `read`, sent, from_name, from_email, to_name, to_email, subject, body, folders.name AS 'folder_name', thread_id, parent_id, replied_to, forwarded
                FROM messages 
                JOIN folders ON messages.folder_id = folders.id
                WHERE folder_id = ?
                ORDER BY $orderBy
            ");
            if (!$stmt) {
                echo json_encode(['success' => false, 'error' => $conn->error]);
                exit;
            }
            $stmt->bind_param("i", $folderId);
            $stmt->execute();
            $result = $stmt->get_result();

            $messages = [];
            while ($row = $result->fetch_assoc()) {
                $messages[] = $row;
            }

            $result->free();
            $stmt->close();

            // Query 2: Get counts of messages for each folder
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
            $stmt->execute();
            $result = $stmt->get_result();

            $messageCounts = [];
            while ($row = $result->fetch_assoc()) {
                $messageCounts[] = $row;
            }

            $result->free();
            $stmt->close();

            echo json_encode([
                'messages' => $messages,
                'messageCounts' => $messageCounts
            ]);

            break;

        case 'updateMessageFolder':
            $messageIds = $input['targetMessages'];       
            if (!empty($messageIds)) {
                $folderId = $input['targetFolder'];
                $messageCount = count($messageIds);
                $placeholders = implode(",", array_fill(0, $messageCount, "?"));
                $types = str_repeat("i", $messageCount + 1);

                $stmt = $conn->prepare("
                    UPDATE messages 
                    SET folder_id = ? 
                    WHERE id IN ($placeholders)
                ");
                if (!$stmt) {
                    echo json_encode(['success' => false, 'error' => $conn->error]);
                    exit;
                }
                $stmt->bind_param($types, $folderId, ...$messageIds);
                $stmt->execute();
                echo json_encode(['success' => true]);

                $stmt->close();
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'No messages specified']);
            }
            break;

        case 'toggleReadStatus':
            $messageId = intval($input['id'] ?? 0);
            $isRead = intval($input['readStatus']);
            if ($messageId >= 0) {
                $stmt = $conn->prepare("
                    UPDATE messages 
                    SET `read` = ? 
                    WHERE id = ?
                ");
                if (!$stmt) {
                    echo json_encode(['success' => false, 'error' => $conn->error]);
                    exit;
                }
                $stmt->bind_param("ii", $isRead, $messageId);
                $stmt->execute();
                echo json_encode(['success' => true]);

                $stmt->close();
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid message ID']);
            }
            break;

        case 'deleteMessages':
            $messageIds = $input['targetMessages'];
            if (!empty($messageIds)) {
                $messageCount = count($messageIds);
                $placeholders = implode(',', array_fill(0, $messageCount, '?'));
                $types = str_repeat('i', $messageCount);
                $stmt = $conn->prepare("
                    DELETE 
                    FROM messages 
                    WHERE id IN ($placeholders)
                ");
                if (!$stmt) {
                    echo json_encode(['success' => false, 'error' => $conn->error]);
                    exit;
                }
                $stmt->bind_param($types, ...$messageIds);
                $stmt->execute();
                echo json_encode(['success' => true]);

                $stmt->close();
            }
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Unknown action']);
    }

    ob_end_flush();