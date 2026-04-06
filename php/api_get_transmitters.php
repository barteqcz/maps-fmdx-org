<?php
include_once 'db.php';

// Add headers to ensure API responses are treated cleanly
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');

try {
    $stmt = $pdo->query("SELECT * FROM transmitters");
    $transmitters = $stmt->fetchAll();

    foreach ($transmitters as &$t) {
        // Fetch associated stations
        $stmt = $pdo->prepare("SELECT * FROM stations WHERE transmitter_id = ?");
        $stmt->execute([$t['id']]);
        $t['stations'] = $stmt->fetchAll();

        // Fetch associated photos ordered chronologically
        $stmt = $pdo->prepare("SELECT id, photo_filename, author, photo_date, description FROM transmitter_photos WHERE transmitter_id = ? ORDER BY photo_date DESC, id DESC");
        $stmt->execute([$t['id']]);
        $t['photos'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($transmitters);

} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to retrieve data']);
}
?>