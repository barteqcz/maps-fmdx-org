<?php
include 'db.php';
$stmt = $pdo->query("SELECT * FROM transmitters");
$transmitters = $stmt->fetchAll();

foreach ($transmitters as &$t) {
    // Fetch Stations
    $stmt = $pdo->prepare("SELECT * FROM stations WHERE transmitter_id = ?");
    $stmt->execute([$t['id']]);
    $t['stations'] = $stmt->fetchAll();

    // Fetch Photos (New)
    $stmt = $pdo->prepare("SELECT id, photo_filename, author, photo_date, description FROM transmitter_photos WHERE transmitter_id = ?");
    $stmt->execute([$t['id']]);
    $t['photos'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

header('Content-Type: application/json');
echo json_encode($transmitters);