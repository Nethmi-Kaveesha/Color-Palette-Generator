const searchInput = document.querySelector("#search-input"),
      searchColor = document.querySelector("#search-color"),
      searchImage = document.querySelector("#search-image"),
      typeSelect = document.querySelector("#palette-type"),
      countSelect = document.querySelector("#palette-count"),
      randomBtn = document.querySelector("#random-btn"),
      paletteContainer = document.querySelector("#palette"),
      relatedContainer = document.querySelector("#related");

let currentColor = "skyblue",
    currentType = "analogous"
    currentCount = 6,
    imageColors = [];

//  ALL FUNCTION TO GENERATE DIFFERENT PALETTES

function generateAnalogousPalette(hs1,count){
    //hs1 is color,count means quantity of colors
    const palette = [];
    //get hue, saturation, lightness from hs1,this is the reason to use hs1
    const [hue,saturation, lightness] = hs1;

    //generate colors equals count
    for (let i = 0; i < count; i++) {
        //add 30 and mulptiple to index for every color
        let neHue = hue + 30 * i;
        //new hue can be gear than 360 so chxek if greater than hue-360
        if (neHue < 360) {
            neHue -= 360;
        }

        //add new color in palette array
        palette.push([neHue,saturation,lightness]);
    }

    //after getting all colors return palette
    return palette;
}

// //lets test it
//
// let hs1 =[155, 60, 60];
// let palette = generateAnalogousPalette(hs1,6);
// console.log(palette);

function generateMonochromaticPalette(hs1,count){
    //same in this but instead of hue increase lightness by 10
    const palette = [];
    let [hue,saturation, lightness] = hs1;

    for (let i = 0; i < count; i++) {
        let newLightness = (lightness = 10 * i);
        if (newLightness >100) {
            //lightness cannot be greater than 100
            newLightness -= 100;
        }
        palette.push([hue,saturation,newLightness]);
    }
    return palette;
}


function generateTriadicPalette(hs1,count){
    const palette = [];
    let [hue,saturation, lightness] = hs1;

    for (let i = 0; i < count; i++) {
        let newHue = hue + 120 * i;
        if (newHue > 360) {
            newHue -= 360;
        }

        palette.push([newHue,saturation,lightness]);
    }
    return palette;
}

function generateCompoundPalette(hs1,count){
    const palette = [];
    let [hue,saturation, lightness] = hs1;

    //in compound increase hue by 150
    for (let i = 0; i < count; i++) {
        let newHue = hue + 150 * i;
        if (newHue > 360) {
            newHue -= 360;
        }
        palette.push([newHue,saturation,lightness]);
    }
    return palette;
}

function generateShadesPalette(hs1,count){
    const palette = [];
    let [hue,saturation, lightness] = hs1;

    //to get shades increase saturation by 10

    for (let i = 0; i < count; i++) {
        let newSaturation = saturation + 10 * i;
        if (newSaturation > 100) {
            //saturation cant be generator than 100
            newSaturation -= 100;
        }

        palette.push([hue,saturation,lightness]);
    }

    return palette;
}

function generateTetradicPalette(hs1,count){
    const palette = [];
    let [hue,saturation, lightness] = hs1;

    //in compound increase hue by 90
    for (let i = 0; i < count; i++) {
        let newHue = hue + 90 * i;
        if (newHue > 360) {
            newHue -= 360;
        }
        palette.push([newHue,saturation,lightness]);
    }
    return palette;
}

function generateSquarePalette(hs1,count){
    const palette = [];
    let [hue,saturation, lightness] = hs1;

    //in compound increase hue by 60
    for (let i = 0; i < count; i++) {
        let newHue = hue + 60 * i;
        if (newHue > 360) {
            newHue -= 360;
        }
        palette.push([newHue,saturation,lightness]);
    }
    return palette;
}

function generateRelatedColorPalette(hs1,count){
    const palette = [];
    const [hue,saturation, lightness] = hs1;

    //to get ralted colors we'll play with hue, saturation and lightness
    //increase saturation by 20 and if greate than 100 reduce
    palette.push([hue,(saturation + 20) % 100, lightness]);
    //decrease by 20
    palette.push([hue,(saturation - 20) % 100, lightness]);
    //increase lightness by 20
    palette.push([hue,saturation, (lightness + 20) % 100]);
    //decrease lilightness
    palette.push([hue,saturation, (lightness - 20) % 100]);
    //same with hue
    palette.push([(hue + 20) % 360,saturation, lightness]);
    palette.push([(hue - 20) % 360,saturation, lightness]);

    //shuffle array
    for (let i = palette.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [palette[i], palette[j]] = palette[j], palette[i];
    }
    return palette;
}

//function a to call a specific function above based on type
function generatePalette(hs1,type,count) {
    switch (type) {
        case "analogous":
            return generateAnalogousPalette(hs1,count);
            case "monochromatic":
                return generateMonochromaticPalette(hs1,count);
        case "triadic":
            return generateTriadicPalette(hs1,count);
        case "compound":
            return generateCompoundPalette(hs1,count);
        case "shades":
            return generateShadesPalette(hs1,count);
            case "tetradic":
                return generateTetradicPalette(hs1,count);
        case "square":
            return generateSquarePalette(hs1,count);
        case "related":
            return generateRelatedColorPalette(hs1,count);
    }

}

function generatePaletteHtml(type,container) {
    //container means for which container palette or related
    let color = currentColor;
    let count = currentCount;
    //we can give any type of color like name of color,rgb, hex to gel hs1
    const hs1 = getHs1FromColor(color)
}

function getHs1FromColor(color) {
    //to get hs1 from any type of given color
    let hs1;
    if (isValodColor(color)){
        //id valid color name,hex,rgb given

    }
}

function isValodColor(color){
    //check color validity
    //a function to check if a given value is valid css
    return CSS.supports("color", color);
}
let hs1 = [155, 55, 55];

let palette = generateMonochromaticPalette(hs1,"related",6);
console.log(palette);