function onDeleteMeme(idx) {
    deleteMemeFromStorage(idx)
    getMemesForDisplay()
}

function onSavedMemesClick() {
    document.querySelector('.ui').style.display = 'none'
    document.querySelector('.gallery-container').style.display = 'none'
    document.querySelector('.saved-memes-container').style.display = 'flex'
    getMemesForDisplay()
}

function getMemesForDisplay(){
    var savedMemesSrcs = getSavedMemes()
    if (savedMemesSrcs.length === 0){
        document.querySelector('.saved-memes-content').innerHTML =
        `<div class="card">
            <div class="no-meme-card"><h2>Sorry we didn't find any memes to display...</h2></div>
        </div>`
    } else {
        var strHtmls = savedMemesSrcs.map((src, idx) => {
            return `<div class="card">
                        <img src="${src}">
                        <div class="card-ctrl">
                            <button class="card-ctrl-btn"><a href="${src}" download="my-img.jpg">Download Meme</a></button>
                            <button class="card-ctrl-btn" onclick="onDeleteMeme('${idx}')">Delete Meme</button>
                        </div>
                    </div>`
        })
        document.querySelector('.saved-memes-content').innerHTML = strHtmls.join('')
    }
}