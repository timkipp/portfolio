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

    let sectionLinks = document.querySelectorAll("nav ul li");
    let linkIndex = 0;
    let hasLoaded = false;
    let displaySlideArrows = false;
    let hideSidebars = false;
    let expandMain = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;

                const linkListItem = document.querySelector(`nav ul li:has(a[href="#${targetId}"])`);
                if (linkListItem) {
                    // Remove current-section from all links first
                    sectionLinks.forEach((l) => l.classList.remove("current-section"));
                    // Add current-section to the link for this section
                    linkListItem.classList.add("current-section");
                }

                const updateTitle = () => {
                    switch (targetId) {
                        case "home":
                            sectionTitle.textContent = "Welcome";
                            linkIndex = 0;
                            displaySlideArrows = false;
                            hideSidebars = false;
                            break;
                        case "about":
                            sectionTitle.textContent = "About Me";
                            linkIndex = 1;
                            displaySlideArrows = false;
                            hideSidebars = false;
                            break;
                        case "projects":
                            sectionTitle.textContent = "My Projects";
                            linkIndex = 2;
                            displaySlideArrows = true;
                            hideSidebars = false;
                            break;
                        case "resume":
                            sectionTitle.textContent = "My Resume";
                            linkIndex = 3;
                            displaySlideArrows = false;
                            hideSidebars = true;
                            break;
                        case "email":
                            sectionTitle.textContent = "Email Me";
                            linkIndex = 4;
                            displaySlideArrows = false;
                            hideSidebars = false;
                            break;
                        default:
                            sectionTitle.textContent = "";
                            displaySlideArrows = false;
                            hideSidebars = false;
                    }
                };

                if (!hasLoaded && targetId === "home") {
                    // First load: just set text with no animation
                    // sectionTitle.textContent = "Welcome";
                    // sectionTitle.setAttribute("data-state", "visible");
                    hasLoaded = true;
                    return;
                }

                // Fade out
                // sectionTitle.setAttribute("data-state", "hidden");

                // Wait for fade-out to finish, then update text and fade back in
                setTimeout(() => {
                    // updateTitle();

                    // sectionLinks.forEach((link) => link.classList.remove("current-section"));
                    // sectionLinks[linkIndex].classList.add("current-section");

                    if (displaySlideArrows) {
                        document.querySelectorAll("svg.side-arrow").forEach((arrow) => {
                            arrow.classList.add("visible");
                        });
                    } else {
                        document.querySelectorAll("svg.side-arrow").forEach((arrow) => {
                            arrow.classList.remove("visible");
                        });
                    }

                    document.querySelectorAll("div.sidebar").forEach((sidebar) => {
                        sidebar.classList.toggle("hidden", hideSidebars);
                    });

                    document.querySelector("body > main").classList.toggle("expand", hideSidebars);

                    requestAnimationFrame(() => {
                        // sectionTitle.setAttribute("data-state", "visible");
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
