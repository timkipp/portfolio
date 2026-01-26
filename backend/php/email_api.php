<?php
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    
    $dir = __DIR__;
    while (!file_exists($dir . '/vendor/autoload.php')) {
        $parent = dirname($dir);
        if ($parent === $dir) {
            throw new Exception('Could not find vendor/autoload.php');
        }
        $dir = $parent;
    }
    require_once $dir . '/vendor/autoload.php';

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $to = $_POST['email'];
        $subject = $_POST['subject'];
        $body = $_POST['message'];
    }

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->host = "smtp.dreamhost.com";
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USER'];
        $mail->Password = $_ENV['SMTP_PASSWORD'];
        $mail->SMTPSecure = "tls";
        $mail->Port = 587;

        $mail->setFrom("me@timothyscottkipp", "Tim Kipp");
        $mail->addAddress($to);

        $mail->isHTML = false;
        $mail->Subject = $subject;
        $mail->Body = $body;

        $mail->send();
        echo json_encode(['success' => true]);        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $mail->ErrorInfo]);
    }   