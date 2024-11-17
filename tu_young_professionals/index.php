<?php
// Database connection settings
$host = "localhost";
$db = "tu_young_professionals";
$username = "root";
$password = "MyL@1M@$$@cr3";
$conn = new mysqli($host, $username, $password, $db);

if ($conn->connect_error) {
    die("Connection failed: ". $conn->connect_error);
}

// Initialize error messages and variables
$errorMessage = "";
$errorExists = false;
$formSubmitted = false;
$first_name = $last_name = $email_address = $phone_number = $campus = $workshop = '';
$first_name_error = $last_name_error = $email_address_error = $phone_number_error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['request_info'])) {
        $formSubmitted = true;

        // Get form data and sanitize it
        $first_name = trim(htmlspecialchars($_POST['first_name']));
        $last_name = trim(htmlspecialchars($_POST['last_name']));
        $email_address = trim(htmlspecialchars($_POST['email_address']));
        $phone_number = trim(htmlspecialchars($_POST['phone_number']));
        $campus = $_POST['campus'];
        $workshop = trim(htmlspecialchars($_POST['workshop']));

        // Validate required fields
        if (empty($first_name)) {
            $first_name_error = "First name is required.";
            $errorExists = true;
        }
        if (empty($last_name)) {
            $last_name_error = "Last name is required.";
            $errorExists = true;
        }
        if (empty($phone_number)) {
            $phone_number_error = "Phone number is required.";
            $errorExists = true;
        }
        if (empty($email_address)) {
            $email_address_error = "Email address is required.";
        } elseif (!filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
            $email_address_error = "Invalid email format.";
            $errorExists = true;
        }

        if (!$errorExists) { 
            $sql = "INSERT INTO info_requests (first_name, last_name, phone_number, email_address, campus, workshop) VALUES ('Gabriello', 'Donise',	'gdonise0@washingtonpost.com', '985-315-3451')";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssss", $first_name, $last_name, $phone_number, $email_address, $campus, $workshop);

            if($stmt->execute()) {
                header("Location: confirmation.php");
                exit();
            } else {
                $errorMessage = "Error: " . $stmt->error;
            }
            $stmt->close();       
        } else {
            $_SESSION['error_messages'] = [
                'first_name' => $first_name_error,
                'last_name' => $last_name_error,
                'email_address' => $email_address_error,
                'phone_number' => $phone_number_error,
            ];
        }
    } elseif (isset($_POST['view_requests'])) {
        header("Location: info_requests.php");
        exit();
    }

}

$conn->close();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="styles/reset.css" type="text/css" rel="stylesheet">
    <link href="styles/global.css" type="text/css" rel="stylesheet">
    <title>Towson University Young Professionals</title>
</head>
<body>
    <header>
        <h2>Towson University</h2>
        <h1>Young Professionals</h1>
    </header>
    <main>
        <form method="POST" action="">
            <fieldset>
                <legend>Request Info
                    <?php if (!empty($errorMessage)): ?>
                        <br><span class="error-message"><?php echo $errorMessage; ?></span>
                    <?php endif; ?>
                </legend>
                <div class="form_control">
                    <label id="first_name" for="first_name">FIRST NAME</label>
                    <input type="text" name="first_name" value="<?php echo $first_name; ?>">
                    <div class="error-message"><?php echo $formSubmitted ? $first_name_error : ""; ?></div>
                </div>
                <div class="form_control">
                    <label for="last_name">LAST NAME</label>
                    <input type="text" name="last_name" value="<?php echo $last_name; ?>">
                    <div class="error-message"><?php echo $formSubmitted ? $last_name_error : ""; ?></div>
                </div>
                <div class="form_control">
                    <label for="phone_number">PHONE NUMBER</label>
                    <input type="text" name="phone_number" value="<?php echo $phone_number; ?>">
                    <div class="error-message"><?php echo $formSubmitted ? $phone_number_error : ""; ?></div>
                </div>
                <div class="form_control">
                    <label for="email_address">EMAIL ADDRESS</label>
                    <input type="email" name="email_address" value="<?php echo $email_address; ?>">
                    <div class="error-message"><?php echo $formSubmitted ? $email_address_error: ""; ?></div>
                </div>                
                <div class="form_control">
                    <label for="campus">WHICH CAMPUS ARE YOU INTERESTED IN?</label>
                    <select name="campus">
                        <option>Bel Air</option>
                        <option>Downtown Baltimore</option>
                        <option>Ellicot City</option>
                        <option>Glen Burnie</option>                        
                        <option>Hereford</option>
                        <option>Middle River</option>
                        <option>Owings Mills</option>
                        <option>Towson</option>                       
                    </select>
                </div>
                <div class="form_control">
                    <label for="workshop">WHICH WORKSHOPS ARE YOU INTERESTED IN?</label>
                    <input type="text" name="workshop" value="<?php echo htmlspecialchars($workshop); ?>"></text>
                </div>
                <div class="form_control">
                    <input type="submit" name="request_info" value="Request Info">
                    <input type="submit" name="view_requests" value="View Requests">
                </div>
            </fieldset>
        </form>
    </main>
    <footer>

    </footer>
</body>
</html>