<?php
    session_start();

    define('USERNAME', 'timkipp');
    define('PASSWORD_HASH', '$2y$10$DtQYiz73VgSBJK.h8aVER.qcreTJk6NTJQvacvRTdP4qx9NihcX02');

    $error = '';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';

        if ($username === USERNAME && password_verify($password, PASSWORD_HASH)) {
            session_regenerate_id(true);
            $_SESSION['logged_in'] = true;
            header("Location: messages.php");
            exit;
        } else {
            $error = 'Invalid username or password';
        }
    }

    if (!empty($_SESSION['logged_in'])) {
        header("Location: messages.php");
        exit;
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="/styles/reset.css" type="text/css" />
    <link rel="stylesheet" href="../backend/css/login.css" type="text/css" />
</head>
<body>
    <header>
        <h1>Administration Login</h1>
    </header>
    <main>
        <form method="POST">
            <div class=form-field>
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class=form-field>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Login</button>
        </form>
    </main>
</body>
</html>