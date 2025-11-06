const addFontButton = document.querySelector("button#add-font");
const toggleOptionsButton = document.querySelector("button#toggle-options");
const fontOptionsForm = document.querySelector("form");
const fontFamily = document.querySelector("#font-family-name");
const fontStyle = document.querySelector("#italic");
const fontSizeRange = document.querySelector("#font-size-range");
const fontSizeNumber = document.querySelector("#font-size-number");
const fontWeightRange = document.querySelector("#font-weight-range");
const fontWeightNumber = document.querySelector("#font-weight-number");
const fontSample = document.querySelector("#sample-text");
const fontLetterCaseOptions = document.querySelectorAll("input[name='letter-case']");
const resetLetterCase = document.querySelector("#letter-case-field button");
const fontDisplays = document.querySelectorAll(".font-display");
const fontSampleDisplay = document.querySelector("#sample-text-display p");
const fontPreview = document.querySelectorAll(".updateable");

let updating = false;

function syncInputs(source, target) {
    if (updating) return;
    updating = true;
    target.value = source.value;
    updating = false;
}

addFontButton.addEventListener("click", addFontPreview);

toggleOptionsButton.addEventListener("click", () => {
    if (toggleOptionsButton.textContent === "Hide Options") {
        fontOptionsForm.style.display = "none";
        toggleOptionsButton.textContent = "Show Options";
    } else {
        fontOptionsForm.style.display = "flex";
        toggleOptionsButton.textContent = "Hide Options";
    }
});

fontFamily.addEventListener("change", updateFontFamily);
fontStyle.addEventListener("change", toggleItalicStyle);
fontSizeRange.addEventListener("input", updateFontSize);
fontSizeNumber.addEventListener("input", updateFontSize);
fontSizeNumber.addEventListener("change", updateFontSize);
fontWeightRange.addEventListener("input", updateFontWeight);
fontWeightNumber.addEventListener("input", updateFontWeight);
fontWeightNumber.addEventListener("change", updateFontWeight);
fontSample.addEventListener("change", updateSampleText);
fontLetterCaseOptions.forEach((option) => {
    option.addEventListener("change", updateSampleLetterCase);
});
resetLetterCase.addEventListener("click", () => {
    const selectedLetterCase = document.querySelector("input[name='letter-case']:checked");
    selectedLetterCase.checked = false;
});

window.addEventListener("pageshow", () => {
    setTimeout(() => {
        const fontProperties = new Map();
        fontProperties.set("fontFamily", fontFamily.value);
        fontProperties.set("fontStyle", fontStyle.checked ? "italic" : "none");
        fontProperties.set("fontSize", fontSizeNumber.value);
        fontProperties.set("fontWeight", fontWeightNumber.value);

        fontSampleDisplay.textContent = fontSample.value;

        const selectedLetterCase = document.querySelector("input[name='letter-case']:checked");
        if (selectedLetterCase) {
            updateSampleLetterCase({ target: selectedLetterCase });
        }
    }, 0);
});

function updateFontProperty(elements, propertyName, propertyValue) {
    const elems = elements instanceof NodeList || Array.isArray(elements) ? elements : [elements];

    elems.forEach((element) => {
        element.style[propertyName] = propertyValue;
    });

    fontSampleDisplay.style[propertyName] = propertyValue;
}

function updateFontFamily() {
    updateFontProperty(fontPreview, "fontFamily", fontFamily.value);

    const previewHeadings = document.querySelectorAll(".font-preview h2");
    previewHeadings.forEach((heading) => {
        heading.insertAdjacentText("afterbegin", fontFamily.value + " ");
    });
}

function toggleItalicStyle() {
    const italicProperty = fontStyle.checked ? "italic" : "normal";
    updateFontProperty(fontPreview, "fontStyle", italicProperty);
}

function updateFontSize(e) {
    const input = e.target;
    if (input.type === "range") {
        syncInputs(fontSizeRange, fontSizeNumber);
    } else {
        syncInputs(fontSizeNumber, fontSizeRange);
    }

    updateFontProperty(fontPreview, "fontSize", fontSizeNumber.value + "pt");
}

function updateFontWeight(e) {
    const input = e.target;
    if (input.type === "range") {
        syncInputs(fontWeightRange, fontWeightNumber);
    } else {
        syncInputs(fontWeightNumber, fontWeightRange);
    }

    updateFontProperty(fontPreview, "fontWeight", fontWeightNumber.value);
}

function updateSampleText(e) {
    const input = e.target;

    fontSampleDisplay.textContent = input.value;
}

function updateSampleLetterCase(e) {
    const input = e.target;
    let fontProperty = "";

    if (input.value === "small-caps") {
        fontSampleDisplay.style.fontVariant = "small-caps";
        fontSampleDisplay.style.textTransform = "none";
    } else {
        fontSampleDisplay.style.textTransform = input.value;
        fontSampleDisplay.style.fontVariant = "normal";
    }
}

function addFontPreview() {
    const countOfFontDisplays = fontDisplays.length;
    const nextFontId = countOfFontDisplays + 1;
    const lastFontDisplay = fontDisplays[countOfFontDisplays - 1];
    const newFontDisplay = fontDisplay.cloneNode(true);
    newFontDisplay.id = "font-" + nextFontId;
    lastFontDisplay.after(newFontDisplay);
}
