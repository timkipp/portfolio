export function setRealVH() {
    // Get the viewport height in pixels
    let vh = window.innerHeight * 0.01;
    // Set CSS variable --vh to the value in pixels
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}

export function initializeSectionObserver() {
    const sectionTitle = document.getElementById("section-title");
    const sections = [{ id: "home" }, { id: "about" }, { id: "projects" }, { id: "resume" }, { id: "email" }];
    const options = {
        root: null,
        rootMargin: "0px 0px -30% 0px", // triggers when 30% of section is visible
        threshold: 0.6,
    };
    let hasLoaded = false;
    let displaySlideArrows = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;

                const updateTitle = () => {
                    switch (targetId) {
                        case "home":
                            sectionTitle.textContent = "Welcome";
                            displaySlideArrows = false;
                            break;
                        case "about":
                            sectionTitle.textContent = "About Me";
                            displaySlideArrows = false;
                            break;
                        case "projects":
                            sectionTitle.textContent = "My Projects";
                            displaySlideArrows = true;
                            break;
                        case "resume":
                            sectionTitle.textContent = "My Resume";
                            displaySlideArrows = false;
                            break;
                        case "email":
                            sectionTitle.textContent = "Email Me";
                            displaySlideArrows = false;
                            break;
                        default:
                            sectionTitle.textContent = "";
                            displaySlideArrows = false;
                    }
                };

                if (!hasLoaded && targetId === "home") {
                    // First load: just set text with no animation
                    sectionTitle.textContent = "Welcome";
                    sectionTitle.setAttribute("data-state", "visible");
                    hasLoaded = true;
                    return;
                }

                // Fade out
                sectionTitle.setAttribute("data-state", "hidden");

                // Wait for fade-out to finish, then update text and fade back in
                setTimeout(() => {
                    updateTitle();

                    if (displaySlideArrows) {
                        document.querySelectorAll("svg.slide-arrow").forEach((arrow) => {
                            arrow.classList.add("visible");
                        });
                    } else {
                        document.querySelectorAll("svg.slide-arrow").forEach((arrow) => {
                            arrow.classList.remove("visible");
                        });
                    }

                    requestAnimationFrame(() => {
                        sectionTitle.setAttribute("data-state", "visible");
                    });
                }, 500);
            }
        });
    }, options);

    sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
    });
}

export function checkWrap() {
    const h1 = document.querySelector("#about > header > h1");
    const divs = h1.querySelectorAll("div");

    // Compare the offsetTop values
    if (divs[0].offsetTop !== divs[1].offsetTop) {
        h1.classList.add("wrapped");
    } else {
        h1.classList.remove("wrapped");
    }
}
