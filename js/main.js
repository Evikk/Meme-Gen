const gCanvas = document.getElementById("meme-canvas");
const gCtx = gCanvas.getContext("2d");
var gIsDragging = false;

if(document.body.clientWidth < 552) {
    resizeCanvas()
}

function resizeCanvas() {
    document.querySelector('.canvas-container').style.width = '370px'
    var contWidth = document.querySelector('.canvas-container').offsetWidth;
    console.log(contWidth)
    gCanvas.width = '360'
    gCanvas.height = '360'
    renderImg()
}

function init() {
    renderGallery();
}

function renderImg() {
    var imgIdx = getImgById(gMeme.selectedImgId);
    var img = new Image();
    img.src = gImgs[imgIdx].url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        gMeme.lines.forEach((line) => {
            renderText(
                line.align,
                line.color,
                line.fontSize,
                line.txt,
                line.pos.x,
                line.pos.y,
                line.idx
            );
            if (line.idx === gMeme.selectedLineIdx) {
                renderRect()
            }
        });
    };
}

function renderText(align, color, fontSize, text, x, y, idx) {
    gCtx.textAlign = align;
    gCtx.fillStyle = color;
    gCtx.lineWidth = "2";
    gCtx.font = `normal ${fontSize}px Impact`;
    gCtx.fillText(text, x, y);
    gCtx.strokeStyle = 'black'
    gCtx.strokeText(text, x, y);
    gMeme.lines[idx].lineWidth = gCtx.measureText(text).width
    gMeme.lines[idx].lineHeight = gCtx.measureText(text).actualBoundingBoxAscent
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function renderGallery() {
    var strHtmls = gImgs.map((img) => {
        return `<img src='${img.url}' onclick="onChooseMeme('${img.id}')">`;
    });
    document.querySelector(".images-wrapper").innerHTML = strHtmls.join("");
}

function onChooseMeme(imgId) {
    document.querySelector(".gallery-container").style.display = "none";
    document.querySelector(".ui").style.display = "flex";
    gMeme.selectedImgId = Number(imgId);
    renderImg();
}

function onCanvasClicked(ev) {
    var { offsetX, offsetY } = ev;
    var clickedLine = gMeme.lines.find(line => {
        return offsetX >= line.pos.x - (line.lineWidth / 2) && offsetX <= line.pos.x + (line.lineWidth / 2)
            && offsetY >= line.pos.y - line.lineHeight && offsetY < line.pos.y
    })
    if (clickedLine) {
        gMeme.selectedLineIdx = clickedLine.idx;
        renderTextInput()
        renderImg()
        gIsDragging = true
        gCanvas.addEventListener('mousemove', (ev) => {
            dragLine(ev)
        });
        gCanvas.addEventListener('mouseup', () => gIsDragging = false)
    } else {
        gIsDragging = false
        gMeme.selectedLineIdx = null;
        renderImg()
    }
    
}

function renderRect() {
    var line = gMeme.lines[gMeme.selectedLineIdx]
    gCtx.beginPath()
    gCtx.strokeStyle = 'white'
    var currRect = {x: line.pos.x - (line.lineWidth / 2) - 10, y: (line.pos.y-line.lineHeight)-10, width: line.lineWidth + 20, height: line.lineHeight + 20}
    gCtx.rect(currRect.x, currRect.y, currRect.width, currRect.height)
    gCtx.stroke() 
    gCtx.fillStyle = 'rgba(0,0,0,0.3)'
    gCtx.fillRect(currRect.x, currRect.y, currRect.width, currRect.height)
}

function dragLine(ev){
    if (!gIsDragging) return
    var { offsetX, offsetY } = ev;
    var line = gMeme.lines[gMeme.selectedLineIdx]
    line.pos.x = offsetX
    line.pos.y = offsetY
    renderImg()
}


function onSwitchLine(){
    if (gMeme.lines.length === 1 || gMeme.lines.length === 0) return
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx ++
    console.log(gMeme.selectedLineIdx, 'choosed');
}

function onTextInc() {
    var line = gMeme.lines[gMeme.selectedLineIdx];
    line.fontSize += 3;
    renderImg();
}

function onTextDec() {
    var line = gMeme.lines[gMeme.selectedLineIdx];
    line.fontSize -= 3;
    renderImg();
}

function onTextMoveUp() {
    var line = gMeme.lines[gMeme.selectedLineIdx];
    line.pos.y -= 5
    renderImg()
}

function onTextMoveDown() {
    var line = gMeme.lines[gMeme.selectedLineIdx];
    line.pos.y += 5
    renderImg()
}

function renderTextInput() {
    document.querySelector('[name="line-text"]').value = gMeme.lines[gMeme.selectedLineIdx].txt
}

function onUpdateTxt(txt){
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
    renderImg()
}