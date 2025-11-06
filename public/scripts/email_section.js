const inputControls = document.querySelectorAll("#contact-form .form-field input, #contact-form .form-field textarea");
const sendButton = document.querySelector("button[type='submit']");

export function initializeForm() {
    const contactForm = document.querySelector("#contact-form");
    const confirmationOutput = document.querySelector("#email #confirmation-message output");
    const sendAnotherButton = document.querySelector("#confirmation-message button");
    const dateTimeSent = document.querySelector("#contact-form #sent");

    updatePlaceholders();

    inputControls.forEach((control) => {
        control.addEventListener("input", checkForInput);
    });

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const now = new Date();

        const formattedDateTime = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0") + " " + String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0");

        dateTimeSent.value = formattedDateTime;

        // Collect form data
        const formData = new FormData(contactForm);

        // Send to PHP via fetch
        const response = await fetch("../backend/php/contact_submit.php", {
            method: "POST",
            body: formData,
        });

        contactForm.classList.add("result-received");
        contactForm.reset();

        confirmationOutput.textContent = await response.text();
        confirmationOutput.classList.add("result-confirmed");
    });

    sendAnotherButton.addEventListener("click", () => {
        confirmationOutput.classList.remove("result-confirmed");
        contactForm.classList.remove("result-received");
    });
}

export function updatePlaceholders() {
    inputControls.forEach(control => {
        const label = control.previousElementSibling;
        
        if (!control.dataset.fullPlaceholder) {
            control.dataset.fullPlaceholder = control.placeholder;
        }

        if (window.getComputedStyle(label).display === "none") {
            controlId = control.id;
            let shortPlaceholder = "";
            switch (controlId) {
                case "name": shortPlaceholder = "NAME"; break;
                case "email": shortPlaceholder = "EMAIL ADDRESS"; break;
                case "subject": shortPlaceholder = "SUBJECT"; break;
                case "body": shortPlaceholder = "MESSAGE"; break;
            }
            control.placeholder = shortPlaceholder;
        } else {
            control.placeholder = control.dataset.fullPlaceholder;
        }
    })
}

function checkForInput() {
    const allHaveValidInput = Array.from(inputControls).every((control) => {
        const hasTextInput = control.value.trim() != "";
        if (control.type === "email") {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            const isValidEmail = pattern.test(control.value.trim());
            return hasTextInput && isValidEmail;
        }
        return hasTextInput;
    });

    sendButton.disabled = !allHaveValidInput;
}
