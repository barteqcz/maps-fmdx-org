<?php
include 'db.php';
session_start();
if (!isset($_SESSION['user_id'])) { header("Location: login.php"); exit; }

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // 1. Upload Photo
    $photoName = null;
    if (!empty($_FILES['photo']['name'])) {
        $photoName = time() . '_' . $_FILES['photo']['name'];
        move_uploaded_file($_FILES['photo']['tmp_name'], "uploads/" . $photoName);
    }

    // 2. Insert Transmitter
    $stmt = $pdo->prepare("INSERT INTO transmitters (name, lat, lng, photo) VALUES (?, ?, ?, ?)");
    $stmt->execute([$_POST['name'], $_POST['lat'], $_POST['lng'], $photoName]);
    $t_id = $pdo->lastInsertId();

    // 3. Insert Stations
    $stmt = $pdo->prepare("INSERT INTO stations (transmitter_id, station_name, frequency, power_kw) VALUES (?, ?, ?, ?)");
    $stmt->execute([$t_id, $_POST['station_name'], $_POST['freq'], $_POST['power']]);

    header("Location: index.php");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-200 h-screen flex items-center justify-center p-4" 
      style="background-image: url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80'); background-size: cover;">
    
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-md"></div>

    <div class="relative w-full max-w-xl bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white">
        <a href="index.php" class="text-sm font-bold text-blue-600 mb-4 inline-block">← Back to Map</a>
        <h2 class="text-3xl font-black text-slate-800 mb-2">New Transmitter</h2>
        <p class="text-slate-500 mb-8">Pinpoint a new radio tower location in the global database.</p>
        
        <form action="add.php" method="POST" enctype="multipart/form-data" class="space-y-4">
            <!-- Form fields with rounded-xl and subtle borders -->
            <input type="text" name="name" placeholder="Transmitter Name" class="w-full p-4 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
            
            <div class="grid grid-cols-2 gap-4">
                <input type="number" step="any" name="lat" placeholder="Latitude" class="p-4 bg-white rounded-xl border border-slate-200">
                <input type="number" step="any" name="lng" placeholder="Longitude" class="p-4 bg-white rounded-xl border border-slate-200">
            </div>

            <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <h3 class="text-blue-800 font-bold text-sm mb-3 uppercase tracking-widest">Initial Station Data</h3>
                <div class="space-y-3">
                    <input type="text" name="station_name" placeholder="Station Name" class="w-full p-3 rounded-lg border-none shadow-sm">
                    <div class="grid grid-cols-2 gap-3">
                        <input type="number" step="0.1" name="freq" placeholder="Freq (MHz)" class="p-3 rounded-lg border-none shadow-sm">
                        <input type="number" step="0.01" name="power" placeholder="Power (kW)" class="p-3 rounded-lg border-none shadow-sm">
                    </div>
                </div>
            </div>

            <label class="block group cursor-pointer">
                <span class="block text-sm font-bold text-slate-600 mb-2">Upload Photo</span>
                <input type="file" name="photo" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
            </label>

            <button class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all transform active:scale-95">
                Save Transmitter
            </button>
        </form>
    </div>
</body>
</html>