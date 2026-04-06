<?php
include_once 'login_register.php';

// 1. CSRF Token Generation
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$countries = [
    "AFG" => "Afghanistan", "ALA" => "Åland Islands", "ALB" => "Albania", "DZA" => "Algeria", 
    "ASM" => "American Samoa", "AND" => "Andorra", "AGO" => "Angola", "AIA" => "Anguilla", 
    "ATA" => "Antarctica", "ATG" => "Antigua and Barbuda", "ARG" => "Argentina", "ARM" => "Armenia", 
    "ABW" => "Aruba", "AUS" => "Australia", "AUT" => "Austria", "AZE" => "Azerbaijan", 
    "BHS" => "Bahamas", "BHR" => "Bahrain", "BGD" => "Bangladesh", "BRB" => "Barbados", 
    "BLR" => "Belarus", "BEL" => "Belgium", "BLZ" => "Belize", "BEN" => "Benin", 
    "BMU" => "Bermuda", "BTN" => "Bhutan", "BOL" => "Bolivia", "BES" => "Bonaire, Sint Eustatius and Saba", 
    "BIH" => "Bosnia and Herzegovina", "BWA" => "Botswana", "BVT" => "Bouvet Island", "BRA" => "Brazil", 
    "IOT" => "British Indian Ocean Territory", "BRN" => "Brunei Darussalam", "BGR" => "Bulgaria", "BFA" => "Burkina Faso", 
    "BDI" => "Burundi", "CPV" => "Cabo Verde", "KHM" => "Cambodia", "CMR" => "Cameroon", 
    "CAN" => "Canada", "CYM" => "Cayman Islands", "CAF" => "Central African Republic", "TCD" => "Chad", 
    "CHL" => "Chile", "CHN" => "China", "CXR" => "Christmas Island", "CCK" => "Cocos (Keeling) Islands", 
    "COL" => "Colombia", "COM" => "Comoros", "COG" => "Congo", "COD" => "Congo, Democratic Republic of the", 
    "COK" => "Cook Islands", "CRI" => "Costa Rica", "CIV" => "Côte d'Ivoire", "HRV" => "Croatia", 
    "CUB" => "Cuba", "CUW" => "Curaçao", "CYP" => "Cyprus", "CZE" => "Czechia", 
    "DNK" => "Denmark", "DJI" => "Djibouti", "DMA" => "Dominica", "DOM" => "Dominican Republic", 
    "ECU" => "Ecuador", "EGY" => "Egypt", "SLV" => "El Salvador", "GNQ" => "Equatorial Guinea", 
    "ERI" => "Eritrea", "EST" => "Estonia", "SWZ" => "Eswatini", "ETH" => "Ethiopia", 
    "FLK" => "Falkland Islands (Malvinas)", "FRO" => "Faroe Islands", "FJI" => "Fiji", "FIN" => "Finland", 
    "FRA" => "France", "GUF" => "French Guiana", "PYF" => "French Polynesia", "ATF" => "French Southern Territories", 
    "GAB" => "Gabon", "GMB" => "Gambia", "GEO" => "Georgia", "DEU" => "Germany", 
    "GHA" => "Ghana", "GIB" => "Gibraltar", "GRC" => "Greece", "GRL" => "Greenland", 
    "GRD" => "Grenada", "GLP" => "Guadeloupe", "GUM" => "Guam", "GTM" => "Guatemala", 
    "GGY" => "Guernsey", "GIN" => "Guinea", "GNB" => "Guinea-Bissau", "GUY" => "Guyana", 
    "HTI" => "Haiti", "HMD" => "Heard Island and McDonald Islands", "VAT" => "Holy See", "HND" => "Honduras", 
    "HKG" => "Hong Kong", "HUN" => "Hungary", "ISL" => "Iceland", "IND" => "India", 
    "IDN" => "Indonesia", "IRN" => "Iran", "IRQ" => "Iraq", "IRL" => "Ireland", 
    "IMN" => "Isle of Man", "ISR" => "Israel", "ITA" => "Italy", "JAM" => "Jamaica", 
    "JPN" => "Japan", "JEY" => "Jersey", "JOR" => "Jordan", "KAZ" => "Kazakhstan", 
    "KEN" => "Kenya", "KIR" => "Kiribati", "PRK" => "North Korea", "KOR" => "South Korea", 
    "KWT" => "Kuwait", "KGZ" => "Kyrgyzstan", "LAO" => "Lao People's Democratic Republic", "LVA" => "Latvia", 
    "LBN" => "Lebanon", "LSO" => "Lesotho", "LBR" => "Liberia", "LBY" => "Libya", 
    "LIE" => "LIECHTENSTEIN", "LTU" => "Lithuania", "LUX" => "Luxembourg", "MAC" => "Macao", 
    "MKD" => "North Macedonia", "MDG" => "Madagascar", "MWI" => "Malawi", "MYS" => "Malaysia", 
    "MDV" => "Maldives", "MLI" => "Mali", "MLT" => "Malta", "MHL" => "Marshall Islands", 
    "MTQ" => "Martinique", "MRT" => "Mauritania", "MUS" => "Mauritius", "MYT" => "Mayotte", 
    "MEX" => "Mexico", "FSM" => "Micronesia", "MDA" => "Moldova", "MCO" => "Monaco", 
    "MNG" => "Mongolia", "MNE" => "Montenegro", "MSR" => "Montserrat", "MAR" => "Morocco", 
    "MOZ" => "Mozambique", "MMR" => "Myanmar", "NAM" => "Namibia", "NRU" => "Nauru", 
    "NPL" => "Nepal", "NLD" => "Netherlands", "NCL" => "New Caledonia", "NZL" => "New Zealand", 
    "NIC" => "Nicaragua", "NER" => "Niger", "NGA" => "Nigeria", "NIU" => "Niue", 
    "NFK" => "Norfolk Island", "MNP" => "Northern Mariana Islands", "NOR" => "Norway", "OMN" => "Oman", 
    "PAK" => "Pakistan", "PLW" => "Palau", "PSE" => "Palestine, State of", "PAN" => "Panama", 
    "PNG" => "Papua New Guinea", "PRY" => "Paraguay", "PER" => "Peru", "PHL" => "Philippines", 
    "PCN" => "Pitcairn", "POL" => "Poland", "PRT" => "Portugal", "PRI" => "Puerto Rico", 
    "QAT" => "Qatar", "REU" => "Réunion", "ROU" => "Romania", "RUS" => "Russia", 
    "RWA" => "Rwanda", "BLM" => "Saint Barthélemy", "SHN" => "Saint Helena, Ascension and Tristan da Cunha", "KNA" => "Saint Kitts and Nevis", 
    "LCA" => "Saint Lucia", "MAF" => "Saint Martin (French part)", "SPM" => "Saint Pierre and Miquelon", "VCT" => "Saint Vincent and the Grenadines", 
    "WSM" => "Samoa", "SMR" => "San Marino", "STP" => "Sao Tome and Principe", "SAU" => "Saudi Arabia", 
    "SEN" => "Senegal", "SRB" => "Serbia", "SYC" => "Seychelles", "SLE" => "Sierra Leone", 
    "SGP" => "Singapore", "SXM" => "Sint Maarten (Dutch part)", "SVK" => "Slovakia", "SVN" => "Slovenia", 
    "SLB" => "Solomon Islands", "SOM" => "Somalia", "ZAF" => "South Africa", "SGS" => "South Georgia and the South Sandwich Islands", 
    "SSD" => "South Sudan", "ESP" => "Spain", "LKA" => "Sri Lanka", "SDN" => "Sudan", 
    "SUR" => "Suriname", "SJM" => "Svalbard and Jan Mayen", "SWE" => "Sweden", "CHE" => "Switzerland", 
    "SYR" => "Syria", "TWN" => "Taiwan", "TJK" => "Tajikistan", "TZA" => "Tanzania", 
    "THA" => "Thailand", "TLS" => "Timor-Leste", "TGO" => "Togo", "TKL" => "Tokelau", 
    "TON" => "Tonga", "TTO" => "Trinidad and Tobago", "TUN" => "Tunisia", "TUR" => "Turkey", 
    "TKM" => "Turkmenistan", "TCA" => "Turks and Caicos Islands", "TUV" => "Tuvalu", "UGA" => "Uganda", 
    "UKR" => "Ukraine", "ARE" => "United Arab Emirates", "GBR" => "United Kingdom", "USA" => "United States", 
    "UMI" => "United States Minor Outlying Islands", "URY" => "Uruguay", "UZB" => "Uzbekistan", "VUT" => "Vanuatu", 
    "VEN" => "Venezuela", "VNM" => "Vietnam", "VGB" => "Virgin Islands (British)", "VIR" => "Virgin Islands (U.S.)", 
    "WLF" => "Wallis and Futuna", "ESH" => "Western Sahara", "YEM" => "Yemen", "ZMB" => "Zambia", "ZWE" => "Zimbabwe"
];

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
    header("Location: /index.php"); 
    exit;
}

