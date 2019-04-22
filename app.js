// initialize synth api
const synth = window.speechSynthesis;

// Gather DOM elements
const textForm = document.querySelector('form');
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const rate = document.getElementById('rate');
const rateValue = document.getElementById('rate-value');
const pitch = document.getElementById('pitch');
const pitchValue = document.getElementById('pitch-value');
const body = document.querySelector('body');


// Initialize voices array
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();
    voices.forEach(voice => {
        // Create option element to append to select box
        const option = document.createElement('option');
        // Populate option with the voice and language
        option.textContent = voice.name + '('+ voice.lang + ')';
        // Set needed option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    })
};
getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

// Speak

const speak = () => {

    // Check if speaking
    if (synth.speaking) {
        console.error('Already talking...');
        return;
    }
    if (textInput.value !== null || textInput.value !== undefined) {
        // Add bg animation
        body.style.background = '#141414 url(wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%';
    //    Get speech text
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        // Speak end
        speakText.onend = e => {
            console.log('Done talking');
            body.style.background = '#141414'
        };
    //    On speech error
        speakText.onerror = e => {
            console.error('Something went wrong');
        };
    //    Selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
        // Loop through voices
        voices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });
        // Set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

    //   Speak
        synth.speak(speakText);
    }
};

// Event listeners

textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

// Rate and pitch value change
rate.addEventListener('change', e => rateValue.textContent = rate.value);
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);

// Speak after voice select
voiceSelect.addEventListener('change', e => speak());
