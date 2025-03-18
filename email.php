  <?php
$servername = "localhost";
$username = "root";
$password = "MyC0^ntryT1\$OfTh33";
$dbname = "world";

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
$headers = 'From: me@timothyscottkipp.com' . "\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email.";
}
?>