if ($is_staff) {
    if ($action === 'add_transmitter' || $action === 'update_transmitter') {
        $latitude = filter_var($_POST['latitude'] ?? false, FILTER_VALIDATE_FLOAT);
        $longitude = filter_var($_POST['longitude'] ?? false, FILTER_VALIDATE_FLOAT);
        $transmitter_name = trim($_POST['transmitter_name'] ?? ''); 
        $manual_country = trim($_POST['country'] ?? ''); 

        // Graceful error handling - redirect instead of dying
        if ($latitude === false || $latitude < -90 || $latitude > 90 ||
            $longitude === false || $longitude < -180 || $longitude > 180 ||
            empty($transmitter_name) || empty($manual_country) || 
            !array_key_exists($manual_country, $countries)) {
            
            error_log("Validation failed for transmitter entry.");
            header("Location: /index.php?error=invalid_data");
            exit;
        }

        if ($action === 'add_transmitter') {
            $insert_query = $pdo->prepare("INSERT INTO transmitters (name, lat, lng, country) VALUES (?, ?, ?, ?)");
            $insert_query->execute([$transmitter_name, $latitude, $longitude, $manual_country]);
            $tx_id = $pdo->lastInsertId();
            header("Location: /index.php?open_tx=" . $tx_id);
        } else {
            $update_query = $pdo->prepare("UPDATE transmitters SET name=?, lat=?, lng=?, country=? WHERE id=?");
            $update_query->execute([$transmitter_name, $latitude, $longitude, $manual_country, (int)$_POST['transmitter_id']]);
            header("Location: /index.php?open_tx=" . (int)$_POST['transmitter_id']);
        }
        exit;
    }

    if ($action === 'add_station' || $action === 'update_station') {
        $station_frequency = filter_var($_POST['station_frequency'] ?? false, FILTER_VALIDATE_FLOAT);
        $station_name = trim($_POST['station_name'] ?? ''); 
        $station_pi_code = strtoupper(preg_replace('/[^0-9A-Fa-f]/', '', $_POST['station_pi_code'] ?? ''));
        $station_polarization = strtoupper(trim($_POST['station_polarization'] ?? ''));
        $station_power = filter_var($_POST['station_power'] ?? false, FILTER_VALIDATE_FLOAT);
        
        $valid_polarizations = ['H', 'V', 'M', 'C', '?'];
        
        $tx_id = (int)($_POST['transmitter_id'] ?? 0);

        // Graceful error handling
        if ($station_frequency === false || $station_frequency < 87.5 || $station_frequency > 108.0 ||
            $station_power === false || $station_power < 0 ||
            empty($station_name) || !in_array($station_polarization, $valid_polarizations)) {
            
            error_log("Validation failed for station entry.");
            header("Location: /index.php?error=invalid_station" . ($tx_id > 0 ? "&open_tx=" . $tx_id : ""));
            exit;
        }

        if ($action === 'add_station') {
            $insert_query = $pdo->prepare("INSERT INTO stations (transmitter_id, station_name, frequency, power_kw, polarization, pi_code) VALUES (?, ?, ?, ?, ?, ?)");
            $insert_query->execute([$tx_id, $station_name, $station_frequency, $station_power, $station_polarization, $station_pi_code]);
        } else {
            $update_query = $pdo->prepare("UPDATE stations SET station_name=?, frequency=?, power_kw=?, polarization=?, pi_code=? WHERE id=?");
            $update_query->execute([$station_name, $station_frequency, $station_power, $station_polarization, $station_pi_code, (int)$_POST['station_id']]);
        }
        
        header("Location: /index.php" . ($tx_id > 0 ? "?open_tx=" . $tx_id : "")); 
        exit;
    }
}

