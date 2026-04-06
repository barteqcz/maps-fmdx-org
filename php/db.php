<?php
// Enforce strict error reporting for logging, but hide from users
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Use environment variables for production credentials
$host = getenv('DB_HOST') ?: 'localhost';
$db   = getenv('DB_NAME') ?: 'maps';
$user = getenv('DB_USER') ?: 'production_user';
$pass = getenv('DB_PASS') ?: 'production_password';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Log the actual error internally for debugging
    error_log("Database connection failed: " . $e->getMessage());
    
    // Show a safe, generic message to the end user
    header('HTTP/1.1 503 Service Unavailable');
    die("The application is currently unavailable. Please try again later.");
}
?>