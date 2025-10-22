const contactForm = document.querySelector("#contact-form");
const dateTimeSent = document.querySelector("#contact-form #sent");

export function initializeForm() {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const now = new Date();

        const formattedDateTime = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0") + " " + String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0");

        dateTimeSent.value = formattedDateTime;

        // Collect form data
        const formData = new FormData(contactForm);

        // Send to PHP via fetch
        const response = await fetch("/backend/contact_submit.php", {
            method: "POST",
            body: formData,
        });

        contactForm.classList.add("result-received");
        contactForm.reset();

        const confirmationMessage = document.querySelector("#email #confirmation-message");
        confirmationMessage.textContent = await response.text();
        confirmationMessage.classList.add("result-confirmed");
    });
}
