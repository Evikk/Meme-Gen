const gCanvas = document.getElementById("meme-canvas");
const gCtx = gCanvas.getContext("2d");
var gIsDragging = false;

if(document.body.clientWidth < 552) {
    resizeCanvas()
}  

function resizeCanvas() {
    document.querySelector('.canvas-container').style.width = '370px'
    gCanvas.width = '360'
    gCanvas.height = '360'
}

function renderImg() {
    var img = new Image();
    var imgIdx = getImgById(gMeme.selectedImgId);
    if (gImgFromUser === null) img.src = gImgs[imgIdx].url
    else img.src = gImgFromUser
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

function onCanvasClicked(ev) {
    var { offsetX, offsetY } = ev;
    // console.log(offsetX, offsetY);
    
    
    var clickedLineIdx = gMeme.lines.findIndex(line => {
        return offsetX >= line.pos.x - (line.lineWidth / 2) - 10 && offsetX <= line.pos.x + (line.lineWidth / 2) + 10
            && offsetY >= line.pos.y - line.lineHeight - 10 && offsetY < line.pos.y + 10
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
        renderTextInput()
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

function onToggleLine(){
    toggleLine()
    renderImg()
}

function onTextInc() {
    textInc()
    renderImg();
}

function onTextDec() {
    textDec()
    renderImg();
}

function onTextMoveUp() {
    textMoveUp()
    renderImg()
}

function onTextMoveDown() {
    textMoveDown()
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
    deleteItem()
    renderTextInput()
    renderImg()
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
    document.querySelector('.save-tooltip').style.visibility = 'visible'
    setTimeout(function(){
        document.querySelector('.save-tooltip').style.visibility = 'hidden'
    }, 2000)
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}