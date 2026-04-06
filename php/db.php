<?php
$host = 'localhost';
$db   = 'maps';
$user = 'root'; // Change as needed in production
$pass = '';     // Change as needed in production
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
    // In production, do not expose $e->getMessage() to the end user
    throw new \PDOException("Database connection failed", (int)$e->getCode());
}
?>