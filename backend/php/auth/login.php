<?php
    define('USERNAME', 'timkipp');
    define('PASSWORD_HASH', '$2y$10$DtQYiz73VgSBJK.h8aVER.qcreTJk6NTJQvacvRTdP4qx9NihcX02');

    $error = '';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';

        if ($username === USERNAME && password_verify($password, PASSWORD_HASH)) {
            session_regenerate_id(true);
            $_SESSION['logged_in'] = true;
            
            usleep(50000); // 50ms delay

            echo "Login successful. User is logged in.";
            header("Location: /admin/backend.php?page=dashboard");
            exit;
        } else {
            $error = 'Invalid username or password';
        }
    }

    if (!empty($_SESSION['logged_in'])) {
        header("Location: /admin/backend.php?page=dashboard");
        exit;
    }
?>