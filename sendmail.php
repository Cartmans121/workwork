<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './PHPMailer-6.8.1/src/Exception.php';
require './PHPMailer-6.8.1/src/PHPMailer.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mail = new PHPMailer(true);

    try {
        $mail->CharSet = 'UTF-8';
        $mail->setLanguage('ru', 'phpmailer/language/');
        $mail->IsHTML(true);

        $mail->setFrom('vana08@list.ru', 'Иван Попов');
        $recipientEmail = 'vana08@list.ru';  // Получатель
        $mail->addAddress($recipientEmail);
        $mail->Subject = 'Смысл письма';

        // $hand = ($_POST['hand'] === 'left') ? 'Левая' : 'Правая';

        $body = '<h1>Встречайте письмо от вашего будущего коллеги!</h1>';

        if (!empty(trim($_POST['name']))) {
            $body .= '<p><strong>Имя: </strong>' . htmlspecialchars($_POST['name']) . '</p>';
        }
        if (!empty(trim($_POST['email']))) {
            $body .= '<p><strong>E-mail: </strong>' . htmlspecialchars($_POST['email']) . '</p>';
        }
        if (!empty(trim($_POST['phone']))) {
            $body .= '<p><strong>Телефон: </strong>' . htmlspecialchars($_POST['phone']) . '</p>';
        }
        if (!empty(trim($_POST['age']))) {
            $body .= '<p><strong>Оглашение: </strong>' . htmlspecialchars($_POST['age']) . '</p>';
        }
        if (!empty(trim($_POST['message']))) {
            $body .= '<p><strong>Сообщение: </strong>' . htmlspecialchars($_POST['message']) . '</p>';
        }

        if (!empty($_FILES['image']['tmp_name'])) {
            $filePath = __DIR__ . "/files/" . basename($_FILES['image']['name']);
            if (move_uploaded_file($_FILES['image']['tmp_name'], $filePath)) {
                $mail->addAttachment($filePath);
                $body .= '<p><strong>Фото в приложении</strong></p>';
            }
        }

        $mail->Body = $body;

        if ($mail->send()) {
            $message = 'Данные отправлены!';
        } else {
            $message = 'Ошибка: ' . $mail->ErrorInfo;
        }
    } catch (Exception $e) {
        $message = 'Ошибка: ' . $e->getMessage();
    }
} else {
    $message = 'Метод не разрешен';
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
?>
