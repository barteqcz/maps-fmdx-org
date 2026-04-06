<?php
include 'login_register.php'; // DB is included inside login_register

// 1. CSRF Token Generation
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$countries = [
    "AFG" => "Afghanistan", "ALB" => "Albania", "DZA" => "Algeria", "AND" => "Andorra", 
    "ARG" => "Argentina", "AUS" => "Australia", "AUT" => "Austria", "BEL" => "Belgium", 
    "BRA" => "Brazil", "CAN" => "Canada", "CHN" => "China", "HRV" => "Croatia", 
    "CZE" => "Czechia", "DNK" => "Denmark", "EGY" => "Egypt", "FIN" => "Finland", 
    "FRA" => "France", "DEU" => "Germany", "GRC" => "Greece", "HUN" => "Hungary", 
    "ISL" => "Iceland", "IND" => "India", "IRL" => "Ireland", "ISR" => "Israel", 
    "ITA" => "Italy", "JPN" => "Japan", "MEX" => "Mexico", "NLD" => "Netherlands", 
    "NOR" => "Norway", "POL" => "Poland", "PRT" => "Portugal", "ROU" => "Romania", 
    "RUS" => "Russia", "SRB" => "Serbia", "SVK" => "Slovakia", "ESP" => "Spain", 
    "SWE" => "Sweden", "CHE" => "Switzerland", "TUR" => "Turkey", "UKR" => "Ukraine", 
    "GBR" => "United Kingdom", "USA" => "United States"
];

function getCountryFromCoords($lat, $lng) {
    if (!filter_var($lat, FILTER_VALIDATE_FLOAT) || !filter_var($lng, FILTER_VALIDATE_FLOAT)) {
        return "UNK";
    }

    $opts = ["http" => ["method" => "GET", "header" => "User-Agent: FMDX-App/1.0\r\n", "timeout" => 3]];
    $context = stream_context_create($opts);
    $url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" . urlencode($lat) . "&lon=" . urlencode($lng);
    
    $response = @file_get_contents($url, false, $context);
    if ($response) {
        $data = json_decode($response, true);
        $iso2 = strtoupper($data['address']['country_code'] ?? '');
        $iso2to3 = ["AF"=>"AFG", "AL"=>"ALB", "DZ"=>"DZA", "AD"=>"AND", "AR"=>"ARG", "AU"=>"AUS", "AT"=>"AUT", "BE"=>"BEL", "BR"=>"BRA", "CA"=>"CAN", "CN"=>"CHN", "HR"=>"HRV", "CZ"=>"CZE", "DK"=>"DNK", "EG"=>"EGY", "FI"=>"FIN", "FR"=>"FRA", "DE"=>"DEU", "GR"=>"GRC", "HU"=>"HUN", "IS"=>"ISL", "IN"=>"IND", "IE"=>"IRL", "IL"=>"ISR", "IT"=>"ITA", "JP"=>"JPN", "MX"=>"MEX", "NL"=>"NLD", "NO"=>"NOR", "PL"=>"POL", "PT"=>"PRT", "RO"=>"ROU", "RU"=>"RUS", "RS"=>"SRB", "SK"=>"SVK", "ES"=>"ESP", "SE"=>"SWE", "CH"=>"CHE", "TR"=>"TUR", "UA"=>"UKR", "GB"=>"GBR", "US"=>"USA"];
        return $iso2to3[$iso2] ?? "UNK";
    }
    return "UNK";
}

// --- BUG FIX: Only declare empty if login_register.php didn't set an error ---
if (!isset($error)) {
    $error = "";
}

$is_logged_in = isset($_SESSION['user_id']);
$user_role = $_SESSION['user_role'] ?? 'guest';
$is_staff = ($user_role === 'admin' || $user_role === 'editor');
$action = $_POST['action'] ?? '';

// 2. CSRF Timing-Safe Middleware for POST actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action !== 'login' && $action !== 'register') {
    $post_token = $_POST['csrf_token'] ?? '';
    $session_token = $_SESSION['csrf_token'] ?? '';
    
    if (empty($post_token) || empty($session_token) || !is_string($post_token) || !hash_equals($session_token, $post_token)) {
        http_response_code(403);
        die(json_encode(['error' => 'Unauthorized request. Invalid CSRF token.']));
    }
}

// Admin: Update User Role
if ($user_role === 'admin' && $action === 'update_user_role') {
    $new_role = $_POST['new_role'] ?? '';
    if (in_array($new_role, ['user', 'editor', 'admin'])) {
        $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->execute([$new_role, (int)$_POST['target_user_id']]);
    }
    header("Location: /index.php"); exit;
}

