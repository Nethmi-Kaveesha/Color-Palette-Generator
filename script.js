const searchInput = document.querySelector("#search-input"),
    searchColor = document.querySelector("#search-color"),
    searchImage = document.querySelector("#search-image"),
    typeSelect = document.querySelector("#palette-type"),
    countSelect = document.querySelector("#palette-count"),
    randomBtn = document.querySelector("#random-btn"),
    paletteContainer = document.querySelector("#palette"),
    relatedContainer = document.querySelector("#related");

let currentColor = "skyblue", // Default color
    currentType = "analogous", // Default palette type
    currentCount = 6, // Default count of colors
    imageColors = [];

// Functions to generate color palettes

function generateAnalogousPalette(hsl, count) {
    const palette = [];
    const [hue, saturation, lightness] = hsl;

    for (let i = 0; i < count; i++) {
        let newHue = (hue + (i - Math.floor(count / 2)) * 30 + 360) % 360;
        palette.push([newHue, saturation, lightness]);
    }

    return palette;
}

function generateMonochromaticPalette(hsl, count) {
    const palette = [];
    let [hue, saturation, lightness] = hsl;

    for (let i = 0; i < count; i++) {
        let newLightness = (lightness + 10 * i) % 100;
        palette.push([hue, saturation, newLightness]);
    }
    return palette;
}

function generateTriadicPalette(hsl, count) {
    const palette = [];
    let [hue, saturation, lightness] = hsl;

    for (let i = 0; i < count; i++) {
        let newHue = (hue + 120 * i) % 360;
        palette.push([newHue, saturation, lightness]);
    }
    return palette;
}

function generateCompoundPalette(hsl, count) {
    const palette = [];
    let [hue, saturation, lightness] = hsl;

    for (let i = 0; i < count; i++) {
        let newHue = (hue + 150 * i) % 360;
        palette.push([newHue, saturation, lightness]);
    }
    return palette;
}

function generateShadesPalette(hsl, count) {
    const palette = [];
    let [hue, saturation, lightness] = hsl;

    for (let i = 0; i < count; i++) {
        let newSaturation = (saturation + 10 * i) % 100;
        palette.push([hue, newSaturation, lightness]);
    }
    return palette;
}

function generateTetradicPalette(hsl, count) {
    const palette = [];
    let [hue, saturation, lightness] = hsl;

    for (let i = 0; i < count; i++) {
        let newHue = (hue + 90 * i) % 360;
        palette.push([newHue, saturation, lightness]);
    }
    return palette;
}

function generateSquarePalette(hsl, count) {
    const palette = [];
    let [hue, saturation, lightness] = hsl;

    for (let i = 0; i < count; i++) {
        let newHue = (hue + 60 * i) % 360;
        palette.push([newHue, saturation, lightness]);
    }
    return palette;
}

function generateRelatedColorPalette(hsl, count) {
    const palette = [];
    const [hue, saturation, lightness] = hsl;

    palette.push([hue, (saturation + 20) % 100, lightness]);
    palette.push([hue, (saturation - 20 + 100) % 100, lightness]);
    palette.push([hue, saturation, (lightness + 20) % 100]);
    palette.push([hue, saturation, (lightness - 20 + 100) % 100]);
    palette.push([(hue + 20) % 360, saturation, lightness]);
    palette.push([(hue - 20 + 360) % 360, saturation, lightness]);

    return palette;
}

// Function to generate palette based on type
function generatePalette(hsl, type, count) {
    switch (type) {
        case "analogous":
            return generateAnalogousPalette(hsl, count);
        case "monochromatic":
            return generateMonochromaticPalette(hsl, count);
        case "triadic":
            return generateTriadicPalette(hsl, count);
        case "compound":
            return generateCompoundPalette(hsl, count);
        case "shades":
            return generateShadesPalette(hsl, count);
        case "tetradic":
            return generateTetradicPalette(hsl, count);
        case "square":
            return generateSquarePalette(hsl, count);
        case "related":
            return generateRelatedColorPalette(hsl, count);
        default:
            return [];
    }
}

// Function to generate HTML for the palette
function generatePaletteHtml(type, container) {
    const color = currentColor;
    const count = currentCount;
    const hsl = getHslFromColor(color);

    if (!hsl) return;

    const palette = generatePalette(hsl, type, count);
    container.innerHTML = "";

    palette.forEach((colorHsl) => {
        const colorHex = hslToHex(colorHsl);
        const colorEl = document.createElement("div");
        colorEl.classList.add("color");
        colorEl.style.backgroundColor = colorHex;

        colorEl.innerHTML = `
            <div class="overlay">
                <div class="icons">
                    <div class="copy-color">
                        <i class="fas fa-copy"></i>
                    </div>
                    <div class="generate-palette">
                        <i class="fas fa-palette"></i>
                    </div>
                </div>
                <div class="code">${color}</div>
            </div>
        `;
        container.appendChild(colorEl);
    });
}

function getHslFromColor(color) {
    if (!isValidColor(color)) return null;
    const temp = document.createElement("div");
    temp.style.color = color;
    document.body.appendChild(temp);
    const styles = window.getComputedStyle(temp);
    const rgb = removeRGB(styles.getPropertyValue("color"));
    document.body.removeChild(temp);
    return rgbToHsl(rgb);
}

function isValidColor(color) {
    return CSS.supports("color", color);
}

function removeRGB(rgb) {
    return rgb.replace("rgb(", "").replace(")", "").split(",").map(Number);
}

function rgbToHsl([r, g, b]) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        h = (max === r) ? ((g - b) / d + (g < b ? 6 : 0)) :
            (max === g) ? (b - r) / d + 2 : (r - g) / d + 4;
        h *= 60;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex([h, s, l]) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate initial palettes
generatePaletteHtml(currentType, paletteContainer);
generatePaletteHtml("related", relatedContainer);

// generate palette when a color is written in input
searchInput.addEventListener("keyup", (e) => {
    const value = e.target.value;
    //console.log("Input value:", value);  // Add this line for debugging
    if (isValidColor(value)){
        // If a valid color is written
        searchColor.style.backgroundColor = value;
        currentColor = value;
        generatePaletteHtml(currentType, paletteContainer);
        generatePaletteHtml("related", relatedContainer);
    }
});
