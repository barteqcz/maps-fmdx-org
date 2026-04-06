<?php
include 'db.php';

// Production session security settings must be applied FIRST
if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'cookie_samesite' => 'Lax',
    ]);
}

$action = $_POST['action'] ?? '';

// --- BRUTE FORCE PROTECTION (IP-based) ---
// Uses server temp directory to avoid requiring DB schema changes
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

if ($action === 'login') {
    if ($attempts_data['count'] >= 5) {
        $time_since_last = time() - $attempts_data['last_attempt'];
        if ($time_since_last < 300) { // 5-minute lockout
            $error = "TOO_MANY_ATTEMPTS";
            // Calculate precisely how many seconds are left
            $remaining_cooldown_seconds = 300 - $time_since_last; 
            return; 
        } else {
            $attempts_data['count'] = 0; 
        }
    }

    $attempts_data['last_attempt'] = time();

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$_POST['username']]);
    $user = $stmt->fetch();

    if ($user && password_verify($_POST['password'], $user['password'])) {
        session_regenerate_id(true);

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['username'] = $user['username']; 
        
        // Clear IP rate limit on successful login
        if (file_exists($rate_limit_file)) {
            @unlink($rate_limit_file);
        }
        
        header("Location: /index.php"); 
        exit;
    } else {
        $attempts_data['count']++;
        file_put_contents($rate_limit_file, json_encode($attempts_data));
        sleep(1); // Minor mitigation against timing attacks
        $error = "AUTH_ERR";
    }
}

if ($action === 'register') {
    $user_input = trim($_POST['username']);
    $pass_input = $_POST['password'];

    // Added length & complexity constraints
    if (empty($user_input) || empty($pass_input)) {
        $error = "EMPTY_FIELDS";
    } elseif (strlen($pass_input) < 8) {
        $error = "PASS_TOO_SHORT";
    } elseif (strlen($user_input) < 3 || strlen($user_input) > 30) {
        $error = "INVALID_USER_LENGTH";
    } else {
        $pass_hash = password_hash($pass_input, PASSWORD_DEFAULT);
        
        $check = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $check->execute([$user_input]);
        
        if ($check->fetch()) {
            $error = "USER_EXISTS";
        } else {
            $stmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')");
            if ($stmt->execute([$user_input, $pass_hash])) {
                session_regenerate_id(true);

                $_SESSION['user_id'] = $pdo->lastInsertId();
                $_SESSION['user_role'] = 'user';
                $_SESSION['username'] = $user_input; // Store raw, escape on output
                
                header("Location: /index.php"); 
                exit;
            }
        }
    }
}
?>