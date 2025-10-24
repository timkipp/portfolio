const contactForm = document.querySelector("#contact-form");
const confirmationOutput = document.querySelector("#email #confirmation-message output");
const sendAnotherMessage = document.querySelector("#confirmation-message button");
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

        confirmationOutput.textContent = await response.text();
        confirmationOutput.classList.add("result-confirmed");
    });

    sendAnotherMessage.addEventListener("click", () => {
        confirmationOutput.classList.remove("result-confirmed");
        contactForm.classList.remove("result-received");
    });
}
