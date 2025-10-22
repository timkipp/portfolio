<?php
    require_once 'config.php';

    $conn = get_connection();
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sent = !empty($_POST['sent']) ? $_POST['sent'] : date('Y-m-d H:i:s');
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $message = $_POST['message'] ?? '';

    $new = 1;
    $stmt = $conn->prepare("INSERT INTO messages (new, sent, name, email, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $new, $sent, $name, $email, $message);

    if ($stmt->execute()) {
        echo "Message sent successfully!";
    } else {
        error_log("[" . date('Y-m-d H:i:s') . "] DB error: " . $stmt->error . PHP_EOL, 3, $contact_log_file);
        echo "Oops! Something went wrong. Please try again later.";
    }

    $stmt->close();
    $conn->close();
?>