if ($is_staff) {
    if ($action === 'add_transmitter' || $action === 'update_transmitter') {
        // 1. Sanitize inputs
        $latitude = filter_var($_POST['latitude'] ?? false, FILTER_VALIDATE_FLOAT);
        $longitude = filter_var($_POST['longitude'] ?? false, FILTER_VALIDATE_FLOAT);
        $transmitter_name = trim($_POST['transmitter_name'] ?? ''); 

        // 2. STRICT BACKEND VALIDATION
        if ($latitude === false || $latitude < -90 || $latitude > 90 ||
            $longitude === false || $longitude < -180 || $longitude > 180 ||
            empty($transmitter_name)) {
            
            die("Error: Invalid transmitter data provided."); 
        }

        // 3. Process the valid data
        // FIXED: Used the exact function name defined at the top of your file
        $country_code = getCountryFromCoords($latitude, $longitude);

        if ($action === 'add_transmitter') {
            $insert_query = $pdo->prepare("INSERT INTO transmitters (name, lat, lng, country) VALUES (?, ?, ?, ?)");
            $insert_query->execute([$transmitter_name, $latitude, $longitude, $country_code]);
        } else {
            $update_query = $pdo->prepare("UPDATE transmitters SET name=?, lat=?, lng=?, country=? WHERE id=?");
            $update_query->execute([$transmitter_name, $latitude, $longitude, $country_code, (int)$_POST['transmitter_id']]);
        }
        header("Location: /index.php"); 
        exit;
    }

    if ($action === 'add_station' || $action === 'update_station') {
        // 1. Sanitize inputs (Using ?? false to suppress missing key warnings)
        $station_frequency = filter_var($_POST['station_frequency'] ?? false, FILTER_VALIDATE_FLOAT);
        $station_name = trim($_POST['station_name'] ?? ''); 
        $station_pi_code = strtoupper(preg_replace('/[^0-9A-Fa-f]/', '', $_POST['station_pi_code'] ?? ''));
        $station_polarization = strtoupper(trim($_POST['station_polarization'] ?? ''));
        $station_power = filter_var($_POST['station_power'] ?? false, FILTER_VALIDATE_FLOAT);
        
        $valid_polarizations = ['H', 'V', 'M', 'C', '?'];

        // 2. STRICT BACKEND VALIDATION
        if ($station_frequency === false || $station_frequency < 87.5 || $station_frequency > 108.0 ||
            $station_power === false || $station_power < 0 ||
            empty($station_name) || 
            !in_array($station_polarization, $valid_polarizations)) {
            
            die("Error: Invalid station data provided."); 
        }

        // 3. Process the valid data
        if ($action === 'add_station') {
            $insert_query = $pdo->prepare("INSERT INTO stations (transmitter_id, station_name, frequency, power_kw, polarization, pi_code) VALUES (?, ?, ?, ?, ?, ?)");
            $insert_query->execute([(int)$_POST['transmitter_id'], $station_name, $station_frequency, $station_power, $station_polarization, $station_pi_code]);
        } else {
            $update_query = $pdo->prepare("UPDATE stations SET station_name=?, frequency=?, power_kw=?, polarization=?, pi_code=? WHERE id=?");
            $update_query->execute([$station_name, $station_frequency, $station_power, $station_polarization, $station_pi_code, (int)$_POST['station_id']]);
        }
        header("Location: /index.php"); 
        exit;
    }
}

// Secure Photo Upload
if ($action === 'upload_photo' && $is_logged_in && !empty($_FILES['photo']['name'])) {
    
    // 1. BACKEND VALIDATION: Check if date exists and is in YYYY-MM-DD format
    $p_date = trim($_POST['p_date'] ?? '');
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $p_date)) {
        die("Error: A valid date (YYYY-MM-DD) is required to upload a photo.");
    }

    if ($_FILES['photo']['size'] > 5242880) {
        die("File is too large. Max limit is 5MB.");
    }

    $allowed_types = ['image/jpeg', 'image/png', 'image/webp'];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($_FILES['photo']['tmp_name']);

    if (in_array($mime, $allowed_types)) {
        $safe_extensions = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp'
        ];
        $ext = $safe_extensions[$mime]; 
        $filename = bin2hex(random_bytes(16)) . '.' . $ext; 
        
        $p_desc = trim($_POST['p_desc'] ?? ''); // Raw insert
        
        // 2. Only proceed if the file moves successfully
        if (move_uploaded_file($_FILES['photo']['tmp_name'], __DIR__ . "/../transmitter_photos/" . $filename)) {
            $stmt = $pdo->prepare("INSERT INTO transmitter_photos (transmitter_id, photo_filename, author, photo_date, description) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([(int)$_POST['transmitter_id'], $filename, $_SESSION['username'], $p_date, $p_desc]);
        }
    }
    header("Location: /index.php"); 
    exit;
}

// --- SECURE AJAX DELETE LOGIC ---
if ($is_staff && $_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete_item') {
    header('Content-Type: application/json');

    $id = (int)$_POST['target_id'];
    $type = $_POST['delete_type'];

    try {
        if ($type === 'transmitter') {
            $stmt = $pdo->prepare("SELECT photo_filename FROM transmitter_photos WHERE transmitter_id = ?");
            $stmt->execute([$id]);
            while ($photo = $stmt->fetch()) {
                @unlink(__DIR__ . "/../transmitter_photos/" . basename($photo['photo_filename']));
            }
            $pdo->prepare("DELETE FROM transmitters WHERE id = ?")->execute([$id]);

        } elseif ($type === 'station') {
            $pdo->prepare("DELETE FROM stations WHERE id = ?")->execute([$id]);

        } elseif ($type === 'photo') {
            $stmt = $pdo->prepare("SELECT photo_filename FROM transmitter_photos WHERE id = ?");
            $stmt->execute([$id]);
            if ($photo = $stmt->fetch()) {
                @unlink(__DIR__ . "/../transmitter_photos/" . basename($photo['photo_filename']));
                $pdo->prepare("DELETE FROM transmitter_photos WHERE id = ?")->execute([$id]);
            }
        }
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        error_log($e->getMessage()); 
        echo json_encode(['success' => false, 'error' => 'A server error occurred during deletion.']);
    }
    exit;
}

$all_users = ($user_role === 'admin') ? $pdo->query("SELECT id, username, role FROM users ORDER BY username ASC")->fetchAll() : [];
?>