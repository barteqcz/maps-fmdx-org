/**
 * maps.fmdx.org - Core Logic
 */

import { countryBounds, iso2to3 } from '/constants.js';

let allTransmitters = [],
    markerMap = new Map(),
    activeMarker = null,
    currentPhotos = [],
    photoIndex = 0;
let receiverLocation = null,
    receiverMarker = null,
    activeLine = null,
    currentLineTargetId = null;
let lastView = { center: [51, 10], zoom: 5 };
let lastFilteredCountry = "";
let isPicking = false;

// --- Map Setup ---
const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
const borders = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}');
const hybrid = L.layerGroup([satellite, borders]);
const light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png');

const map = L.map('map', {
    zoomControl: false,
    layers: [light]
}).setView([51, 10], 5);

const getTxIcon = (isActive = false) => L.divIcon({
    className: 'tx-icon-container' + (isActive ? ' tx-active' : ''),
    html: `<div class="tx-icon-png"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

const rxIcon = L.icon({
    iconUrl: 'rx.png',
    iconSize: [34, 26],
    iconAnchor: [16, 25]
});

// --- CORE FUNCTIONS ---

function switchLayer(type) {
    const bh = document.getElementById('btn-hybrid');
    const bl = document.getElementById('btn-light');
    
    if(type === 'hybrid') { 
        map.addLayer(hybrid); 
        map.removeLayer(light); 
        document.body.classList.add('satellite-active'); 
        bh.classList.add('bg-white/10', 'text-[#4db691]');
        bh.classList.remove('text-slate-500');
        bl.classList.remove('bg-white/10', 'text-[#4db691]');
        bl.classList.add('text-slate-500');
    } else { 
        map.addLayer(light); 
        map.removeLayer(hybrid); 
        document.body.classList.remove('satellite-active'); 
        bl.classList.add('bg-white/10', 'text-[#4db691]');
        bl.classList.remove('text-slate-500');
        bh.classList.remove('bg-white/10', 'text-[#4db691]');
        bh.classList.add('text-slate-500');
    }
    // Save choice to browser storage
    localStorage.setItem('mapLayer', type);
}

function highlightMarker(id) {
    if (activeMarker) activeMarker.setIcon(getTxIcon(false));
    const m = markerMap.get(id);
    if (m) { m.setIcon(getTxIcon(true)); m.txId = id; activeMarker = m; }
}

function toggleModal(id) { 
    const el = document.getElementById(id);
    if(el) el.classList.toggle('active'); 
}

function closeSidebar() {
    const side = document.getElementById('sidebar');
    if (!side.classList.contains('open')) return;
    side.classList.remove('open');
    markerMap.forEach(m => m.setIcon(getTxIcon(false)));
    activeMarker = null;
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

function updateGeometry() {
    if (!receiverLocation) return;
    if (activeLine && currentLineTargetId) {
        const t = allTransmitters.find(x => x.id == currentLineTargetId);
        if (t) {
            const curvedPoints = getGreatCirclePoints(receiverLocation, {lat: t.lat, lng: t.lng});
            activeLine.setLatLngs(curvedPoints);
        }
    }
    applyFilters();
    if (activeMarker) {
        const txId = [...markerMap.entries()].find(([k, v]) => v === activeMarker)[0];
        openSidebarById(txId);
    }
}

function getGreatCirclePoints(start, end, pointsCount = 100) {
    const deg2rad = Math.PI / 180;
    const rad2deg = 180 / Math.PI;
    const lat1 = start.lat * deg2rad;
    const lon1 = start.lng * deg2rad;
    const lat2 = end.lat * deg2rad;
    const lon2 = end.lng * deg2rad;
    const d = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)));
    const path = [];
    for (let i = 0; i <= pointsCount; i++) {
        const f = i / pointsCount;
        const A = Math.sin((1 - f) * d) / Math.sin(d);
        const B = Math.sin(f * d) / Math.sin(d);
        const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
        const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
        const z = A * Math.sin(lat1) + B * Math.sin(lat2);
        const lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
        const lon = Math.atan2(y, x);
        path.push([lat * rad2deg, lon * rad2deg]);
    }
    return path;
}

function drawPath(targetId) {
    if (!receiverLocation) return;
    if (activeLine) map.removeLayer(activeLine);
    const target = allTransmitters.find(x => x.id == targetId);
    if (target) {
        currentLineTargetId = targetId;
        const curvedPoints = getGreatCirclePoints(receiverLocation, {lat: target.lat, lng: target.lng});
        activeLine = L.polyline(curvedPoints, {
            color: '#ff4242',
            weight: 3,
            dashArray: '10, 10',
            opacity: 0.8,
            smoothFactor: 1
        }).addTo(map);
    }
}

// --- PHOTO / CAROUSEL ---

function updateCarousel() {
    const p = currentPhotos[photoIndex];
    if (!p) return;

    // Update Sidebar Image
    const sidebarImg = document.getElementById('carouselImg');
    if (sidebarImg) {
        sidebarImg.src = 'transmitters/' + p.photo_filename;
    }

    // Update Full-Screen Viewer (if open)
    const viewer = document.getElementById('photoViewer');
    if (viewer && viewer.style.display === 'flex') {
        const img = document.getElementById('viewerImg');
        const author = document.getElementById('viewerAuthor');
        const date = document.getElementById('viewerDate');
        const desc = document.getElementById('viewerDesc');

        if (img) img.src = 'transmitters/' + p.photo_filename;
        if (author) author.innerText = p.author ? 'Uploaded by: ' + p.author : 'Unknown Author';
        if (date) date.innerText = p.photo_date || '';
        if (desc) desc.innerText = p.description || '';
    }
}

function nextPhoto() { if (currentPhotos.length > 1) { photoIndex = (photoIndex + 1) % currentPhotos.length; updateCarousel(); } }
function prevPhoto() { if (currentPhotos.length > 1) { photoIndex = (photoIndex - 1 + currentPhotos.length) % currentPhotos.length; updateCarousel(); } }

function viewFull() {
    const p = currentPhotos[photoIndex];
    if (!p) return;
    const viewer = document.getElementById('photoViewer');
    const img = document.getElementById('viewerImg');
    const author = document.getElementById('viewerAuthor');
    const date = document.getElementById('viewerDate');
    const desc = document.getElementById('viewerDesc');
    
    if (img) img.src = 'transmitters/' + p.photo_filename;
    if (author) author.innerText = p.author ? 'Uploaded by: ' + p.author : 'Unknown Author';
    if (date) date.innerText = p.photo_date || '';
    if (desc) desc.innerText = p.description || '';

    viewer.style.cursor = 'default';

    // Add navigation buttons to the full viewer if more than one photo exists
    let navControls = viewer.querySelector('.full-viewer-nav');
    if (!navControls && currentPhotos.length > 1) {
        navControls = document.createElement('div');
        navControls.className = 'full-viewer-nav';
        navControls.innerHTML = `
            <button onclick="event.stopPropagation(); prevPhoto();" 
                    style="cursor: pointer;" 
                    class="absolute left-10 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-6xl p-4 transition-all">
                ❮
            </button>
            <button onclick="event.stopPropagation(); nextPhoto();" 
                    style="cursor: pointer;" 
                    class="absolute right-10 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-6xl p-4 transition-all">
                ❯
            </button>
        `;
        viewer.appendChild(navControls);
    } else if (navControls && currentPhotos.length <= 1) {
        navControls.remove();
    }

    viewer.style.display = 'flex'; 
}

function deleteCurrentPhoto() {
    const p = currentPhotos[photoIndex];
    if (p && confirm('Permanently delete this photo?')) window.location.href = '?delete_photo=' + p.id;
}

// --- FILTERING & URL LOGIC ---

function applyFilters() {
    // 1. Get values from the two inputs
    const txname = document.getElementById('tx-name').value.toLowerCase();
    const stationname = document.getElementById('station-name').value.toLowerCase();
    
    const ff = document.getElementById('f-freq').value;
    const pf = parseFloat(document.getElementById('f-power').value) || 0;
    const pif = document.getElementById('f-pi').value.toLowerCase();
    const cf = document.getElementById('f-country').value;

    // Save selection to browser storage
    if (cf !== "") {
        localStorage.setItem('userCountry', cf);
    } else {
        localStorage.removeItem('userCountry');
    }

    // --- URL Sync Logic ---
    const params = new URLSearchParams();
    if (txname) params.set('tx', txname);
    if (stationname) params.set('st', stationname);
    if (ff) params.set('freq', ff);
    if (pf) params.set('power', pf);
    if (pif) params.set('pi', pif);
    if (cf) params.set('country', cf);

    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState({}, '', newUrl);

    // --- Map Panning Logic ---
    if (cf !== "" && cf !== lastFilteredCountry && countryBounds[cf]) {
        lastFilteredCountry = cf;
        map.fitBounds(countryBounds[cf], { padding: [100, 100], animate: true, duration: 1.5 });
    } else if (cf === "") { 
        lastFilteredCountry = ""; 
    }

    // Clear existing markers
    markerMap.forEach(m => map.removeLayer(m));
    markerMap.clear();

    let visibleIds = new Set();

    // Only render if a country is selected
    if (cf !== "") {
        allTransmitters.forEach(t => {
            // Split filter logic
            const matchTx = t.name.toLowerCase().includes(txname);
            const matchSt = (stationname === "") || t.stations.some(s => s.station_name.toLowerCase().includes(stationname));
            const matchCountry = (t.country === cf);
            
            let ms = true;
            if (ff || pf || pif) {
                ms = t.stations.some(s =>
                    (ff ? parseFloat(s.frequency) == ff : true) &&
                    (pf ? parseFloat(s.power_kw) >= pf : true) &&
                    (pif ? (s.pi_code || "").toLowerCase().includes(pif) : true)
                );
            }

            if (matchTx && matchSt && matchCountry && ms) {
                visibleIds.add(t.id);
                const isCurrentlyActive = (activeMarker && activeMarker.txId == t.id);
                const m = L.marker([t.lat, t.lng], { icon: getTxIcon(isCurrentlyActive) }).addTo(map);
                m.txId = t.id;

                // --- Integrated Hover "Dialog" ---
                m.on('mouseover', function(e) { 
                    let distHtml = "";
                    if (receiverLocation) {
                        const dist = getDistance(receiverLocation.lat, receiverLocation.lng, t.lat, t.lng);
                        distHtml = `
                            <div class="mt-2 inline-block px-2 py-1 bg-white/5 border border-white/10 text-[#4db691] rounded font-bold italic mono text-[9px] tracking-wider uppercase">
                                Distance: ${dist} km
                            </div>`;
                    }

                    // WIDER Box and SMALLER Font
                    L.popup({ offset: [0, -20], closeButton: false, minWidth: 400, maxWidth: 400 })
                        .setLatLng(e.latlng)
                        .setContent(`
                            <div class="p-6 text-left">
                                <div class="text-[1.2em] font-bold uppercase tracking-tight text-white mb-1 leading-tight text-left">${t.name}</div>
                                ${distHtml}
                            </div>
                        `).openOn(map); 
                });

                m.on('mouseout', () => map.closePopup());

                // Click and Context Events
                m.on('click', () => {
                    if (activeMarker && activeMarker.txId == t.id && document.getElementById('sidebar').classList.contains('open')) { 
                        closeSidebar(); 
                    } else { 
                        openSidebarById(t.id); 
                    }
                });

                m.on('contextmenu', (e) => {
                    L.DomEvent.stopPropagation(e);
                    drawPath(t.id);
                });

                markerMap.set(t.id, m);
            }
        });
    }

    // --- Cleanup ---
    if (activeLine && currentLineTargetId && !visibleIds.has(currentLineTargetId)) {
        map.removeLayer(activeLine);
        activeLine = null;
        currentLineTargetId = null;
    }
    if (activeMarker && !visibleIds.has(activeMarker.txId)) {
        closeSidebar();
    }
}

function resetFilters() {
    closeSidebar();
    if (activeMarker) { activeMarker.setIcon(getTxIcon(false)); activeMarker = null; }
    if (activeLine) { map.removeLayer(activeLine); activeLine = null; currentLineTargetId = null; }
    document.getElementById('tx-name').value = '';
    document.getElementById('station-name').value = '';
    document.getElementById('f-freq').value = '';
    document.getElementById('f-power').value = ''; 
    document.getElementById('f-pi').value = '';
    const savedCountry = localStorage.getItem('userCountry');
    document.getElementById('f-country').value = savedCountry || '';
    lastFilteredCountry = "";
    applyFilters();
}

function filterByStationName(n) {
    // Corrected to target 'station-name' input
    document.getElementById('station-name').value = n;
    closeSidebar();
    applyFilters();
}

// --- MODALS & SIDEBAR ---

function prepareAddModal() {
    const submitBtn = document.getElementById('add-modal-submit');
    document.getElementById('add-modal-title').innerText = 'Add a transmitter';
    document.getElementById('add-modal-action').value = 'add';
    submitBtn.innerHTML = "Save changes";
    document.getElementById('add-modal-form').reset();
    document.getElementById('add-modal-txid').value = '';
    toggleModal('addModal');
}

function openEditTransmitter(t) {
    const submitBtn = document.getElementById('add-modal-submit');
    document.getElementById('add-modal-title').innerText = 'Edit Transmitter';
    document.getElementById('add-modal-action').value = 'update_transmitter';
    submitBtn.innerHTML = "Save changes";
    document.getElementById('add-modal-txid').value = t.id;
    document.getElementById('add-modal-name').value = t.name;
    document.getElementById('add-modal-country').value = t.country;
    document.getElementById('formLat').value = t.lat;
    document.getElementById('formLng').value = t.lng;
    toggleModal('addModal');
}

function deleteTransmitter(id) {
    if (confirm("Are you sure? This will delete the transmitter and ALL associated stations and photos.")) {
        window.location.href = `index.php?delete_transmitter=${id}`;
    }
}

function openAddStation(tid) {
    document.getElementById('st-modal-action').value = 'Add station';
    document.getElementById('st-modal-tid').value = tid;
    document.getElementById('st-modal-name').value = '';
    toggleModal('stationModal');
}

function openEditStation(s) {
    document.getElementById('st-modal-title').innerText = 'Modify station';
    document.getElementById('st-modal-action').value = 'Update station';
    document.getElementById('st-modal-sid').value = s.id;
    document.getElementById('st-modal-name').value = s.station_name;
    document.getElementById('st-modal-freq').value = s.frequency;
    document.getElementById('st-modal-pwr').value = s.power_kw;
    document.getElementById('st-modal-pol').value = s.polarization;
    document.getElementById('st-modal-pi').value = s.pi_code || '';
    toggleModal('stationModal');
}

function openAddPhoto(tid) {
    document.getElementById('ph-modal-tid').value = tid;
    toggleModal('photoModal');
}

function openSidebarById(id) {
    const d = allTransmitters.find(x => x.id == id);
    if (!d) return;

    highlightMarker(id);
    d.stations.sort((a, b) => parseFloat(a.frequency) - parseFloat(b.frequency));
    currentPhotos = d.photos || []; 
    photoIndex = 0;
    
    const content = document.getElementById('sidebar-content');
    const isStaff = (typeof IS_STAFF !== 'undefined' && IS_STAFF === true);
    const isAnyUser = (typeof IS_LOGGED_IN !== 'undefined' && IS_LOGGED_IN === true);

    const distT = receiverLocation ? 
        `<span class="px-2 py-1 bg-white/5 border border-white/10 text-[#4db691] rounded">DISTANCE: ${getDistance(receiverLocation.lat, receiverLocation.lng, d.lat, d.lng)} KM</span>` 
        : "";

    content.innerHTML = `
        <div class="flex items-start justify-between mb-4 gap-4">
            <h1 class="text-4xl font-bold uppercase tracking-tighter leading-[0.85] text-white text-left break-words">${d.name}</h1>
            ${isStaff ? `
            <div class="flex gap-2 flex-shrink-0 pt-1">
                <button onclick='openEditTransmitter(${JSON.stringify(d)})' class="p-2.5 bg-[#4db691] hover:bg-[#5cd9ad] text-black rounded-xl shadow-xl transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                </button>
                <button onclick="deleteTransmitter(${d.id})" class="p-2.5 bg-[#ff4242] text-white rounded-xl shadow-xl transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>` : ''}
        </div>

        <p class="mono text-[11px] font-bold mb-10 tracking-[0.2em] uppercase opacity-70 text-left flex flex-wrap gap-2 items-center">
            <a href="https://www.google.com/maps?q=${d.lat},${d.lng}" 
               target="_blank" 
               class="px-2 py-1 bg-white/5 border border-white/10 text-[#4db691] rounded hover:bg-[#4db691] hover:text-black transition-all duration-200">
                ${d.lat}, ${d.lng}
            </a>
            ${distT}
        </p>

        ${currentPhotos.length > 0 ? `
        <div class="carousel-container group mb-6 shadow-2xl relative overflow-hidden rounded-3xl">
            ${isStaff ? `
            <div class="absolute top-4 right-4 z-[110] opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="deleteCurrentPhoto()" class="p-2.5 bg-[#ff4242] text-white rounded-xl shadow-2xl hover:bg-red-700 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>` : ''}
            ${currentPhotos.length > 1 ? `
                <button class="nav-btn btn-prev" onclick="prevPhoto()">❮</button>
                <button class="nav-btn btn-next" onclick="nextPhoto()">❯</button>
            ` : ''}
            <img id="carouselImg" src="transmitters/${currentPhotos[0].photo_filename}" class="carousel-slide cursor-pointer w-full object-cover" onclick="viewFull()">
        </div>` : ''}

        ${isAnyUser ? `
        <div onclick="openAddPhoto(${d.id})" class="station-card rounded-[2.5rem] flex items-center justify-center w-full min-h-[80px] border-dashed border-2 border-white/10 cursor-pointer hover:bg-white/5 transition font-bold text-xs uppercase tracking-widest text-[#888] hover:text-[#4db691] mb-10">
            + Add Photo
        </div>` : ''}

        <div class="space-y-4">
            <div class="flex items-center gap-4 mb-6"><span class="text-[11px] font-bold uppercase tracking-[0.4em] text-[#888]">Stations</span><div class="flex-1 h-[1px] bg-white/10"></div></div>
            ${d.stations.map(s => {
                const baseLogo = (s.pi_code && d.country) ? `https://tef.noobish.eu/logos/${d.country.toUpperCase()}/${s.pi_code.toUpperCase()}` : null;
                return `
                <div class="station-card group rounded-[2.5rem] flex items-stretch relative overflow-hidden w-full border border-white/5 bg-[#2b3a35] min-h-[100px]">
                    ${isStaff ? `<div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                        <button onclick='openEditStation(${JSON.stringify(s)})' class="p-2 bg-[#4db691] hover:bg-[#5cd9ad] text-black rounded-xl shadow-xl transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                        <a href="?delete_station=${s.id}" onclick="return confirm('Delete station?')" class="p-2 bg-[#ff4242] text-white rounded-xl shadow-xl transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </a>
                    </div>` : ''}
                    <div class="w-20 flex-shrink-0 bg-[#2e4940] flex items-center justify-center border-r border-white/10 p-3">
                        <img src="${baseLogo ? baseLogo + '.png' : 'station_logos/default.png'}" 
                             onerror="if (!this.dataset.fallback) { this.dataset.fallback = 1; this.src='${baseLogo}.svg'; } else if (this.dataset.fallback == 1) { this.dataset.fallback = 2; this.src='${baseLogo}.jpg'; } else { this.style.opacity=0.2; this.src='station_logos/default.png'; }" 
                             class="w-full h-full object-contain">
                    </div>
                    <div class="w-[180px] flex-shrink-0 flex items-center px-5 border-r border-white/10 min-w-0 overflow-hidden text-ellipsis text-left">
                        <button onclick="filterByStationName('${s.station_name.replace(/'/g, "\\'")}')" class="text-sm font-bold uppercase text-white hover:text-[#4db691] transition text-left leading-tight truncate">${s.station_name}</button>
                    </div>
                    <div class="w-16 flex-shrink-0 flex items-center justify-center border-r border-white/10 bg-[#2e4940] font-mono text-sm font-bold text-[#4db691] uppercase tracking-tighter text-center">${s.pi_code || '----'}</div>
                    <div class="w-[100px] flex-shrink-0 flex flex-col justify-center px-4 border-r border-white/10 text-center">
                        <div class="text-[13px] font-bold text-slate-100 mb-1.5 leading-none text-center">${s.polarization} pol.</div>
                        <div class="text-[13px] font-bold text-slate-100 mb-1.5 leading-none text-center">${s.power_kw} kW</div>
                    </div>
                    <div class="flex-grow flex flex-col justify-center items-end px-7 bg-black/40">
                        <div class="text-2xl font-bold text-[#4db691] leading-none tracking-tighter">${s.frequency}</div>
                        <div class="text-[10px] font-bold text-[#888] mt-1.5 tracking-widest">MHz</div>
                    </div>
                </div>`;
            }).join('')}
            ${isStaff ? `<div onclick="openAddStation(${d.id})" class="station-card rounded-[2.5rem] flex items-center justify-center w-full min-h-[100px] border-dashed border-2 border-white/10 cursor-pointer hover:bg-white/5 transition font-bold text-xs uppercase tracking-widest text-[#888] hover:text-[#4db691]">+ Add Station</div>` : ''}
        </div>
    `;
    document.getElementById('sidebar').classList.add('open');
}

function startPicking() { isPicking = true; toggleModal('addModal'); document.body.classList.add('picking-mode'); }

// --- Inside script.js ---

map.on('click', (e) => {
    if (document.getElementById('sidebar').classList.contains('open')) closeSidebar();
    
    if (isPicking) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        
        document.getElementById('formLat').value = lat;
        document.getElementById('formLng').value = lng;
        
        // --- Reverse Geocoding Logic ---
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
            .then(response => response.json())
            .then(data => {
                if (data.address && data.address.country_code) {
                    const iso2 = data.address.country_code.toUpperCase();
                    const iso3 = iso2to3[iso2];
                    
                    if (iso3) {
                        const countrySelect = document.getElementById('add-modal-country');
                        if (countrySelect) countrySelect.value = iso3;
                    }
                }
            })
            .catch(err => console.error("Geocoding failed:", err));

        isPicking = false; 
        document.body.classList.remove('picking-mode'); 
        toggleModal('addModal');
    }
});

map.on('contextmenu', (e) => {
    if (receiverMarker) map.removeLayer(receiverMarker);
    receiverLocation = e.latlng; localStorage.setItem('rx_lat', e.latlng.lat); localStorage.setItem('rx_lng', e.latlng.lng);
    receiverMarker = L.marker(e.latlng, { draggable: true, icon: rxIcon }).addTo(map);
    receiverMarker.on('drag', (ev) => {
        receiverLocation = ev.latlng; localStorage.setItem('rx_lat', ev.latlng.lat); localStorage.setItem('rx_lng', ev.latlng.lng);
        updateGeometry();
    });
    updateGeometry();
});

// Admin User Search logic
const adminUserSearch = document.getElementById('admin-user-search');
if (adminUserSearch) {
    adminUserSearch.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        document.querySelectorAll('.admin-user-row').forEach(row => {
            const searchData = row.getAttribute('data-search');
            row.style.display = searchData.includes(val) ? 'flex' : 'none';
        });
    });
}

['tx-name', 'station-name', 'f-freq', 'f-power', 'f-pi', 'f-country'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', () => {
            applyFilters();
        });
    }
});

// --- Initialization Logic ---
fetch('api_get_transmitters.php').then(res => res.json()).then(data => {
    allTransmitters = data;
    
    // 1. Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let hasUrlParams = false;
    
    if (urlParams.get('tx')) { document.getElementById('tx-name').value = urlParams.get('tx'); hasUrlParams = true; }
    if (urlParams.get('st')) { document.getElementById('station-name').value = urlParams.get('st'); hasUrlParams = true; }
    if (urlParams.get('freq')) { document.getElementById('f-freq').value = urlParams.get('freq'); hasUrlParams = true; }
    if (urlParams.get('power')) { document.getElementById('f-power').value = urlParams.get('power'); hasUrlParams = true; }
    if (urlParams.get('pi')) { document.getElementById('f-pi').value = urlParams.get('pi'); hasUrlParams = true; }
    if (urlParams.get('country')) { document.getElementById('f-country').value = urlParams.get('country'); hasUrlParams = true; }

    // 2. Restore Receiver Location
    const savedLat = localStorage.getItem('rx_lat'), savedLng = localStorage.getItem('rx_lng');
    if (savedLat && savedLng) {
        receiverLocation = L.latLng(parseFloat(savedLat), parseFloat(savedLng));
        receiverMarker = L.marker(receiverLocation, { draggable: true, icon: rxIcon }).addTo(map);
        receiverMarker.on('drag', (ev) => {
            receiverLocation = ev.latlng; 
            localStorage.setItem('rx_lat', ev.latlng.lat); 
            localStorage.setItem('rx_lng', ev.latlng.lng);
            updateGeometry();
        });
    }

    // 3. Restore Map Layer
    const savedLayer = localStorage.getItem('mapLayer');
    if (savedLayer) switchLayer(savedLayer);

    // 4. Handle Country Auto-Location
    if (hasUrlParams) {
        applyFilters();
    } else {
        const savedCountry = localStorage.getItem('userCountry');
        if (savedCountry) { 
            document.getElementById('f-country').value = savedCountry; 
            applyFilters(); 
        } else {
            fetch('https://ipapi.co/json/')
                .then(res => res.json())
                .then(data => {
                    if (data.country_code) {
                        const iso3 = iso2to3[data.country_code.toUpperCase()];
                        if (iso3) { 
                            localStorage.setItem('userCountry', iso3); 
                            document.getElementById('f-country').value = iso3; 
                            applyFilters(); 
                        } else {
                            applyFilters();
                        }
                    }
                })
                .catch(err => {
                    console.error("IP Location Service Failed:", err);
                    applyFilters();
                });
        }
    }
});

window.toggleModal = toggleModal; window.switchLayer = switchLayer; window.resetFilters = resetFilters; window.startPicking = startPicking;
window.nextPhoto = nextPhoto; window.prevPhoto = prevPhoto; window.viewFull = viewFull; window.deleteCurrentPhoto = deleteCurrentPhoto;
window.filterByStationName = filterByStationName; window.openAddStation = openAddStation; window.openEditStation = openEditStation;
window.openAddPhoto = openAddPhoto; window.closeSidebar = closeSidebar; window.prepareAddModal = prepareAddModal;
window.openEditTransmitter = openEditTransmitter; window.deleteTransmitter = deleteTransmitter;