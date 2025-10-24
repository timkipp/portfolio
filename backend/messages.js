document.addEventListener("DOMContentLoaded", () => {
    const timeElement = document.querySelector("header time");

    function updateDate() {
        const now = new Date();

        timeElement.setAttribute("datetime", now.toISOString());
        const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        timeElement.textContent = now.toLocaleDateString(undefined, dateOptions);
    }

    updateDate();
});

document.getElementById("logout").addEventListener("click", function () {
    window.location.href = "logout.php";
});
