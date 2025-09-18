const searchInput=document.querySelector("#search-input"),
    searchColor=document.querySelector(".search-color"),
    searchImage=document.querySelector("#search-image"),
    typeSelect=document.querySelector("#palette-type"),
    countSelect=document.querySelector("#palette-count"),
    paletteContainer=document.querySelector("#palette-container"),
    relatedContainer=document.querySelector("#related"),
    randomBtn=document.querySelector("#random-btn"),
    downloadBtn=document.querySelector("#download-btn"),
    downloadName=document.querySelector("#download-name"),
    downloadFormat=document.querySelector("#download-format"),
    toast=document.querySelector(".toast");

let currentColor="skyblue",
    currentType="analogous",
    currentCount=6;

// --- Palette generation ---
function generatePaletteByType(hsl,type,count){
    const [h,s,l]=hsl;
    switch(type){
        case"analogous": return Array.from({length:count},(_,i)=>[(h+(i-Math.floor(count/2))*30+360)%360,s,l]);
        case"monochromatic": return Array.from({length:count},(_,i)=>[h,s,(l+10*i)%100]);
        case"triadic": return Array.from({length:count},(_,i)=>[(h+120*i)%360,s,l]);
        case"compound": return Array.from({length:count},(_,i)=>[(h+150*i)%360,s,l]);
        case"shades": return Array.from({length:count},(_,i)=>[h,(s+10*i)%100,l]);
        case"tetradic": return Array.from({length:count},(_,i)=>[(h+90*i)%360,s,l]);
        case"square": return Array.from({length:count},(_,i)=>[(h+60*i)%360,s,l]);
        case"related": return [[h,(s+20)%100,l],[h,(s-20+100)%100,l],[h,s,(l+20)%100],[h,s,(l-20+100)%100],[(h+20)%360,s,l],[(h-20+360)%360,s,l]];
        default: return [];
    }
}

// --- Color conversions ---
function getHsl(color){
    if(!CSS.supports("color",color)) return null;
    const temp=document.createElement("div");
    temp.style.color=color;
    document.body.appendChild(temp);
    const rgb=window.getComputedStyle(temp).color.replace("rgb(","").replace(")","").split(",").map(Number);
    document.body.removeChild(temp);
    return rgbToHsl(rgb);
}
function rgbToHsl([r,g,b]){
    r/=255; g/=255; b/=255;
    const max=Math.max(r,g,b),min=Math.min(r,g,b);
    let h=0,s=0,l=(max+min)/2;
    if(max!==min){const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);h=max===r?((g-b)/d+(g<b?6:0)):max===g?(b-r)/d+2:(r-g)/d+4;h*=60;}
    return [Math.round(h),Math.round(s*100),Math.round(l*100)];
}
function hslToHex([h,s,l]){
    l/=100; const a=s*Math.min(l,1-l)/100;
    const f=n=>{const k=(n+h/30)%12; const color=l-a*Math.max(Math.min(k-3,9-k,1),-1); return Math.round(255*color).toString(16).padStart(2,"0");}
    return `#${f(0)}${f(8)}${f(4)}`;
}

// --- Render palettes ---
function renderPalette(type,container,labelColor=null){
    const hsl=getHsl(currentColor);
    if(!hsl) return;
    const palette=generatePaletteByType(hsl,type,currentCount);
    const wrapper=document.createElement("div");
    wrapper.classList.add("palette-wrapper");

    if(labelColor){
        const label=document.createElement("p");
        label.style.display="flex"; label.style.alignItems="center"; label.style.gap="8px"; label.style.fontWeight="bold"; label.style.margin="10px 0 5px";
        const swatch=document.createElement("span");
        swatch.style.width="20px"; swatch.style.height="20px"; swatch.style.backgroundColor=labelColor; swatch.style.border="1px solid #000"; swatch.style.borderRadius="4px";
        label.appendChild(swatch); label.appendChild(document.createTextNode(`Palette for ${labelColor}`));
        wrapper.appendChild(label);
    }

    const paletteDiv=document.createElement("div"); paletteDiv.classList.add("palette");
    palette.forEach(cHsl=>{const hex=hslToHex(cHsl); const div=document.createElement("div"); div.classList.add("color"); div.style.backgroundColor=hex; div.innerHTML=`<div class="overlay"><div class="icons"><div class="copy-color"><i class="fas fa-copy"></i></div><div class="generate-palette"><i class="fas fa-palette"></i></div></div><div class="code">${hex}</div></div>`; paletteDiv.appendChild(div);});
    wrapper.appendChild(paletteDiv);
    container.appendChild(wrapper);
}

