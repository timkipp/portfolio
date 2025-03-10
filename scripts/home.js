window.onload = function() {
    const element = document.querySelector("hgroup:last-of-type h1:last-child");

    function handleViewportChange(event) {
        const newText = event.matches ? "<Dev>" : "<Development>";
        element.textContent = newText;
    }

    const mediaQuery = window.matchMedia("(max-width: 320px)");
    mediaQuery.addEventListener("change", handleViewportChange);

    handleViewportChange(mediaQuery);
};