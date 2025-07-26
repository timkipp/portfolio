export function initializeDebugging() {
    console.clear();

    // console.log("🚨 Monitoring DOM class changes");
    // console.log(document.querySelector("span.progress-indicator:first-child").classList);

    // // Place this at the VERY TOP of index.js
    // const alterationObserver = new MutationObserver((mutations) => {
    //     for (const mutation of mutations) {
    //         if (mutation.type === "attributes" && mutation.attributeName === "class") {
    //             const el = mutation.target;
    //             if (el.classList.contains("progress-indicator")) {
    //                 console.log(`[MUTATION] Class changed on element:`, el);
    //                 console.log(`[BEFORE]`, mutation.oldValue);
    //                 console.log(`[AFTER]`, el.className);
    //             }
    //         }
    //     }
    // });

    // document.querySelectorAll(".progress-indicator").forEach((el) => {
    //     alterationObserver.observe(el, {
    //         attributes: true,
    //         attributeOldValue: true,
    //         attributeFilter: ["class"],
    //     });
    // });

    // window.addEventListener("DOMContentLoaded", () => {
    //     document.querySelectorAll(".progress-indicator").forEach((el) => {
    //         alterationObserver.observe(el, { attributes: true });
    //     });
    // });
}

export function delay(ms) {
    console.warn("💩 SETTING DELAY TO DEAL WITH BROWSER BS");
    return new Promise((resolve) => setTimeout(resolve, ms));
}
