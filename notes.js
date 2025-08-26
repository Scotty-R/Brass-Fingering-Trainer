// ================= NOTES ================= //

let notes = [];

async function loadInstrumentNotes(instrument) {
    try {
        const response = await fetch(`${instrument}Notes.json`);
        notes = await response.json();
    } catch (err) {
        console.error(`Failed to load ${instrument} notes`, err);
    }
}

function parseNoteName(noteName) {
    const match = /^([A-G])([b#]?)([0-9])$/.exec(noteName);
    if (!match) throw new Error('Invalid note name: ' + noteName);
    return { letter: match[1], accidental: match[2], octave: parseInt(match[3], 10) };
}

const letterIndex = { C:0, D:1, E:2, F:3, G:4, A:5, B:6 };

function stepsFromE4(noteName) {
    const { letter, octave } = parseNoteName(noteName);
    return (octave - 4) * 7 + (letterIndex[letter] - letterIndex.E);
}
