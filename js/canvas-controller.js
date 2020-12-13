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

function renderCanvas() {
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
            gCtx.drawImage(sticker.img, sticker.pos.x, sticker.pos.y, sticker.size, sticker.size);
            if (idx === gMeme.selectedStickerIdx) {
                renderRect()
            }
        })
    };
}

// function renderSticker(elSticker, size, x, y) {
//     var sticker = elSticker
//     sticker.src = elSticker.src
//     sticker.onload = () => {
//         gCtx.drawImage(sticker, x, y, size, size);
//     }
// }

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
    document.querySelector('[name="line-text"]').readOnly = true
    var { offsetX, offsetY } = ev;
    
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
        document.querySelector('[name="line-text"]').readOnly = false
        renderTextInput()
        renderCanvas()
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
        renderCanvas()
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
        renderCanvas()
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
    renderCanvas()
}

function onToggleLine(){
    toggleLine()
    renderCanvas()
}

function onTextInc() {
    textInc()
    renderCanvas();
}

function onTextDec() {
    textDec()
    renderCanvas();
}

function onTextMoveUp() {
    textMoveUp()
    renderCanvas()
}

function onTextMoveDown() {
    textMoveDown()
    renderCanvas()
}

function renderTextInput() {
    if (gMeme.selectedLineIdx === null) document.querySelector('[name="line-text"]').value = ''
    else document.querySelector('[name="line-text"]').value = gMeme.lines[gMeme.selectedLineIdx].txt
}

function onUpdateTxt(txt){
        updateTxt(txt)
        renderCanvas()
}

function onDeleteItem() {
    deleteItem()
    renderTextInput()
    renderCanvas()
}

function onAddLine() {
    addLine()
    renderCanvas()
}

function onAddSticker(elSticker) {
    addSticker(elSticker)
}

function onSaveMeme() {
    saveMeme()
    document.querySelector('.save-tooltip').style.visibility = 'visible'
    setTimeout(function(){
        document.querySelector('.save-tooltip').style.visibility = 'hidden'
    }, 2000)
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderCanvas)
}