<?php
    session_start();

    // Pages that do not require login
    $publicPages = ['login'];
    $page = $_GET['page'] ?? 'login'; // default to login page

    // Redirect if user is not logged in and page is protected
    if (!in_array($page, $publicPages) && empty($_SESSION['logged_in'])) {
        $page = 'login';
    }

    // Map pages to backend files
    $allowedPages = [
        'contact_submit' => __DIR__ . '/../../backend/php/api/contact_submit.php',
        'login' => __DIR__ . '/../../backend/php/auth/login.php',
        'logout' => __DIR__ . '/../../backend/php/auth/logout.php',
        'dashboard' => __DIR__ . '/../../backend/dashboard.html',
        'db_api' => __DIR__ . '/../../backend/php/db_api.php',
        'email_api' => __DIR__ . '/../../backend/php/email_api.php',
        'folders' => __DIR__ . '/../../backend/php/api/folders.php',
        'messages' => __DIR__ . '/../../backend/php/api/messages.php',
        'attachments' => __DIR__ . '/../../backend/php/api/attachments.php',
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