// Secure Photo Upload
if ($action === 'upload_photo' && $is_logged_in && !empty($_FILES['photo']['name'])) {
    $p_date = trim($_POST['p_date'] ?? '');
    $tx_id = (int)($_POST['transmitter_id'] ?? 0);
    
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $p_date)) {
        header("Location: /index.php?error=invalid_date" . ($tx_id > 0 ? "&open_tx=" . $tx_id : ""));
        exit;
    }

    if ($_FILES['photo']['size'] > 5242880) {
        header("Location: /index.php?error=file_too_large" . ($tx_id > 0 ? "&open_tx=" . $tx_id : ""));
        exit;
    }

    $allowed_types = ['image/jpeg', 'image/png', 'image/webp'];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($_FILES['photo']['tmp_name']);

    if (in_array($mime, $allowed_types)) {
        $safe_extensions = ['image/jpeg' => 'jpg', 'image/png'  => 'png', 'image/webp' => 'webp'];
        $ext = $safe_extensions[$mime]; 
        $filename = bin2hex(random_bytes(16)) . '.' . $ext; 
        
        $p_desc = trim($_POST['p_desc'] ?? ''); 
        
        if (move_uploaded_file($_FILES['photo']['tmp_name'], __DIR__ . "/../transmitter_photos/" . $filename)) {
            $stmt = $pdo->prepare("INSERT INTO transmitter_photos (transmitter_id, photo_filename, author, photo_date, description) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$tx_id, $filename, $_SESSION['username'], $p_date, $p_desc]);
        }
    }
    
    header("Location: /index.php" . ($tx_id > 0 ? "?open_tx=" . $tx_id : "")); 
    exit;
}

// SECURE AJAX DELETE LOGIC
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

// Fetching Users for Admin Panel
$all_users = ($user_role === 'admin') 
    ? $pdo->query("SELECT id, username, email, role FROM users ORDER BY username ASC")->fetchAll() 
    : [];
?>