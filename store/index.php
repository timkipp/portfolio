<?php
    session_start();

    // Enable error reporting
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    
    $errors = ['first_name' => '', 'last_name' => ''];
    $first_name = '';
    $last_name = '';

    // Check if the form has been submitted
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // Sanitize input and validate
        if (empty(trim($_POST['first_name']))) {
            $errors['first_name'] = 'A first name is required.';
        } else {
            $_SESSION['first_name'] = htmlspecialchars(trim($_POST['first_name'])); // Store in session
        }

        if (empty(trim($_POST['last_name']))) {
            $errors['last_name'] = 'A last name is required.';
        } else {
            $_SESSION['last_name'] = htmlspecialchars(trim($_POST['last_name'])); // Store in session
        }

        // Retrieve the names from the session if they exist
        $first_name = isset($_SESSION['first_name']) ? $_SESSION['first_name'] : '';
        $last_name = isset($_SESSION['last_name']) ? $_SESSION['last_name'] : '';
    } else {
        $first_name = '';
        $last_name = '';
    }

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">    
    <link rel="stylesheet" type="text/css" href="styles/reset.css">
    <link rel="stylesheet" type="text/css" href="styles/styles.css">
    <title>My PHP</title>
</head>
<body>
    <?php echo "<script>alert('Hello World!');</script>"; ?>
    <header>
        <h1>            
            <?= $first_name . ' ' . $last_name; ?>
        </h1> <!-- Display the sanitized name -->
    </header>
    <main>
        <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">
            <fieldset>
                <div class="form_control">
                    <label for="first_name">First Name</label>
                    <input type="text" id="first_name" name="first_name" value="<?= htmlspecialchars($first_name); ?>"> <!-- Preserve input value -->
                    <span class="required_error"><?= $errors['first_name']; ?></span> <!-- Display first name error -->    
                </div>
                
                <div class="form_control">
                    <label for="last_name">Last Name</label>
                    <input type="text" id="last_name" name="last_name" value="<?= htmlspecialchars($last_name); ?>"> <!-- Preserve input value -->
                    <span class="required_error"><?= $errors['last_name']; ?></span> <!-- Display last name error -->
                </div>
    
                <input type="submit" name="submit" value="Click Here">
            </fieldset>
        </form>
    </main>
    <footer>

    </footer>    
</body>
</html>