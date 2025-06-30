const body = document.querySelector("body");
const asides = document.querySelectorAll("aside");
const sectionTitle = document.getElementById("section-title");
// const sections = ["landing", "about-me", "projects", "resume", "email"];
const sections = [
    { id: "landing", color: "#412F30" },
    { id: "about-me", color: "#FFFFEB" },
    { id: "projects", color: "#412F30" },
    { id: "resume", color: "#412F30" },
    { id: "email", color: "#FFFFEB" },
];
const options = {
    root: null,
    rootMargin: "0px 0px -30% 0px", // triggers when 50% of section is visible
    threshold: 0.6,
};
let backgroundColor = "";
let useLightBackgroundColor = false;
let hasLoaded = false; // <-- New flag

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const targetId = entry.target.id;

            const updateTitle = () => {
                switch (targetId) {
                    case "landing":
                        sectionTitle.textContent = "Welcome";
                        useLightBackgroundColor = false;
                        break;
                    case "about-me":
                        sectionTitle.textContent = "About Me";
                        useLightBackgroundColor = true;
                        break;
                    case "projects":
                        sectionTitle.textContent = "My Projects";
                        useLightBackgroundColor = false;
                        break;
                    case "resume":
                        sectionTitle.textContent = "My Resume";
                        useLightBackgroundColor = false;
                        break;
                    case "email":
                        sectionTitle.textContent = "Email Me";
                        useLightBackgroundColor = false;
                        break;
                    default:
                        sectionTitle.textContent = "";
                }

                // if (useLightBackgroundColor) {
                //     backgroundColor = "#FFFFEB";
                // } else {
                //     backgroundColor = "#412F30";
                // }

                // asides.forEach((aside) => {
                //     aside.style.backgroundColor = backgroundColor;
                // });
            };

            if (!hasLoaded && targetId === "landing") {
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

                requestAnimationFrame(() => {
                    sectionTitle.setAttribute("data-state", "visible");
                });
            }, 500);
        }
    });
}, options);

// Observe all sections
// sections.forEach((id) => {
//     const section = document.getElementById(id);
//     if (section) observer.observe(section);
// });
sections.forEach(({ id }) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
});

if (document.readyState === "complete") {
    document.body.classList.remove("loading");
    void document.body.offsetHeight;
} else {
    window.addEventListener("load", () => {
        document.body.classList.remove("loading");
        void document.body.offsetHeight;
    });
}

function setRealVH() {
    // Get the viewport height in pixels
    let vh = window.innerHeight * 0.01;
    // Set CSS variable --vh to the value in pixels
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Initial call
setRealVH();

// Update on resize or orientation change
window.addEventListener("resize", setRealVH);
window.addEventListener("orientationchange", setRealVH);
window.addEventListener("load", () => {
    if (window.location.hash !== "#landing") {
        // Change the URL hash without adding a history entry:
        history.replaceState(null, null, "#landing");

        // Or scroll to top if you prefer:
        // window.scrollTo(0, 0);
    }
});

document.querySelectorAll(".figure-card").forEach((card) => {
    const isHoverable = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (isHoverable) {
        // Simulate hover effect using JS
        card.addEventListener("mouseenter", () => {
            if (!card.classList.contains("flipped")) {
                card.classList.add("flipped");
                card.setAttribute("aria-pressed", "true");
            }
        });

        card.addEventListener("mouseleave", () => {
            if (card.classList.contains("flipped")) {
                card.classList.remove("flipped");
                card.setAttribute("aria-pressed", "false");
            }
        });
    } else {
        // Mobile/touch behavior: click toggles flip
        card.addEventListener("click", () => {
            card.classList.toggle("flipped");
            card.setAttribute(
                "aria-pressed",
                card.classList.contains("flipped")
            );
        });

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                card.classList.toggle("flipped");
                card.setAttribute(
                    "aria-pressed",
                    card.classList.contains("flipped")
                );
            }
        });
    }
});

// function hexToRgb(hex) {
//     const bigint = parseInt(hex.replace("#", ""), 16);
//     return {
//         r: (bigint >> 16) & 255,
//         g: (bigint >> 8) & 255,
//         b: bigint & 255,
//     };
// }

// function interpolateColor(c1, c2, factor) {
//     return `rgb(${Math.round(c1.r + factor * (c2.r - c1.r))}, ${Math.round(
//         c1.g + factor * (c2.g - c1.g)
//     )}, ${Math.round(c1.b + factor * (c2.b - c1.b))})`;
// }

// function easeInOutQuad(t) {
//     return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
// }

// const main = document.querySelector("body > main");

// main.addEventListener("scroll", () => {
//     const scrollY = main.scrollTop + main.clientHeight / 2;

//     for (let i = 0; i < sections.length - 1; i++) {
//         const currentSection = document.getElementById(sections[i].id);
//         const nextSection = document.getElementById(sections[i + 1].id);
//         if (!currentSection || !nextSection) continue;

//         const currentTop = currentSection.offsetTop - main.offsetTop;
//         const nextTop = nextSection.offsetTop - main.offsetTop;

//         if (scrollY >= currentTop && scrollY < nextTop) {
//             const progress = (scrollY - currentTop) / (nextTop - currentTop);
//             const color1 = hexToRgb(sections[i].color);
//             const color2 = hexToRgb(sections[i + 1].color);
//             //   const blended = interpolateColor(color1, color2, progress);
//             const easedProgress = easeInOutQuad(progress);
//             const blended = interpolateColor(color1, color2, easedProgress);
//             document.body.style.backgroundColor = blended;
//             return;
//         }
//     }

//     // Fallback to last section color
//     document.body.style.backgroundColor = sections[sections.length - 1].color;
// });
