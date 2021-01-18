<?php
    $name = $_POST['name'];
    $phone = $_POST['phone']
    $email = $_POST['email'];
    $message = $_POST['message'];
    

    $email_from = 'Psihologie Cozma';
    $email_subject = 'Mesaj nou de la Psihologie Cozma';
    $email_body = "Nume: $name.\n".
                  "Telefon: $phone.\n".
                  "Email: $email.\n".
                  "Mesaj: $message.\n";

    $to ="bogdan.cozma1990@gmail.com";
    $headers = "From: $email_from \r\n";
    $headers = "Replay-To: $email \r\n";

    mail($to,$email_subject,$email_body,$headers);

    header("location:index.html");
?>
