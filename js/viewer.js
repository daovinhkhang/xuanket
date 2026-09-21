/**
 * Smart Verify Plus - Document Viewer Controller
 * Handles Zoom, Pan, Sidebar, and Viewport Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const viewport = document.getElementById('documentViewport');
  const certWrapper = document.getElementById('certificateWrapper');
  const certImage = document.getElementById('certImage');
  const sidebar = document.getElementById('viewerSidebar');
  const sidebarBtn = document.getElementById('btnSidebar');
  const pageViewBtn = document.getElementById('btnPageView');
  const handToolBtn = document.getElementById('btnHandTool');
  const zoomInBtn = document.getElementById('btnZoomIn');
  const zoomOutBtn = document.getElementById('btnZoomOut');
  const zoomSelectBtn = document.getElementById('zoomSelectBtn');
  const zoomSelectText = document.getElementById('zoomSelectText');
  const zoomMenu = document.getElementById('zoomMenu');
  const zoomMenuItems = document.querySelectorAll('.zoom-menu-item');
  const settingsBtn = document.getElementById('btnSettings');
  const settingsMenu = document.getElementById('settingsMenu');

  // Viewer State
  const zoomLevels = [0.5, 0.69, 0.75, 1.0, 1.25, 1.5, 2.0];
  let currentZoomIndex = 1; // 0.69 default (69%)
  let currentZoom = 0.69;
  let isHandToolActive = false;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let scrollLeft = 0;
  let scrollTop = 0;

  // Set initial zoom
  applyZoom(currentZoom, '69%');

  // Zoom logic
  function applyZoom(zoomValue, label) {
    currentZoom = zoomValue;
    certWrapper.style.transform = `scale(${currentZoom / 0.69})`;
    
    if (label) {
      zoomSelectText.textContent = label;
    } else {
      zoomSelectText.textContent = `${Math.round(currentZoom * 100)}%`;
    }

    // Update active check in menu
    zoomMenuItems.forEach(item => {
      const val = item.dataset.value;
      if (val === 'fit-page' || val === 'fit-width') {
        item.classList.remove('selected');
      } else {
        const numVal = parseFloat(val);
        if (Math.abs(numVal - currentZoom) < 0.02) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      }
    });
  }

  // Zoom in
  zoomInBtn.addEventListener('click', () => {
    let nextIndex = zoomLevels.findIndex(z => z > currentZoom + 0.02);
    if (nextIndex === -1) nextIndex = zoomLevels.length - 1;
    applyZoom(zoomLevels[nextIndex]);
  });

  // Zoom out
  zoomOutBtn.addEventListener('click', () => {
    let prevIndex = -1;
    for (let i = zoomLevels.length - 1; i >= 0; i--) {
      if (zoomLevels[i] < currentZoom - 0.02) {
        prevIndex = i;
        break;
      }
    }
    if (prevIndex === -1) prevIndex = 0;
    applyZoom(zoomLevels[prevIndex]);
  });

  // Toggle Zoom Menu
  zoomSelectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomMenu.classList.toggle('show');
    settingsMenu.classList.remove('show');
  });

  // Zoom menu item selection
  zoomMenuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const val = item.dataset.value;
      if (val === 'fit-page') {
        fitPage();
      } else if (val === 'fit-width') {
        fitWidth();
      } else {
        const numVal = parseFloat(val);
        applyZoom(numVal, item.textContent.trim());
      }
      zoomMenu.classList.remove('show');
    });
  });

  function fitPage() {
    const vpHeight = viewport.clientHeight - 60;
    const imgHeight = 770; // approximate base height
    const calculatedZoom = Math.min(1.0, vpHeight / imgHeight * 0.69);
    applyZoom(calculatedZoom, 'Fit Page');
  }

  function fitWidth() {
    const vpWidth = viewport.clientWidth - 60;
    const imgWidth = 530; // base width
    const calculatedZoom = Math.min(1.5, vpWidth / imgWidth * 0.69);
    applyZoom(calculatedZoom, 'Fit Width');
  }

  // Sidebar Toggle
  sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarBtn.classList.toggle('active', sidebar.classList.contains('open'));
  });

  // Hand Tool Toggle
  handToolBtn.addEventListener('click', () => {
    isHandToolActive = !isHandToolActive;
    handToolBtn.classList.toggle('active', isHandToolActive);
    viewport.classList.toggle('hand-mode', isHandToolActive);
  });

  // Hand Pan Dragging
  viewport.addEventListener('mousedown', (e) => {
    if (!isHandToolActive) return;
    isDragging = true;
    viewport.classList.add('grabbing');
    startX = e.pageX - viewport.offsetLeft;
    startY = e.pageY - viewport.offsetTop;
    scrollLeft = viewport.scrollLeft;
    scrollTop = viewport.scrollTop;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      viewport.classList.remove('grabbing');
    }
  });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDragging || !isHandToolActive) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const y = e.pageY - viewport.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    viewport.scrollLeft = scrollLeft - walkX;
    viewport.scrollTop = scrollTop - walkY;
  });

  // Settings Menu Toggle
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsMenu.classList.toggle('show');
    zoomMenu.classList.remove('show');
  });

  // Close menus on outside click
  document.addEventListener('click', () => {
    zoomMenu.classList.remove('show');
    settingsMenu.classList.remove('show');
  });

  // Anti-tamper & Security behavior (matches real verification site)
  certImage.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  
  viewport.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Thumbnail click
  const thumbCard = document.querySelector('.thumbnail-card');
  if (thumbCard) {
    thumbCard.addEventListener('click', () => {
      viewport.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Handle Page view click
  pageViewBtn.addEventListener('click', () => {
    applyZoom(0.69, '69%');
    viewport.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
