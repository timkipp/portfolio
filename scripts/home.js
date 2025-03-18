window.onload = function() {
    // alert("Width: " + window.innerWidth + "px / Height: " + window.innerHeight + "px");
    const element = document.querySelector("hgroup:last-of-type h1:last-child");

    function handleViewportChange(event) {
        const newText = event.matches ? "<Dev>" : "<Development>";
        element.textContent = newText;
    }

    const mediaQuery = window.matchMedia("(max-width: 320px)");
    mediaQuery.addEventListener("change", handleViewportChange);

    handleViewportChange(mediaQuery);
};