<?php
    session_start();

    // Clear any existing session data
    // $_SESSION = [];
    // session_destroy();
    // session_start();

    // Pages that do not require login
    $publicPages = ['login'];
    $page = $_GET['page'] ?? 'login'; // default to login page

    // Redirect if user is not logged in and page is protected
    if (!in_array($page, $publicPages) && empty($_SESSION['logged_in'])) {
        $page = 'login';
    }

    // Map pages to backend files
    $allowedPages = [
        'login' => __DIR__ . '/../../backend/php/login.php',
        'dashboard' => __DIR__ . '/../../backend/dashboard.php',
        'messages_api' => __DIR__ . '/../../backend/php/messages_api.php',
        'test' => __DIR__ . '/../../backend/php/test.php'
    ];

    if (!array_key_exists($page, $allowedPages)) {
        echo "Woops... 404 Page Not Found";
        exit;
    }

    require_once $allowedPages[$page];

    if ($page === 'login' && empty($_SESSION['logged_in'])) :
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../styles/login.css" type="text/css" />
    <link rel="stylesheet" href="../styles/reset.css" type="text/css" />
</head>
<body>
    <header>
        <h1>Administration Login</h1>
    </header>
    <main>
        <form method="POST" action="/admin/backend.php?page=login">
            <div class=form-field>
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required autocomplete="username">
            </div>
            <div class=form-field>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required autocomplete="current-password">
            </div>
            <button type="submit">Login</button>
        </form>
    </main>
</body>
</html>

<?php
    endif;
?>