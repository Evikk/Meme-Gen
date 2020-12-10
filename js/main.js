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
        gMeme.lines.forEach((line, idx) => {
            renderText(
                line.align,
                line.color,
                line.fontSize,
                line.txt,
                line.pos.x,
                line.pos.y,
                idx
            );
            if (idx === gMeme.selectedLineIdx) {
                renderRect()
            }
        });
        gMeme.stickers.forEach((sticker, idx) => {
            renderSticker(idx, sticker.size, sticker.pos.x, sticker.pos.y)
            if (idx === gMeme.selectedStickerIdx) {
                renderRect()
            }
        })
    };
}

function renderSticker(idx, size, x, y) {
    var sticker = new Image();
    sticker.src = gMeme.stickers[idx].url;
    sticker.onload = () => {
        gCtx.drawImage(sticker, x, y, size, size);
    }
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
    var strHtmls = gImgs.map(img => {
        return `<img src='${img.url}' onclick="onChooseMeme('${img.id}')">`;
    });
    document.querySelector('.images-wrapper').innerHTML = strHtmls.join('');
    strHtmls = ''
    for (var key in gKeywords) {
        strHtmls += `<span onclick="onKeywordClick('${key}')"style="font-size:${gKeywords[key]*2}px">${key}</span>`
    }    
    document.querySelector('.keyword-wrapper').innerHTML = strHtmls
}

function onKeywordClick(keyword){
    var filteredImgs = gImgs.filter(img => {
        return img.keywords.indexOf(keyword) > -1
    })
    var strHtmls = filteredImgs.map(img => {
        return `<img src='${img.url}' onclick="onChooseMeme('${img.id}')">`;
    });
    document.querySelector('.images-wrapper').innerHTML = strHtmls.join('');
}

function onChooseMeme(imgId) {
    document.querySelector(".gallery-container").style.display = "none";
    document.querySelector(".ui").style.display = "flex";
    gMeme.selectedImgId = Number(imgId);
    renderImg();
}

function onCanvasClicked(ev) {
    var { offsetX, offsetY } = ev;
    
    var clickedLineIdx = gMeme.lines.findIndex(line => {
        return offsetX >= line.pos.x - (line.lineWidth / 2) && offsetX <= line.pos.x + (line.lineWidth / 2)
            && offsetY >= line.pos.y - line.lineHeight && offsetY < line.pos.y
    })
    var clickedStickerIdx = gMeme.stickers.findIndex(sticker => {
        return offsetX >= sticker.pos.x && offsetX <= sticker.pos.x + sticker.size
            && offsetY >= sticker.pos.y && offsetY < sticker.pos.y + sticker.size
    })
    
    if (clickedLineIdx !== -1) {
        gMeme.selectedLineIdx = clickedLineIdx;
        renderTextInput()
        renderImg()
        gIsDragging = true
        gCanvas.addEventListener('mousemove', (ev) => {
            dragItem(ev)
        });
        gCanvas.addEventListener('mouseup', () => gIsDragging = false)
    } 
    else if (clickedStickerIdx !== -1) {
        gMeme.selectedLineIdx = null;
        gMeme.selectedStickerIdx = clickedStickerIdx
        renderTextInput()
        renderImg()
        gIsDragging = true
        gCanvas.addEventListener('mousemove', (ev) => {
            dragItem(ev)
        });
        gCanvas.addEventListener('mouseup', () => gIsDragging = false)
    }
    else {
        gIsDragging = false
        gMeme.selectedLineIdx = null;
        gMeme.selectedStickerIdx = null;
        renderImg()
    }
    
}

function renderRect() {
    if (gMeme.selectedLineIdx !== null){
        var line = gMeme.lines[gMeme.selectedLineIdx]
        gCtx.beginPath()
        gCtx.strokeStyle = 'white'
        var currRect = {x: line.pos.x - (line.lineWidth / 2) - 10, y: (line.pos.y-line.lineHeight)-10, width: line.lineWidth + 20, height: line.lineHeight + 20}
        gCtx.rect(currRect.x, currRect.y, currRect.width, currRect.height)
        gCtx.stroke() 
        gCtx.fillStyle = 'rgba(0,0,0,0.3)'
        gCtx.fillRect(currRect.x, currRect.y, currRect.width, currRect.height)
    }
    else {
        var sticker = gMeme.stickers[gMeme.selectedStickerIdx]
        gCtx.beginPath()
        gCtx.strokeStyle = 'red'
        var currRect = {x: sticker.pos.x, y: sticker.pos.y, width: sticker.size, height: sticker.size}
        gCtx.rect(currRect.x, currRect.y, currRect.width, currRect.height)
        gCtx.stroke() 
        gCtx.fillStyle = 'rgba(0,0,0,0.3)'
        gCtx.fillRect(currRect.x, currRect.y, currRect.width, currRect.height)
    }
}

function dragItem(ev){
    if (!gIsDragging) return
    var { offsetX, offsetY } = ev;
    if (gMeme.selectedLineIdx !== null){
        var line = gMeme.lines[gMeme.selectedLineIdx]
        line.pos.x = offsetX
        line.pos.y = offsetY
    } else {
        var sticker = gMeme.stickers[gMeme.selectedStickerIdx]
        sticker.pos.x = offsetX - sticker.size / 2
        sticker.pos.y = offsetY - sticker.size / 2
    }
    renderImg()
}


function onSwitchLine(){
    if (gMeme.lines.length === 1 || gMeme.lines.length === 0) return
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx ++
    renderImg()
}

function onTextInc() {
    if (gMeme.selectedLineIdx !== null){
        var line = gMeme.lines[gMeme.selectedLineIdx];
        line.fontSize += 3;
    } else if (gMeme.selectedStickerIdx !== null){
        var sticker = gMeme.stickers[gMeme.selectedStickerIdx]
        sticker.size += 3
    }
    renderImg();
}

function onTextDec() {
    if (gMeme.selectedLineIdx !== null){
        var line = gMeme.lines[gMeme.selectedLineIdx];
        line.fontSize -= 3;
    } else if (gMeme.selectedStickerIdx !== null){
        var sticker = gMeme.stickers[gMeme.selectedStickerIdx]
        sticker.size -= 3
    }
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
    if (gMeme.selectedLineIdx === null) document.querySelector('[name="line-text"]').value = ''
    else document.querySelector('[name="line-text"]').value = gMeme.lines[gMeme.selectedLineIdx].txt
}

function onUpdateTxt(txt){
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
    renderImg()
}

function onDeleteItem() {
    if (gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].txt = ''
        renderTextInput()
        gMeme.lines.splice(gMeme.selectedLineIdx, 1)
        gMeme.selectedLineIdx = null
        renderImg()
    }
    else if (gMeme.selectedStickerIdx !== null){
        gMeme.stickers.splice(gMeme.selectedStickerIdx, 1)
        gMeme.selectedStickerIdx = null
        renderImg()
    }
}

function onAddLine() {
    addLine()
    renderImg()
}

function onAddSticker(src) {
    addSticker(src)
    renderImg()
}

function onSaveMeme() {
    saveMeme()
}