<?php
    require '../vendor/autoload.php';

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
        $mail->Username = "me@timothyscottkipp.com";
        $mail->Password = "Em@nc1p@t10n";
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

