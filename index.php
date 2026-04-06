<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maps | FMDX.org</title>
    <link rel="shortcut icon" href="/img_assets/favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="style.css">
    <meta name="csrf-token" content="<?php echo $_SESSION['csrf_token'] ?? ''; ?>">
</head>
<body>
    <?php 
    include 'php/main.php';
    ?>

    <script>
        const IS_LOGGED_IN = <?php echo json_encode($is_logged_in); ?>;
        const USER_ROLE = <?php echo json_encode($user_role); ?>;
        const IS_STAFF = <?php echo json_encode($is_staff); ?>;
        const AUTH_ERROR = <?php echo json_encode($error); ?>;
        const CSRF_TOKEN = <?php echo json_encode($_SESSION['csrf_token'] ?? ''); ?>;
        // Add this line:
        const COOLDOWN_SECONDS = <?php echo json_encode($remaining_cooldown_seconds ?? 0); ?>;
    </script>

    <nav class="main-nav glass">
        <div class="logo-container"><img src="/img_assets/logo.png" class="nav-logo"></div>
        <div class="nav-actions">
            <?php if($is_logged_in): ?>
                <?php if($user_role === 'admin'): ?>
                    <button onclick="toggleModal('adminModal')" class="btn btn-primary">Admin Panel</button>
                <?php endif; ?>
                <?php if($is_staff): ?>
                    <button onclick="prepareAddModal()" class="btn btn-primary">Add a transmitter</button>
                <?php endif; ?>
                <a href="/php/logout.php" class="nav-link">Logout</a>
            <?php else: ?>
                <button onclick="toggleModal('loginModal')" class="btn btn-outline">LOGIN</button>
                <button onclick="toggleModal('registerModal')" class="btn btn-primary">REGISTER</button>
            <?php endif; ?>
        </div>
    </nav>

    <div class="filter-panel glass">
        <h3 class="panel-title">Filter settings</h3>
        <div class="filter-group">
            <input type="text" id="tx-name" placeholder="Transmitter name" class="filter-input">
            <input type="text" id="station-name" placeholder="Station name" class="filter-input">
            <div class="grid-2">
                <input type="number" id="f-freq" placeholder="Frequency" class="filter-input">
                <input type="number" id="f-power" placeholder="min kW" class="filter-input">
            </div>
            <input type="text" id="f-pi" placeholder="PI code" class="filter-input">
            <input list="country-list" id="f-country" placeholder="Select Country..." class="filter-input">
            <datalist id="country-list"><?php foreach($countries as $code => $name): ?><option value="<?php echo $code; ?>"><?php echo $code . " - " . $name; ?></option><?php endforeach; ?></datalist>
            <button onclick="resetFilters()" class="btn-reset">Reset filters</button>
        </div>
    </div>

    <div id="map"></div>
    
    <div id="layer-box" class="layer-box">
        <button id="btn-light" onclick="switchLayer('light')" class="btn-layer active">Standard</button>
        <button id="btn-hybrid" onclick="switchLayer('hybrid')" class="btn-layer inactive">Satellite</button>
    </div>

    <div id="sidebar">
        <div class="sidebar-header">
            <h2 class="sidebar-title">Transmitter details</h2>
            <button onclick="closeSidebar()" class="btn-modal-close"><i data-lucide="x"></i></button>
        </div>
        <div id="sidebar-content"></div>
    </div>

    <div id="registerModal" class="modal">
        <div class="modal-content">
            <button onclick="toggleModal('registerModal')" class="btn-modal-close"><i data-lucide="x"></i></button>
            <h2 class="modal-title">Registration</h2>
            
            <div id="register-error-msg" class="login_register-error"></div>
            
            <form method="POST" class="form" id="register-form">
                <input type="hidden" name="action" value="register">
                <input type="text" name="username" placeholder="Username" class="form-input" required>
                <input type="password" name="password" id="reg-password" placeholder="Password" class="form-input" required>
                <button class="btn-submit" type="submit">Create account</button>
                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
            </form>
        </div>
    </div>

    <div id="loginModal" class="modal">
        <div class="modal-content">
            <button onclick="toggleModal('loginModal')" class="btn-modal-close"><i data-lucide="x"></i></button>
            <h2 class="modal-title">Authorization</h2>
            
            <div id="login-error-msg" class="login_register-error">Invalid username or password.</div>
            
            <form method="POST" class="form">
                <input type="hidden" name="action" value="login">
                <input type="text" name="username" placeholder="Username" class="form-input" required>
                <input type="password" name="password" placeholder="Password" class="form-input" required>
                <button class="btn-submit">Login</button>
                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
            </form>
        </div>
    </div>

    <?php if($is_staff): ?>
    <div id="transmitter-modal" class="modal">
        <div class="modal-content lg">
            <button onclick="toggleModal('transmitter-modal')" class="btn-modal-close"><i data-lucide="x"></i></button>
            <h2 id="transmitter-modal-title" class="modal-title">Add a transmitter</h2>
            <form method="POST" id="transmitter-form" class="form">
                <input type="hidden" name="action" id="transmitter-modal-action" value="add_transmitter">
                <input type="hidden" name="transmitter_id" id="transmitter-modal-id">
                
                <input type="text" name="transmitter_name" id="transmitter-modal-name" class="form-input" placeholder="Transmitter name" required>
                
                <div class="grid-5">
                    <input type="number" step="0.000001" name="latitude" id="transmitter-modal-lat" class="form-input text-xs col-span-2" required placeholder="LAT">
                    <input type="number" step="0.000001" name="longitude" id="transmitter-modal-lng" class="form-input text-xs col-span-2" required placeholder="LNG">
                    <button type="button" onclick="startMapCoordinatesPicker()" class="btn-icon-outline col-span-1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    </button>
                </div>
                
                <button type="submit" class="btn-submit">Save Transmitter</button>
                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
            </form>
        </div>
    </div>
    
    <div id="station-modal" class="modal">
        <div class="modal-content lg">
            <button onclick="toggleModal('station-modal')" class="btn-modal-close"><i data-lucide="x"></i></button>
            <h2 id="station-modal-title" class="modal-title">Station data</h2>
            <form method="POST" class="form">
                <input type="hidden" name="action" id="station-modal-action" value="add_station">
                <input type="hidden" name="transmitter_id" id="station-modal-transmitter-id">
                <input type="hidden" name="station_id" id="station-modal-id">
                
                <input type="text" name="station_name" id="station-modal-name" placeholder="Station name" class="form-input">
                <div class="grid-2">
                    <input type="number" step="0.1" name="station_frequency" id="station-modal-frequency" placeholder="Frequency" class="form-input" required>
                    <input type="number" step="0.001" name="station_power" id="station-modal-power" placeholder="Power" class="form-input" required>
                </div>
                <div class="grid-2">
                    <select name="station_polarization" id="station-modal-polarization" class="form-select text-xs">
                        <option value="H">Horizontal</option>
                        <option value="V">Vertical</option>
                        <option value="M">Mixed</option>
                        <option value="C">Circular</option>
                        <option value="?">Unknown</option>
                    </select>
                    <input type="text" name="station_pi_code" id="station-modal-pi-code" placeholder="PI code" class="form-input" required oninput="this.value = this.value.toUpperCase()">
                </div>
                <button class="btn-submit">Save changes</button>
                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
            </form>
        </div>
    </div>
    <?php endif; ?>

    <div id="deleteTransmitterModal" class="modal">
        <div class="modal-content">
            <button onclick="toggleModal('deleteTransmitterModal')" class="btn-modal-close"><i data-lucide="x"></i></button>
            <h2 class="modal-title">Confirm Deletion</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem; text-align: center;">
                Are you sure? This will permanently delete the transmitter and all associated stations and photos.
            </p>
            <div class="grid-2">
                <button onclick="toggleModal('deleteTransmitterModal')" class="btn btn-outline">Cancel</button>
                <button id="confirmDeleteTransmitterBtn" class="btn-submit btn-delete">Delete</button>
            </div>
        </div>
    </div>

    <div id="deleteStationModal" class="modal">
        <div class="modal-content">
            <button onclick="toggleModal('deleteStationModal')" class="btn-modal-close"><i data-lucide="x"></i></button>
            <h2 class="modal-title">Confirm Deletion</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem; text-align: center;">
                Are you sure? This will permanently delete this station.
            </p>
            <div class="grid-2">
                <button onclick="toggleModal('deleteStationModal')" class="btn btn-outline">Cancel</button>
                <button id="confirmDeleteStationBtn" class="btn-submit btn-delete">Delete</button>
            </div>
        </div>
    </div>

    <div id="deletePhotoModal" class="modal">
        <div class="modal-content">
            <button onclick="toggleModal('deletePhotoModal')" class="btn-modal-close"><i data-lucide="x"></i></button>
            <h2 class="modal-title">Confirm Deletion</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem; text-align: center;">
                Are you sure you want to permanently delete this photo?
            </p>
            <div class="grid-2">
                <button onclick="toggleModal('deletePhotoModal')" class="btn btn-outline">Cancel</button>
                <button id="confirmDeletePhotoBtn" class="btn-submit btn-delete">Delete</button>
            </div>
        </div>
    </div>

    <?php if($user_role === 'admin'): ?>
    <div id="adminModal" class="modal">
        <div class="modal-content xl">
            <button onclick="toggleModal('adminModal')" class="btn-modal-close"><i data-lucide="x"></i></button>
            <h2 class="modal-title">User Management</h2>
            <input type="text" id="admin-user-search" placeholder="Search user ID or name..." class="form-input focus-red mb-8">
            <div class="admin-list">
                <?php foreach($all_users as $u): ?>
                <div class="admin-user-row" data-search="<?php echo htmlspecialchars(strtolower($u['username'] . ' ' . $u['id']), ENT_QUOTES, 'UTF-8'); ?>">
                    <div><div class="admin-user-name"><?php echo htmlspecialchars($u['username']); ?></div><div class="admin-user-id">UID: <?php echo $u['id']; ?></div></div>
                    <form method="POST" style="display: flex; gap: 0.5rem;"><input type="hidden" name="action" value="update_user_role"><input type="hidden" name="target_user_id" value="<?php echo $u['id']; ?>"><select name="new_role" onchange="this.form.submit()" class="admin-select"><option value="user" <?php echo $u['role'] == 'user' ? 'selected' : ''; ?>>User</option><option value="editor" <?php echo $u['role'] == 'editor' ? 'selected' : ''; ?>>Editor</option><option value="admin" <?php echo $u['role'] == 'admin' ? 'selected' : ''; ?>>Admin</option></select><input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>"></form>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <div id="photoModal" class="modal">
        <div class="modal-content lg">
            <button onclick="toggleModal('photoModal')" class="btn-modal-close"><i data-lucide="x"></i></button>
            <h2 class="modal-title">Add a photo</h2>
            <form action="php/main.php" method="POST" enctype="multipart/form-data" class="form" style="display: flex; flex-direction: column; gap: 1rem;">
                <input type="hidden" name="action" value="upload_photo">
                <input type="hidden" name="transmitter_id" id="ph-modal-tid">
                
                <div>
                    <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; display: block;">Select Image (Max 5MB)</label>
                    <input type="file" name="photo" class="form-file" accept="image/jpeg, image/png, image/webp" required>
                </div>
                
                <div>
                    <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; display: block;">Date Taken</label>
                    <input type="date" name="p_date" class="form-input mono text-xs" required>
                </div>
                
                <textarea name="p_desc" placeholder="Description" class="form-textarea text-xs" rows="3"></textarea>
                
                <button type="submit" class="btn-submit">Upload</button>
                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
            </form>
        </div>
    </div>

    <div id="photoViewer">
        <button onclick="this.parentElement.style.display='none'" class="viewer-close">×</button>
        
        <button class="nav-arrow" onclick="event.stopPropagation(); prevPhoto()" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); font-size: 2rem; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 1000; transition: 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.9)'" onmouseout="this.style.background='rgba(0,0,0,0.6)'">❮</button>
        
        <button class="nav-arrow" onclick="event.stopPropagation(); nextPhoto()" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 2rem; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 1000; transition: 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.9)'" onmouseout="this.style.background='rgba(0,0,0,0.6)'">❯</button>

        <img id="viewerImg" src="">
        <div class="viewer-meta">
            <div id="viewerAuthor" class="viewer-author"></div>
            <div id="viewerDate" class="viewer-date"></div>
            <div id="viewerDesc" class="viewer-desc"></div>
        </div>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="/js/script.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>lucide.createIcons();</script>
</body>
</html>