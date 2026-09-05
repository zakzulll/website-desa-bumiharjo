// --- LOGIKA SIDEBAR & MENU GLOBAL ---
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const toggleBtn = document.getElementById('sidebarToggle');
    const closeBtn = document.getElementById('btnCloseSidebar');

    function openSidebar() {
        if (sidebar && overlay) {
            sidebar.classList.add('show');
            overlay.classList.add('show');
        }
    }

    function closeSidebar() {
        if (sidebar && overlay) {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        }
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Logika Mengingat Status Submenu
    const submenu = document.getElementById('informasiSubmenu');
    const menuToggle = document.querySelector('[href="#informasiSubmenu"]');

    if (submenu && menuToggle) {
        const statusMenu = localStorage.getItem('ingatanMenuInformasi');
        if (statusMenu === 'terbuka') {
            submenu.classList.add('show');
            menuToggle.setAttribute('aria-expanded', 'true');
        } else if (statusMenu === 'tertutup') {
            submenu.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        submenu.addEventListener('shown.bs.collapse', () => localStorage.setItem('ingatanMenuInformasi', 'terbuka'));
        submenu.addEventListener('hidden.bs.collapse', () => localStorage.setItem('ingatanMenuInformasi', 'tertutup'));
    }
}

// Jalankan logika setelah DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebar);
} else {
    initSidebar();
}