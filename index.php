<?php
include 'db.php';
session_start();
$error = "";
$is_logged_in = isset($_SESSION['user_id']);
$user_role = $_SESSION['user_role'] ?? 'guest';

// Helper to check if user has management permissions (Editor or Admin)
$is_staff = ($user_role === 'admin' || $user_role === 'editor');

// --- PHP ACTION HANDLERS ---

if (isset($_POST['action']) && $_POST['action'] == 'login') {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$_POST['username']]);
    $user = $stmt->fetch();
    if ($user && password_verify($_POST['password'], $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role']; 
        header("Location: index.php"); exit;
    } else { $error = "AUTH_ERR"; }
}

if (isset($_POST['action']) && $_POST['action'] == 'register') {
    $user = $_POST['username'];
    $pass = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $default_role = 'user';
    
    $check = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $check->execute([$user]);
    if ($check->fetch()) {
        $error = "USER_EXISTS";
    } else {
        $stmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
        if ($stmt->execute([$user, $pass, $default_role])) {
            $_SESSION['user_id'] = $pdo->lastInsertId();
            $_SESSION['user_role'] = $default_role;
            header("Location: index.php"); exit;
        }
    }
}

// ADMIN ONLY ACTIONS
if ($user_role === 'admin') {
    if (isset($_POST['action']) && $_POST['action'] == 'update_user_role') {
        $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->execute([$_POST['new_role'], $_POST['target_user_id']]);
        header("Location: index.php"); exit;
    }
}

// Fetch all users for admin panel
$all_users = [];
if ($user_role === 'admin') {
    $all_users = $pdo->query("SELECT id, username, role FROM users ORDER BY username ASC")->fetchAll();
}

