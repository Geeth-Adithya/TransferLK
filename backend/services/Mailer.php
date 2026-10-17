<?php
// Mailer.php - Native PHP SMTP mailer for Gmail & standard SMTP servers

require_once __DIR__ . '/../config/EnvLoader.php';

class Mailer {
    private $host;
    private $port;
    private $user;
    private $pass;
    private $fromEmail;
    private $fromName;
    private $timeout = 15;

    public function __construct() {
        $this->host      = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $this->port      = (int)(getenv('SMTP_PORT') ?: 465);
        $this->user      = getenv('SMTP_USER') ?: '';
        $this->pass      = str_replace(' ', '', getenv('SMTP_PASS') ?: '');
        $this->fromEmail = getenv('SMTP_FROM_EMAIL') ?: $this->user;
        $this->fromName  = getenv('SMTP_FROM_NAME') ?: 'TransferLK Support';
    }

    /**
     * Send password reset verification code email
     */
    public function sendPasswordResetOtp($toEmail, $recipientName, $otp) {
        $subject = "TransferLK - Password Reset Code";
        $safeName = htmlspecialchars($recipientName ?: 'Teacher', ENT_QUOTES, 'UTF-8');

        $html = "<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6fb; margin: 0; padding: 20px; }
    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e9f2; }
    .logo { color: #1e40af; font-size: 24px; font-weight: 800; text-align: center; margin-bottom: 24px; }
    .badge { display: inline-block; background: #eff6ff; color: #1d4ed8; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .otp-box { background: #f8fafc; border: 2px dashed #93c5fd; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1e3a8a; font-family: 'Courier New', monospace; }
    .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 24px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class='card'>
    <div class='logo'>TransferLK</div>
    <p style='color: #334155; font-size: 16px;'>Hello <strong>{$safeName}</strong>,</p>
    <p style='color: #475569; font-size: 14px; line-height: 1.6;'>
      We received a request to reset your password for your <strong>TransferLK</strong> teacher account.
      Use the verification code below to proceed:
    </p>
    
    <div class='otp-box'>
      <div style='font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;'>Verification Code</div>
      <div class='otp'>{$otp}</div>
    </div>
    
    <p style='color: #64748b; font-size: 13px;'>
      ⏰ This code will expire in <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email or contact support.
    </p>
    
    <hr style='border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;' />
    <div class='footer'>
      Teacher Transfer Management System - TransferLK<br>
      Automated message, please do not reply directly to this email.
    </div>
  </div>
</body>
</html>";

        return $this->sendMail($toEmail, $recipientName, $subject, $html);
    }

    /**
     * Internal SMTP socket delivery method
     */
    public function sendMail($toEmail, $recipientName, $subject, $htmlBody) {
        if (empty($this->user) || empty($this->pass)) {
            error_log("Mailer Error: SMTP credentials are not configured in .env");
            return false;
        }

        $server = "ssl://{$this->host}:{$this->port}";
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);

        $socket = @stream_socket_client($server, $errno, $errstr, $this->timeout, STREAM_CLIENT_CONNECT, $context);
        if (!$socket) {
            error_log("Mailer Connection Error: {$errstr} ({$errno})");
            return false;
        }

        stream_set_timeout($socket, $this->timeout);

        $response = $this->readResponse($socket);
        if (!$this->checkCode($response, '220')) {
            $this->close($socket);
            return false;
        }

        // EHLO
        $this->sendCommand($socket, "EHLO " . gethostname());
        $response = $this->readResponse($socket);
        if (!$this->checkCode($response, '250')) {
            $this->close($socket);
            return false;
        }

        // AUTH LOGIN
        $this->sendCommand($socket, "AUTH LOGIN");
        $response = $this->readResponse($socket);
        if (!$this->checkCode($response, '334')) {
            $this->close($socket);
            return false;
        }

        // Username
        $this->sendCommand($socket, base64_encode($this->user));
        $response = $this->readResponse($socket);
        if (!$this->checkCode($response, '334')) {
            $this->close($socket);
            return false;
        }

        // Password
        $this->sendCommand($socket, base64_encode($this->pass));
        $response = $this->readResponse($socket);
        if (!$this->checkCode($response, '235')) {
            error_log("Mailer Auth Error: Authentication failed for {$this->user}. Response: {$response}");
            $this->close($socket);
            return false;
        }

        // MAIL FROM
        $this->sendCommand($socket, "MAIL FROM:<{$this->fromEmail}>");
        $response = $this->readResponse($socket);
        if (!$this->checkCode($response, '250')) {
            $this->close($socket);
            return false;
        }

        // RCPT TO
        $this->sendCommand($socket, "RCPT TO:<{$toEmail}>");
        $response = $this->readResponse($socket);
        if (!$this->checkCode($response, '250')) {
            $this->close($socket);
            return false;
        }

        // DATA
        $this->sendCommand($socket, "DATA");
        $response = $this->readResponse($socket);
        if (!$this->checkCode($response, '354')) {
            $this->close($socket);
            return false;
        }

        // Build email headers and content
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: =?UTF-8?B?" . base64_encode($this->fromName) . "?= <{$this->fromEmail}>\r\n";
        $headers .= "To: =?UTF-8?B?" . base64_encode($recipientName ?: $toEmail) . "?= <{$toEmail}>\r\n";
        $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
        $headers .= "Date: " . date('r') . "\r\n";
        $headers .= "X-Mailer: TransferLK-Mailer\r\n";

        $message = $headers . "\r\n" . $htmlBody . "\r\n.\r\n";
        $this->sendCommand($socket, $message, false);

        $response = $this->readResponse($socket);
        if (!$this->checkCode($response, '250')) {
            error_log("Mailer Data Send Error: {$response}");
            $this->close($socket);
            return false;
        }

        // QUIT
        $this->sendCommand($socket, "QUIT");
        $this->close($socket);
        return true;
    }

    private function sendCommand($socket, $cmd, $newline = true) {
        fwrite($socket, $cmd . ($newline ? "\r\n" : ""));
    }

    private function readResponse($socket) {
        $data = '';
        while ($line = fgets($socket, 512)) {
            $data .= $line;
            if (substr($line, 3, 1) === ' ') {
                break;
            }
        }
        return $data;
    }

    private function checkCode($response, $expectedCode) {
        return str_starts_with(trim($response), $expectedCode);
    }

    private function close($socket) {
        @fclose($socket);
    }
}