// --- Initial render ---
renderPalette(currentType,paletteContainer);
renderPalette("related",relatedContainer);

// --- Events ---
searchInput.addEventListener("keyup",e=>{const val=e.target.value;if(CSS.supports("color",val)){currentColor=val;searchColor.style.backgroundColor=val;renderPalette(currentType,paletteContainer);renderPalette("related",relatedContainer);}});
randomBtn.addEventListener("click",()=>{const rand=`#${Math.floor(Math.random()*16777215).toString(16).padStart(6,"0")}`;currentColor=rand;searchInput.value=rand;searchColor.style.backgroundColor=rand;renderPalette(currentType,paletteContainer);renderPalette("related",relatedContainer);});
typeSelect.addEventListener("change",e=>{currentType=e.target.value;renderPalette(currentType,paletteContainer);});
countSelect.addEventListener("change",e=>{currentCount=parseInt(e.target.value);renderPalette(currentType,paletteContainer);});

// --- Copy color ---
document.addEventListener("click",e=>{if(e.target.closest(".copy-color")){const code=e.target.closest(".color").querySelector(".code").textContent;navigator.clipboard.writeText(code).then(()=>showToast(`Copied ${code}`));}});

// --- Toast ---
function showToast(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1500);}

// --- Download ---
downloadBtn.addEventListener("click",()=>{
    const wrappers=Array.from(paletteContainer.querySelectorAll(".palette-wrapper"));
    const baseName=downloadName.value||"palette"; const format=downloadFormat.value;
    wrappers.forEach((wrapper,index)=>{
        const colors=Array.from(wrapper.querySelectorAll(".color")).map(c=>c.querySelector(".code").textContent);
        const name=`${baseName}_${index+1}`;
        if(format==="css") downloadFile(`${name}.css`,colors.map((c,i)=>`--color${i+1}: ${c};`).join("\n"));
        else if(format==="json") downloadFile(`${name}.json`,JSON.stringify(colors,null,2));
        else if(format==="svg") downloadFile(`${name}.svg`,generateSVG(colors));
        else if(format==="png") generatePNG(colors,`${name}.png`);
    });
});
function downloadFile(filename,content){const blob=new Blob([content],{type:"text/plain"});const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=filename;link.click();}
function generateSVG(colors){const w=100*colors.length,h=100;const rects=colors.map((c,i)=>`<rect x="${i*100}" y="0" width="100" height="100" fill="${c}"/>`).join("\n");return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${rects}</svg>`;}
function generatePNG(colors,filename){const canvas=document.createElement("canvas");canvas.width=100*colors.length;canvas.height=100;const ctx=canvas.getContext("2d");colors.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(i*100,0,100,100);});canvas.toBlob(blob=>{const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=filename;link.click();});}

// --- Image processing ---
searchImage.addEventListener("change",e=>{const file=e.target.files[0];if(!file) return;const img=new Image();const reader=new FileReader();reader.onload=event=>{img.src=event.target.result;img.onload=()=>extractColors(img);};reader.readAsDataURL(file);});

function extractColors(img){
    const canvas=document.createElement("canvas"); const ctx=canvas.getContext("2d"); const w=100,h=100; canvas.width=w; canvas.height=h; ctx.drawImage(img,0,0,w,h); const data=ctx.getImageData(0,0,w,h).data; const colorMap={};
    for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2],a=data[i+3]; if(a<128) continue; const rr=Math.round(r/16)*16,gg=Math.round(g/16)*16,bb=Math.round(b/16)*16; const hex=`#${((1<<24)+(rr<<16)+(gg<<8)+bb).toString(16).slice(1)}`; colorMap[hex]=(colorMap[hex]||0)+1;}
    const sorted=Object.entries(colorMap).sort((a,b)=>b[1]-a[1]).slice(0,currentCount);
    paletteContainer.innerHTML="";
    sorted.forEach(([hex])=>{currentColor=hex; renderPalette(currentType,paletteContainer,hex);});
    if(sorted.length>0){currentColor=sorted[0][0]; renderPalette("related",relatedContainer);}
}