// STAFF ONLY ACTIONS (Admin/Editor)
if ($is_staff) {
    if (isset($_POST['action']) && $_POST['action'] == 'add') {
        $stmt = $pdo->prepare("INSERT INTO transmitters (name, lat, lng, country) VALUES (?, ?, ?, ?)");
        $stmt->execute([$_POST['name'], $_POST['lat'], $_POST['lng'], $_POST['country']]);
        header("Location: index.php"); exit;
    }

    if (isset($_POST['action']) && $_POST['action'] == 'update_transmitter') {
        $stmt = $pdo->prepare("UPDATE transmitters SET name=?, lat=?, lng=?, country=? WHERE id=?");
        $stmt->execute([$_POST['name'], $_POST['lat'], $_POST['lng'], $_POST['country'], $_POST['tx_id']]);
        header("Location: index.php"); exit;
    }

    if (isset($_GET['delete_transmitter'])) {
        $tx_id = $_GET['delete_transmitter'];
        $stmt = $pdo->prepare("SELECT photo_filename FROM transmitter_photos WHERE transmitter_id = ?");
        $stmt->execute([$tx_id]);
        while ($photo = $stmt->fetch()) {
            if (file_exists("transmitters/" . $photo['photo_filename'])) unlink("transmitters/" . $photo['photo_filename']);
        }
        $pdo->prepare("DELETE FROM stations WHERE transmitter_id = ?")->execute([$tx_id]);
        $pdo->prepare("DELETE FROM transmitter_photos WHERE transmitter_id = ?")->execute([$tx_id]);
        $pdo->prepare("DELETE FROM transmitters WHERE id = ?")->execute([$tx_id]);
        header("Location: index.php"); exit;
    }

    if (isset($_GET['delete_photo'])) {
        $stmt = $pdo->prepare("SELECT photo_filename FROM transmitter_photos WHERE id = ?");
        $stmt->execute([$_GET['delete_photo']]);
        $photo = $stmt->fetch();
        if ($photo) {
            if (file_exists("transmitters/" . $photo['photo_filename'])) unlink("transmitters/" . $photo['photo_filename']);
            $pdo->prepare("DELETE FROM transmitter_photos WHERE id = ?")->execute([$_GET['delete_photo']]);
        }
        header("Location: index.php"); exit;
    }

    if (isset($_POST['action']) && $_POST['action'] == 'Add station') {
        $stmt = $pdo->prepare("INSERT INTO stations (transmitter_id, station_name, frequency, power_kw, polarization, pi_code) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$_POST['transmitter_id'], $_POST['s_name'], $_POST['s_freq'], $_POST['s_pwr'], $_POST['s_pol'], strtoupper($_POST['s_pi'])]);
        header("Location: index.php"); exit;
    }

    if (isset($_POST['action']) && $_POST['action'] == 'Update station') {
        $stmt = $pdo->prepare("UPDATE stations SET station_name=?, frequency=?, power_kw=?, polarization=?, pi_code=? WHERE id=?");
        $stmt->execute([$_POST['s_name'], $_POST['s_freq'], $_POST['s_pwr'], $_POST['s_pol'], strtoupper($_POST['s_pi']), $_POST['station_id']]);
        header("Location: index.php"); exit;
    }

    if (isset($_GET['delete_station'])) {
        $pdo->prepare("DELETE FROM stations WHERE id = ?")->execute([$_GET['delete_station']]);
        header("Location: index.php"); exit;
    }
}

// LOGGED IN USERS (Admin, Editor, AND User)
if (isset($_POST['action']) && $_POST['action'] == 'upload_photo' && $is_logged_in) {
    if (!empty($_FILES['photo']['name'])) {
        $filename = time() . '_' . basename($_FILES['photo']['name']);
        if (move_uploaded_file($_FILES['photo']['tmp_name'], "transmitters/" . $filename)) {
            $stmt = $pdo->prepare("INSERT INTO transmitter_photos (transmitter_id, photo_filename, author, photo_date, description) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$_POST['transmitter_id'], $filename, $_POST['p_author'], $_POST['p_date'], $_POST['p_desc']]);
        }
    }
    header("Location: index.php"); exit;
}

$countries = ["AFG" => "Afghanistan", "ALB" => "Albania", "DZA" => "Algeria", "AND" => "Andorra", "ARG" => "Argentina", "AUS" => "Australia", "AUT" => "Austria", "BEL" => "Belgium", "BRA" => "Brazil", "CAN" => "Canada", "CHN" => "China", "HRV" => "Croatia", "CZE" => "Czechia", "DNK" => "Denmark", "EGY" => "Egypt", "FIN" => "Finland", "FRA" => "France", "DEU" => "Germany", "GRC" => "Greece", "HUN" => "Hungary", "ISL" => "Iceland", "IND" => "India", "IRL" => "Ireland", "ISR" => "Israel", "ITA" => "Italy", "JPN" => "Japan", "MEX" => "Mexico", "NLD" => "Netherlands", "NOR" => "Norway", "POL" => "Poland", "PRT" => "Portugal", "ROU" => "Romania", "RUS" => "Russia", "SRB" => "Serbia", "SVK" => "Slovakia", "ESP" => "Spain", "SWE" => "Sweden", "CHE" => "Switzerland", "TUR" => "Turkey", "UKR" => "Ukraine", "GBR" => "United Kingdom", "USA" => "United States"];
?>
<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maps | FMDX.org</title>
    <link rel="shortcut icon" href="favicon.png" type="image/x-icon">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="style.css">
</head>
<body class="h-full overflow-hidden bg-[#1a1c21]">

    <script>
        const IS_LOGGED_IN = <?php echo $is_logged_in ? 'true' : 'false'; ?>;
        const USER_ROLE = "<?php echo $user_role; ?>";
        const IS_STAFF = <?php echo $is_staff ? 'true' : 'false'; ?>;
    </script>

    <nav class="fixed top-6 left-6 right-6 z-[2000] flex justify-between items-center px-8 py-4 rounded-3xl glass shadow-2xl">
        <div class="flex items-center gap-4"><img src="logo.png" class="h-10 w-auto"></div>
        <div class="flex gap-4 items-center">
            <?php if($is_logged_in): ?>
                <?php if($user_role === 'admin'): ?>
                    <button onclick="toggleModal('adminModal')" class="bg-[#4db691] hover:bg-[#5cd9ad] text-[#202228] px-6 py-2.5 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition shadow-lg">Admin Panel</button>
                <?php endif; ?>
                <?php if($is_staff): ?>
                    <button onclick="prepareAddModal()" class="bg-[#4db691] hover:bg-[#5cd9ad] text-[#202228] px-6 py-2.5 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition shadow-lg">Add a transmitter</button>
                <?php endif; ?>
                <a href="logout.php" class="text-[#888] hover:text-[#4db691] text-[11px] font-bold ml-4 uppercase transition tracking-widest">Logout</a>
            <?php else: ?>
                <button onclick="toggleModal('loginModal')" class="bg-transparent border border-white/20 hover:border-white/50 text-white px-6 py-2.5 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition">LOGIN</button>
                <button onclick="toggleModal('registerModal')" class="bg-[#4db691] hover:bg-[#5cd9ad] text-[#202228] px-6 py-2.5 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition shadow-lg">REGISTER</button>
            <?php endif; ?>
        </div>
    </nav>

    <div class="fixed top-28 left-6 z-[2000] w-80 glass p-8 rounded-[2.5rem] shadow-2xl text-left">
        <h3 class="text-[10px] font-bold text-[#4db691] uppercase tracking-[0.4em] mb-6">Filter settings</h3>
        <div class="space-y-3">
            <input type="text" id="tx-name" placeholder="Transmitter name" class="filter-input w-full rounded-xl">
            <input type="text" id="station-name" placeholder="Station name" class="filter-input w-full rounded-xl">
            <div class="grid grid-cols-2 gap-3">
                <input type="number" id="f-freq" placeholder="MHz" class="filter-input rounded-xl">
                <input type="number" id="f-power" placeholder="min kW" class="filter-input rounded-xl">
            </div>
            <input type="text" id="f-pi" placeholder="PI code" class="filter-input w-full rounded-xl">
            <input list="country-list" id="f-country" placeholder="Select Country..." class="filter-input w-full rounded-xl">
            <datalist id="country-list"><?php foreach($countries as $code => $name): ?><option value="<?php echo $code; ?>"><?php echo $code . " - " . $name; ?></option><?php endforeach; ?></datalist>
            <button onclick="resetFilters()" class="w-full py-3 text-[10px] font-bold text-[#888] hover:text-[#5cd9ad] transition uppercase pt-4">Reset filters</button>
        </div>
    </div>

    <div id="map"></div>
    <div id="layer-box" class="fixed bottom-8 left-8 z-[2000] flex p-1 bg-[#202228] rounded-2xl border border-white/10 shadow-2xl">
        <button id="btn-light" onclick="switchLayer('light')" class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#4db691] transition bg-white/10 rounded-xl">Vector</button>
        <button id="btn-hybrid" onclick="switchLayer('hybrid')" class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#4db691] transition rounded-xl ml-1">Satellite</button>
    </div>

    <div id="sidebar" class="flex flex-col text-left">
        <div class="p-8 flex justify-between items-center border-b border-white/5 bg-[#202228]">
            <h2 class="font-bold text-[#4db691] text-xs uppercase tracking-[0.4em]">Transmitter details</h2>
            <button onclick="closeSidebar()" class="text-white hover:text-[#ff4242] transition text-4xl font-light leading-none">×</button>
        </div>
        <div id="sidebar-content" class="flex-1 overflow-y-auto p-10"></div>
    </div>

    <div id="registerModal" class="modal p-6"><div class="relative bg-[#202228] border border-[#4db691]/30 p-12 rounded-[3.5rem] w-full max-w-md shadow-2xl text-left"><button onclick="toggleModal('registerModal')" class="absolute top-8 right-8 text-[#888] hover:text-[#ff4242] transition"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button><h2 class="font-black text-[#4db691] mb-10 tracking-widest uppercase text-lg">Registration</h2><form method="POST" class="space-y-5"><input type="hidden" name="action" value="register"><input type="text" name="username" placeholder="Username" class="w-full bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white focus:border-[#4db691] outline-none" required><input type="password" name="password" placeholder="Password" class="w-full bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white focus:border-[#4db691] outline-none" required><button class="w-full py-5 bg-[#4db691] hover:bg-[#5cd9ad] text-black rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl transition">Create account</button></form></div></div>

    <div id="loginModal" class="modal p-6"><div class="relative bg-[#202228] border border-[#4db691]/30 p-12 rounded-[3.5rem] w-full max-w-md shadow-2xl text-left"><button onclick="toggleModal('loginModal')" class="absolute top-8 right-8 text-[#888] hover:text-[#ff4242] transition"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button><h2 class="font-black text-[#4db691] mb-10 tracking-widest uppercase text-lg">Authorization</h2><form method="POST" class="space-y-5"><input type="hidden" name="action" value="login"><input type="text" name="username" placeholder="Username" class="w-full bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white focus:border-[#4db691] outline-none"><input type="password" name="password" placeholder="Password" class="w-full bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white focus:border-[#4db691] outline-none"><button class="w-full py-5 bg-[#4db691] hover:bg-[#5cd9ad] text-black rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl transition">Login</button></form></div></div>

    <?php if($is_staff): ?>
    <div id="addModal" class="modal p-6"><div class="relative bg-[#202228] border border-[#4db691]/30 p-12 rounded-[3.5rem] w-full max-w-lg shadow-2xl text-left"><button onclick="toggleModal('addModal')" class="absolute top-8 right-8 text-[#888] hover:text-[#ff4242] transition"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button><h2 id="add-modal-title" class="font-bold text-[#4db691] text-center uppercase tracking-widest mb-10 text-lg">Add a transmitter</h2><form method="POST" id="add-modal-form" class="space-y-6"><input type="hidden" name="action" id="add-modal-action" value="add"><input type="hidden" name="tx_id" id="add-modal-txid"><input type="text" name="name" id="add-modal-name" class="w-full bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#4db691]" placeholder="Transmitter name" required><select name="country" id="add-modal-country" hidden class="w-full bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#4db691]" required><option value="" disabled selected>Select country</option><?php foreach($countries as $code => $name): ?><option value="<?php echo $code; ?>"><?php echo $code." - ".$name; ?></option><?php endforeach; ?></select>
        
        <div class="grid grid-cols-5 gap-3 items-stretch">
            <input type="text" name="lat" id="formLat" class="col-span-2 bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white text-xs focus:border-[#4db691] box-border leading-none" required placeholder="LAT">
            <input type="text" name="lng" id="formLng" class="col-span-2 bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white text-xs focus:border-[#4db691] box-border leading-none" required placeholder="LNG">
            <button type="button" onclick="startPicking()" class="col-span-1 bg-[#4db691]/10 text-[#4db691] border border-[#4db691]/30 p-5 rounded-2xl flex items-center justify-center hover:bg-[#4db691] hover:text-black transition shadow-lg box-border">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
            </button>
        </div>

        <button id="add-modal-submit" class="w-full py-5 bg-[#4db691] hover:bg-[#5cd9ad] text-black rounded-2xl transition flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="3" d="M12 4v16m8-8H4"/></svg></button></form></div></div>
    
    <div id="stationModal" class="modal p-6"><div class="relative bg-[#202228] border border-[#4db691]/30 p-12 rounded-[3.5rem] w-full max-w-lg shadow-2xl text-left"><button onclick="toggleModal('stationModal')" class="absolute top-8 right-8 text-[#888] hover:text-[#ff4242] transition"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button><h2 id="st-modal-title" class="font-bold text-[#4db691] text-center uppercase mb-10 text-lg tracking-widest">Station data</h2><form method="POST" class="space-y-5"><input type="hidden" name="action" id="st-modal-action" value="add_station"><input type="hidden" name="transmitter_id" id="st-modal-tid"><input type="hidden" name="station_id" id="st-modal-sid"><input type="text" name="s_name" id="st-modal-name" placeholder="Station name" class="w-full bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#4db691]"><div class="grid grid-cols-2 gap-4"><input type="number" step="0.01" name="s_freq" id="st-modal-freq" placeholder="Frequency" class="bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white focus:border-[#4db691]"><input type="number" step="0.1" name="s_pwr" id="st-modal-pwr" placeholder="Power" class="bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white focus:border-[#4db691]"></div><div class="grid grid-cols-2 gap-4"><select name="s_pol" id="st-modal-pol" class="bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white text-[10px] font-bold uppercase outline-none"><option value="H">Horizontal</option><option value="V">Vertical</option><option value="M">Mixed</option><option value="C">Circular</option></select><input type="text" oninput="this.value = this.value.toUpperCase()" name="s_pi" id="st-modal-pi" placeholder="PI code" class="bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white focus:border-[#4db691]"></div><button class="w-full py-4 bg-[#4db691] text-black rounded-2xl font-bold uppercase text-[10px] mt-6 transition">Save changes</button></form></div></div>
    <?php endif; ?>

    <?php if($user_role === 'admin'): ?>
    <div id="adminModal" class="modal p-6">
        <div class="relative bg-[#202228] border border-[#ff4242]/30 p-12 rounded-[3.5rem] w-full max-w-2xl shadow-2xl text-left">
            <button onclick="toggleModal('adminModal')" class="absolute top-8 right-8 text-[#888] hover:text-[#ff4242] transition"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button>
            <h2 class="font-black text-[#ff4242] mb-10 tracking-widest uppercase text-lg">User Management</h2>
            
            <input type="text" id="admin-user-search" placeholder="Search user ID or name..." class="w-full bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white focus:border-[#ff4242] outline-none mb-8">
            
            <div class="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                <?php foreach($all_users as $u): ?>
                <div class="admin-user-row flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition" data-search="<?php echo strtolower($u['username'] . ' ' . $u['id']); ?>">
                    <div>
                        <div class="text-white font-bold text-sm"><?php echo htmlspecialchars($u['username']); ?></div>
                        <div class="text-[10px] text-[#888] uppercase tracking-[0.2em]">UID: <?php echo $u['id']; ?></div>
                    </div>
                    <form method="POST" class="flex gap-2">
                        <input type="hidden" name="action" value="update_user_role">
                        <input type="hidden" name="target_user_id" value="<?php echo $u['id']; ?>">
                        <select name="new_role" onchange="this.form.submit()" class="bg-[#25272e] border border-white/10 text-[#4db691] text-[10px] font-bold uppercase p-3 rounded-xl outline-none focus:border-[#4db691]">
                            <option value="user" <?php echo $u['role'] == 'user' ? 'selected' : ''; ?>>User</option>
                            <option value="editor" <?php echo $u['role'] == 'editor' ? 'selected' : ''; ?>>Editor</option>
                            <option value="admin" <?php echo $u['role'] == 'admin' ? 'selected' : ''; ?>>Admin</option>
                        </select>
                    </form>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <div id="photoModal" class="modal p-6"><div class="relative bg-[#202228] border border-[#4db691]/30 p-12 rounded-[3.5rem] w-full max-w-lg shadow-2xl text-left"><button onclick="toggleModal('photoModal')" class="absolute top-8 right-8 text-[#888] hover:text-[#ff4242] transition"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button><h2 class="mono font-bold text-[#4db691] text-center uppercase mb-10 text-lg tracking-widest">Add a photo</h2><form method="POST" enctype="multipart/form-data" class="space-y-5"><input type="hidden" name="action" value="upload_photo"><input type="hidden" name="transmitter_id" id="ph-modal-tid"><input type="file" name="photo" class="w-full text-xs text-[#888] block file:bg-[#4db691]/10 file:text-[#4db691] file:border-0 file:px-4 file:py-2 file:rounded-xl file:mr-4 file:font-bold" required><input type="text" name="p_author" placeholder="Author" class="w-full bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white text-xs focus:border-[#4db691]"><input type="date" name="p_date" class="w-full bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white mono text-xs focus:border-[#4db691]"><textarea name="p_desc" placeholder="Description" class="w-full bg-[#25272e] border border-white/10 p-5 rounded-2xl text-white text-xs h-24 outline-none focus:border-[#4db691]"></textarea><button class="w-full py-4 bg-[#4db691] text-black rounded-2xl font-bold uppercase text-[10px] mt-6 transition">Upload</button></form></div></div>

    <div id="photoViewer" style="display:none;" class="fixed inset-0 z-[5000] bg-black/95 flex flex-col items-center justify-center p-10">
        <button onclick="this.parentElement.style.display='none'" class="absolute top-10 right-10 text-white text-5xl font-light hover:text-[#ff4242] transition">×</button>
        <img id="viewerImg" src="" class="max-w-full max-h-[75vh] object-contain shadow-2xl rounded-2xl border border-white/10">
        <div class="mt-8 text-center max-w-2xl">
            <div id="viewerAuthor" class="text-[#4db691] font-bold uppercase tracking-[0.3em] text-sm mb-1"></div>
            <div id="viewerDate" class="text-white/40 text-[10px] font-mono uppercase mb-4 tracking-widest"></div>
            <div id="viewerDesc" class="text-white/80 text-sm leading-relaxed italic border-t border-white/5 pt-4"></div>
        </div>
    </div>

    <script rel="application/javascript" src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script rel="application/javascript" type="module" src="script.js"></script>
</body>
</html>