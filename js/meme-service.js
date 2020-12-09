var gKeywords = { happy: 12, politics: 1 };

var gImgs = [
    { id: 1, url: `img/1.jpg`, keywords: ["trump","politics"] },
    { id: 2, url: `img/2.jpg`, keywords: ["dogs","cute"] },
];

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: null,
    lines: [
        {
            idx: 0,
            txt: 'Enter Text Here',
            fontSize: 40,
            align: "center",
            color: "white",
            pos: {x: 250, y: 50},
        },
        {
            idx: 1,
            txt: 'Enter Text Here',
            fontSize: 40,
            align: "center",
            color: "white",
            pos: {x: 250, y: 450},
        }
    ]
};

function getImgById(id) {
    return gImgs.findIndex(img => img.id === id);
}

