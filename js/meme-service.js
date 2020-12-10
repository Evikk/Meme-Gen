const STORAGE_KEY = 'saved_memes';

var savedMemes = []

var gKeywords = { funny: 22, politics: 9, dog: 15, movies: 13, baby: 20, cute: 11};

var gImgs = [
    { id: 1, url: `img/1.jpg`, keywords: ["trump","politics"] },
    { id: 2, url: `img/2.jpg`, keywords: ["dog","cute","baby"] },
    { id: 3, url: `img/3.jpg`, keywords: ["dog","cute","sleep","baby"] },
    { id: 4, url: `img/4.jpg`, keywords: ["cat","cute","sleep"] },
    { id: 5, url: `img/5.jpg`, keywords: ["baby","success"] },
    { id: 6, url: `img/6.jpg`, keywords: ["history","funny"] },
    { id: 7, url: `img/7.jpg`, keywords: ["baby","cute","funny"] },
    { id: 8, url: `img/8.jpg`, keywords: ["funny","wonka"] },
    { id: 9, url: `img/9.jpg`, keywords: ["baby","evil"] },
    { id: 10, url: `img/10.jpg`, keywords: ["obama","funny","politics"] },
    { id: 11, url: `img/11.jpg`, keywords: ["sport","kiss"] },
    { id: 12, url: `img/12.jpg`, keywords: ["hecht"] },
    { id: 13, url: `img/13.jpg`, keywords: ["gatsby","movies"] },
    { id: 14, url: `img/14.jpg`, keywords: ["morphius","movies"] },
    { id: 15, url: `img/15.jpg`, keywords: ["boromir","movies"] },
    { id: 16, url: `img/16.jpg`, keywords: ["star trek","movies"] },
    { id: 17, url: `img/17.jpg`, keywords: ["putin","politics"] },
    { id: 18, url: `img/18.jpg`, keywords: ["buzz","everywhere"] },
];

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: null,
    selectedStickerIdx: null,
    lines: [
        {
            txt: 'Enter Text Here',
            fontSize: 40,
            align: "center",
            color: "white",
            pos: {x: 250, y: 50},
        },
        {
            txt: 'Enter Text Here',
            fontSize: 40,
            align: "center",
            color: "white",
            pos: {x: 250, y: 450},
        }
    ],
    stickers: []
};

function getImgById(id) {
    return gImgs.findIndex(img => img.id === id);
}

function addLine(){
    gMeme.lines.push({
        txt: 'Enter Text Here',
        fontSize: 40,
        align: "center",
        color: "white",
        pos: {x: gCanvas.width / 2, y: gCanvas.height / 2},
    })
}
function addSticker(url){
    gMeme.stickers.push({
        url: url,
        size: 80,
        pos: {x: gCanvas.width / 2, y: gCanvas.height / 2},
    })
}

function saveMeme() {
    savedMemes.push(gCanvas.toDataURL('image/jpeg'))
    console.log(savedMemes);
    saveToStorage(STORAGE_KEY, savedMemes)
}