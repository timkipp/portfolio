<?php
    if (!empty($_POST['signup'])) {
        exit;
    }
    require_once __DIR__ . '/../utils/config.php';

    if (!$local) {
        ini_set('display_errors', 0);
        ini_set('display_startup_errors', 0);
        error_reporting(E_ALL);
    }

    $contact_log_file = __DIR__ . '/contact_errors.log';

    $conn = get_connection();
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sent = !empty($_POST['sent']) ? $_POST['sent'] : date('Y-m-d H:i:s');
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');
    $folder_id = 1;

    $read = 0;
    $stmt = $conn->prepare("INSERT INTO messages (`read`, sent_date, from_name, from_email, body, folder_id) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssi", $read, $sent, $name, $email, $message, $folder_id);

    if ($stmt->execute()) {
        echo "Message sent successfully!";
    } else {
        error_log("[" . date('Y-m-d H:i:s') . "] DB error: " . $stmt->error . PHP_EOL, 3, $contact_log_file);
        echo "Oops! Something went wrong. Please try again later.";
    }

    $stmt->close();
    $conn->close();
?>