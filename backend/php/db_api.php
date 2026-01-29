<?php
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    header('Content-Type: application/json');

    set_error_handler(function ($severity, $message, $file, $line) {
        echo json_encode([
            'type' => 'php_error',
            'message' => $message,
            'file' => $file,
            'line' => $line
        ]);
        exit;
    });

    set_exception_handler(function ($e) {
        echo json_encode([
            'type' => 'exception',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
        exit;
    });

    require_once __DIR__ . '/utils/init.php';
    require_once __DIR__ . '/api/folders.php';
    require_once __DIR__ . '/api/messages.php';
    require_once __DIR__ . '/api/attachments.php';
    
    $input = json_decode(file_get_contents("php://input"), true);
    $action = $input['action'] ?? $_POST['action'] ?? '';
    $conn = get_connection();

    switch ($action) {
        // —————————— FOLDER ACTIONS ——————————
        case 'fetch custom folders':
            $custom_folders = fetch_custom_folders($conn);
            echo json_encode($custom_folders);
            break;
        
        case 'add new folder':
            $new_folder_id = add_new_folder($input);
            echo json_encode(['folder_id' => $new_folder_id]);
            break;

        case 'delete folder':            
            $deleted_folder_count = delete_folder($conn, $input);
            if ($deleted_folder_count > 0) {
                echo json_encode(['success' => true, 'deleted_rows' => $deleted_folder_count]);
            } else {
                echo json_encode(['success' => false, 'message' => 'No rows deleted']);
            }
            break;
        
        // —————————— MESSAGE ACTIONS ——————————
        case 'fetch messages':
            $conn->begin_transaction();
            try {
                $message_data = fetch_messages($conn, $input);

                echo json_encode([
                    'messages' => $message_data['messages'],
                    'messageCounts' => $message_data['message_counts']
                ]);
            } catch (Exception $e) {
                $conn->rollback();
                echo json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ]);
            }
            break;

        case 'update message folder':
            $folder_updated = update_message_folder($conn, $input);
            if ($folder_updated['success'] === false) {
                http_response_code(400);
            }
            echo json_encode($folder_updated);
            break;

        case 'toggle read status':
            $read_status_updated = toggle_read_status($conn, $input);
            if ($read_status_updated['success'] === false) {
                http_response_code(400);
            }
            echo json_encode($read_status_updated);
            break;

        case 'delete messages':
            $conn->begin_transaction();
            $message_deleted = delete_messages($conn, $input);
            if ($message_deleted['success'] === false) {
                http_response_code(400);
            }
            echo json_encode($message_deleted);
            break;
        
        case 'insert new message':
            $conn->begin_transaction();
            try {
                $message_data = insert_new_message($conn, $input);
                echo json_encode($message_data);
                break;
            } catch (Throwable $e) {
                $conn->rollback();
                throw $e;
            }
            break;

        case 'update message':
            $update_confirmation = update_message($conn, $input);
            if ($update_confirmation['success'] === false) {
                http_response_code(400);
            }
            echo json_encode($update_confirmation);
            break;
        
        case 'sync server attachments':
            $sync_result = sync_server_attachments();
            echo json_encode($sync_result);
            break;
        
        case 'serve attachment':
            $fileId = $input['fileId'] ?? null;
            if ($fileId === null) {
                http_response_code(400);
                echo json_encode(['error' => 'No file ID provided']);
                break;
            }

            $attachment = fetch_attachment($conn, $fileId);
            if (!attachment) {
                http_response_code(404);
                echo json_encode(['error' => 'Attachment not found']);
                break;
            }
            serve_attachment($attachment);
            break;
        
        // —————————— VISITOR ACTIONS ——————————

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Unknown action']);
    }
    
    $conn->close();

    ob_end_flush();