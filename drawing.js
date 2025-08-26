// ================= DRAWING.JS ================= //

const canvas = document.getElementById('staff');
const ctx = canvas.getContext('2d');

const leftMargin = 50;
const rightMargin = 450;
const topLineY = 60;
const lineSpacing = 20;
const bottomLineY = topLineY + 4 * lineSpacing;
const noteX = 250;

let imagesLoaded = 0;
const totalImages = 5;

function imgLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        pickNote();
    }
}

const noteImg = new Image();
noteImg.onload = imgLoaded;
noteImg.src = "https://upload.wikimedia.org/wikipedia/commons/4/4a/1-1_note_semibreve.svg";

const sharpImg = new Image();
sharpImg.onload = imgLoaded;
sharpImg.src = "https://upload.wikimedia.org/wikipedia/commons/7/78/Dièse.svg";

const flatImg = new Image();
flatImg.onload = imgLoaded;
flatImg.src = "https://upload.wikimedia.org/wikipedia/commons/4/4d/Bémol.svg";

const trebleClefImg = new Image();
trebleClefImg.onload = imgLoaded;
trebleClefImg.src = "https://upload.wikimedia.org/wikipedia/commons/c/c2/Treble_Clef_without_line.svg";

const bassClefImg = new Image();
bassClefImg.onload = imgLoaded;
bassClefImg.src = "https://upload.wikimedia.org/wikipedia/commons/b/b1/Clef_Bass_%28F%29.svg";

let clefImg = trebleClefImg;

// ================= Y POSITION FUNCTION ================= //
function yForNote(noteName, instrument) {
    if (typeof stepsFromE4 !== 'function') {
        console.error('stepsFromE4 function not found. Make sure notes.js is loaded first.');
        return topLineY;
    }

    // Reference statements per clef (diatonic step system):
    // - Treble clef bottom line = E4
    // - Bass clef top line     = A3
    const isBass = bassClefInstruments.includes(instrument);
    const refNote = isBass ? 'A3' : 'E4';
    const refY    = isBass ? topLineY : bottomLineY;

    const deltaSteps = stepsFromE4(noteName) - stepsFromE4(refNote);
    return refY - deltaSteps * (lineSpacing / 2);
}

// ================= DRAW FUNCTIONS ================= //
function drawStaffLines() {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
        const y = topLineY + i * lineSpacing;
        ctx.beginPath();
        ctx.moveTo(leftMargin, y);
        ctx.lineTo(rightMargin, y);
        ctx.stroke();
    }
}

function drawLedgerLines(noteName, instrument) {
    const y = yForNote(noteName, instrument);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    const halfWidth = 15;

    if (y > bottomLineY) {
        for (let ly = bottomLineY + lineSpacing; ly <= y; ly += lineSpacing) {
            ctx.beginPath();
            ctx.moveTo(noteX - halfWidth, ly);
            ctx.lineTo(noteX + halfWidth, ly);
            ctx.stroke();
        }
    }

    if (y < topLineY) {
        for (let ly = topLineY - lineSpacing; ly >= y; ly -= lineSpacing) {
            ctx.beginPath();
            ctx.moveTo(noteX - halfWidth, ly);
            ctx.lineTo(noteX + halfWidth, ly);
            ctx.stroke();
        }
    }
}

function drawNoteHead() {
    if (!currentNote) return;
    const instrument = document.getElementById('instrumentSelect').value;
    const y = yForNote(currentNote.name, instrument);
    drawLedgerLines(currentNote.name, instrument);

    const naturalW = 32;
    const naturalH = 19;
    const scale = 0.75;

    safeDrawImage(noteImg, noteX - (naturalW * scale / 2), y - (naturalH * scale / 2), naturalW * scale, naturalH * scale);

    const { accidental } = parseNoteName(currentNote.name);
    if (accidental === '#') {
        safeDrawImage(sharpImg, noteX - 30, y - 18, 12, 35);
    } else if (accidental === 'b') {
        safeDrawImage(flatImg, noteX - 30, y - 22, 12, 30);
    }
}

function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStaffLines();

    const instrument = document.getElementById('instrumentSelect').value;

    if (instrument === 'euphonium') {
        safeDrawImage(bassClefImg, 5, 60, 50, 65); 
    } else {
        safeDrawImage(trebleClefImg, 5, 40, 50, 120);
    }

    drawNoteHead();
}

function safeDrawImage(img, x, y, w, h) {
    if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, x, y, w, h);
    }
}
