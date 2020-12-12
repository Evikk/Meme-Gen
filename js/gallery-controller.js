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

function onSearchType(str){
    var filteredImgs = gImgs.filter(img => {
        return img.keywords.find(word => word.includes(str.toLowerCase()))
    })
    var strHtmls = filteredImgs.map(img => {
        return `<img src='${img.url}' onclick="onChooseMeme('${img.id}')">`;
    });
    document.querySelector('.images-wrapper').innerHTML = strHtmls.join('');
}

function onShowAllMemes() {
    document.querySelector('[name="search-meme"]').value = ''
    renderGallery()
}

function onChooseMeme(imgId) {
    document.querySelector(".gallery-container").style.display = "none";
    document.querySelector(".ui").style.display = "flex";
    gMeme.selectedImgId = Number(imgId);  
    renderImg();
}