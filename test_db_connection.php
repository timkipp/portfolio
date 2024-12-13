  <?php
$servername = "localhost";
$username = "root";
$password = "MyL@1M@$$@cr3";
$dbname = "wordpress";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
$conn->close();

$to = 'timkipp@gmail.com';
$subject = 'Test Email';
$message = 'This is a test email from your local server.';
$headers = 'From: timkipp@gmail.com' . "\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email.";
}
?>


