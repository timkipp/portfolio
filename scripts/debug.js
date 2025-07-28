export function initializeDebugging() {
    console.clear();
}

export function delay(ms) {
    console.warn("💩 SETTING DELAY TO DEAL WITH BROWSER BS");
    return new Promise((resolve) => setTimeout(resolve, ms));
}
