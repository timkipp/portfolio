function setRealVH() {
    // Get the viewport height in pixels
    let vh = window.innerHeight * 0.01;
    // Set CSS variable --vh to the value in pixels
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initial call
setRealVH();

// Update on resize or orientation change
window.addEventListener('resize', setRealVH);
window.addEventListener('orientationchange', setRealVH);