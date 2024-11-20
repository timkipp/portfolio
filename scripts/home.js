window.addEventListener('resize', updateRotation);
window.addEventListener('load', updateRotation);

function updateRotation() {
    // Calculate the angle based on the viewport width and height
    const angle = Math.atan(window.innerHeight / window.innerWidth) * (180 / Math.PI);

    // Apply the rotation to the h2 elements
    document.querySelectorAll('h2').forEach(h2 => {
        // Adjusting the keyframes by setting inline styles for transform
        const keyframes = `
            @keyframes scrollWordsLeft {
                0% {
                    transform: translateX(50vw) translateY(-50vh) rotate(${angle}deg);
                }
                100% {
                    transform: translateX(-50vw) translateY(50vh) rotate(${angle}deg);
                }
            }

            @keyframes scrollWordsRight {
                0% {
                    transform: translateX(-50vw) translateY(50vh) rotate(${angle}deg);
                }
                100% {
                    transform: translateX(50vw) translateY(-50vh) rotate(${angle}deg);
                }
            }
        `;

        // Inject the dynamically calculated keyframes into the document's style
        const style = document.createElement('style');
        style.innerHTML = keyframes;
        document.head.appendChild(style);
    });
}
