// ================= LOGIC ================= //

let currentNote = null;
let currentKeys = new Set();
let lastNote = null;
let timerInterval;
let elapsed = 0;

// Flag for bass clef instruments
const bassClefInstruments = ['euphonium'];

// Start timer
function startTimer() {
  elapsed = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    elapsed++;
    if (elapsed >= 3) {
      showHint();
    }
  }, 1000);
}

// Stop timer
function stopTimer() {
  clearInterval(timerInterval);
  document.getElementById('timer').textContent = '';
}

// Pick a random note, avoiding repeats
function pickNote() {
  stopTimer();
  document.getElementById('correctFingering').textContent = '';

  let newNote;
  do {
    newNote = notes[Math.floor(Math.random() * notes.length)];
  } while (newNote === lastNote && notes.length > 1);

  lastNote = newNote;
  currentNote = newNote;

  currentKeys.clear(); // clear keys to prevent residual presses
  drawFrame(newNote);
  startTimer();
}

// Show hint after 3 seconds
function showHint() {
    if (!currentNote) return;

    let hint = currentNote.fingering || 'open';
    const instrument = document.getElementById('instrumentSelect').value;

    const keyMap = {
        trumpet: { j: '1', k: '2', l: '3' },
        horn:    { d: '1', s: '2', a: '3' },
        euphonium: { j: '1', k: '2', l: '3' }
    };

    // Convert key bindings to finger numbers and sort ascending
    hint = hint
        .split('')
        .map(ch => keyMap[instrument][ch] || ch)
        .sort((a,b) => a - b)
        .join('');

    document.getElementById('correctFingering').textContent = `Answer: ${hint}`;
}

// Check fingering submission
function checkFingering() {
  if (!currentNote) return;

  let pressed = Array.from(currentKeys).sort().join('');
  let correct = currentNote.fingering;

  // Ignore order of keys for instruments with multiple valves pressed
  let pressedSet = new Set(pressed);
  let correctSet = new Set(correct);

  if (pressedSet.size === correctSet.size && [...pressedSet].every(k => correctSet.has(k))) {
      pickNote();
  } else {
      // Wrong answer → flash red
      ctx.fillStyle = 'red';
      ctx.font = '20px Arial';
      ctx.fillText('Wrong!', 250, 50);
      setTimeout(() => drawFrame(currentNote), 1000);
  }
}

// Handle key presses
document.addEventListener('keydown', e => {
  if (['j','k','l','a','s','d'].includes(e.key)) {
    currentKeys.add(e.key);
  } else if (e.code === 'Space') {
    if (!e.repeat) checkFingering();
  }
});

document.addEventListener('keyup', e => {
  if (['j','k','l','a','s','d'].includes(e.key)) {
    currentKeys.delete(e.key);
  }
});

// Instrument selection
document.getElementById('instrumentSelect').addEventListener('change', async e => {
  await loadInstrumentNotes(e.target.value);
  pickNote();
});

// Initial instrument load
window.addEventListener('load', async () => {
  await loadInstrumentNotes(document.getElementById('instrumentSelect').value);
  pickNote();
});
