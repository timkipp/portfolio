// alert("Width: " + window.innerWidth + "px / Height: " + window.innerHeight + "px");
const element = document.querySelector("hgroup:last-of-type h1:last-child");

    
function handleViewportChange(event) {
    const newText = event.matches ? "<Dev>" : "<Development>";
    element.textContent = newText;
}

const mediaQuery = window.matchMedia("(max-width: 320px)");
mediaQuery.addEventListener("change", handleViewportChange);

handleViewportChange(mediaQuery);


document.addEventListener('wheel', function (e) {
    if (e.deltaY !== 0) {
        document.querySelector('main').scrollLeft += e.deltaY;
        e.preventDefault();
    }
});

const container = document.querySelector('main');
let scrollAmount = 0;

window.addEventListener('wheel', (event) => {
    event.preventDefault();
    scrollAmount += event.deltaY;

    // Constrain scroll to container width
    scrollAmount = Math.max(0, Math.min(scrollAmount, window.innerWidth * 2));

    container.style.transform = `translateX(-${scrollAmount}px)`;
});

const about = document.querySelector('a[data-text="About"]');

about.addEventListener('click', function (e) {
    e.preventDefault();

    alert("'about' clicked!");

    const aboutSection = document.getElementById('about-me');
    const scrollPosition = aboutSection.offsetLeft;

    document.querySelector('main').scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });

    if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    }
});