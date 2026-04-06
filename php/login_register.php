<?php
include_once 'db.php';

// Strict production session security settings
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.use_strict_mode', 1); // Prevent session fixation
    
    session_start([
        'cookie_httponly' => true,
        'cookie_secure' => true, // Enforces HTTPS. Ensure your production server has SSL/TLS setup.
        'cookie_samesite' => 'Lax',
        'use_only_cookies' => true
    ]);
}

$action = $_POST['action'] ?? '';

// --- BRUTE FORCE PROTECTION (IP-based) ---
$ip = $_SERVER['REMOTE_ADDR'];
$rate_limit_file = sys_get_temp_dir() . '/fmdx_login_' . md5($ip) . '.json';
$attempts_data = ['count' => 0, 'last_attempt' => time()];

if (file_exists($rate_limit_file)) {
    $json = file_get_contents($rate_limit_file);
    $parsed = json_decode($json, true);
    if ($parsed && isset($parsed['count'], $parsed['last_attempt'])) {
        $attempts_data = $parsed;
    }
}

// --- LOGIN LOGIC ---
if ($action === 'login') {
    if ($attempts_data['count'] >= 5) {
        $time_since_last = time() - $attempts_data['last_attempt'];
        if ($time_since_last < 300) { 
            $error = "TOO_MANY_ATTEMPTS";
            $remaining_cooldown_seconds = 300 - $time_since_last; 
            return; 
        } else {
            $attempts_data['count'] = 0; 
        }
    }

    $attempts_data['last_attempt'] = time();
    $login_input = trim($_POST['username'] ?? '');

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$login_input, $login_input]);
    $user = $stmt->fetch();

    if ($user && password_verify($_POST['password'], $user['password'])) {
        session_regenerate_id(true);

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['username'] = $user['username']; 
        
        if (file_exists($rate_limit_file)) {
            @unlink($rate_limit_file);
        }
        
        header("Location: /index.php"); 
        exit;
    } else {
        $attempts_data['count']++;
        file_put_contents($rate_limit_file, json_encode($attempts_data));
        // Use a generic delay to prevent time-based enumeration attacks
        usleep(rand(800000, 1200000)); 
        $error = "AUTH_ERR";
    }
}

// --- REGISTER LOGIC ---
if ($action === 'register') {
    $user_input = trim($_POST['username'] ?? '');
    $email_input = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $pass_input = $_POST['password'] ?? '';

    if (empty($user_input) || empty($email_input) || empty($pass_input)) {
        $error = "EMPTY_FIELDS";
    } elseif (!filter_var($email_input, FILTER_VALIDATE_EMAIL)) {
        $error = "INVALID_EMAIL";
    } elseif (strlen($pass_input) < 8) {
        $error = "PASS_TOO_SHORT";
    } elseif (strlen($user_input) < 3 || strlen($user_input) > 30) {
        $error = "INVALID_USER_LENGTH";
    } else {
        $pass_hash = password_hash($pass_input, PASSWORD_DEFAULT);
        
        $check = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $check->execute([$user_input, $email_input]);
        
        if ($check->fetch()) {
            $error = "USER_EXISTS";
        } else {
            $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')");
            if ($stmt->execute([$user_input, $email_input, $pass_hash])) {
                session_regenerate_id(true);

                $_SESSION['user_id'] = $pdo->lastInsertId();
                $_SESSION['user_role'] = 'user';
                $_SESSION['username'] = $user_input; 
                
                header("Location: /index.php"); 
                exit;
            }
        }
    }
}
?>