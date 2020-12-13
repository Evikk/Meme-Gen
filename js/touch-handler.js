var canvasTouchHandler = new Hammer(document.querySelector('#meme-canvas'));
var menuTouchHandler = new Hammer(document.querySelector('.menu'));
var navTouchHandler = new Hammer(document.querySelector('nav'));


canvasTouchHandler.on('panstart', (e) => {
    if (gMeme.selectedLineIdx !== null || gMeme.selectedStickerIdx !== null) {
        gIsDragging = true;
    }
});

canvasTouchHandler.on('pan press tap swipe', function (e) {
    document.querySelector('body').style.touchAction = 'none' ;
});

canvasTouchHandler.on('pan' , function (ev) {
    
    if (!gIsDragging) return;
    
    if (gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].pos.x = ev.changedPointers[0].offsetX
        gMeme.lines[gMeme.selectedLineIdx].pos.y = ev.changedPointers[0].offsetY + gMeme.lines[gMeme.selectedLineIdx].lineHeight / 2;
    }
    else if (gMeme.selectedStickerIdx !== null){
        gMeme.stickers[gMeme.selectedStickerIdx].pos.x = ev.changedPointers[0].offsetX - gMeme.stickers[gMeme.selectedStickerIdx].size / 2;
        gMeme.stickers[gMeme.selectedStickerIdx].pos.y = ev.changedPointers[0].offsetY - gMeme.stickers[gMeme.selectedStickerIdx].size / 2;
    }
    renderCanvas()
});

canvasTouchHandler.on('panend', function (e) {
    gIsDragging = false;
});

menuTouchHandler.on('pan press tap swipe', function (e) {
    document.querySelector('body').style.touchAction = 'manipulation' ;
});
navTouchHandler.on('pan press tap swipe', function (e) {
    document.querySelector('body').style.touchAction = 'manipulation' ;
});

