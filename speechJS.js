const view = document.querySelector("#text-area p");
const translatedView = document.querySelector("#translated-text p");

const startPause = document.querySelector("#startstop");
const startPauseSpan = document.querySelector("#startstop span");

const startPauseCMD = document.querySelector("#startstop-cmd");
const startPauseCMDSpan = document.querySelector("#startstop-cmd span");

const clear = document.querySelector("#clear");
const clearCMD = document.querySelector("#clear-cmd");
const copy = document.querySelector("#copy");

const language = document.querySelector("#language");
const languageChange = document.querySelector("#language-change");

const loading = document.querySelector("#loading");

const speechToTextArea = document.querySelector("#speech-to-text");
const commandArea = document.querySelector("#command-area");

const speechToText = document.querySelector("#speech-to");
const command = document.querySelector("#command");

const addCommand = document.querySelector("#add-cmd");
const editCommand = document.querySelector("#edit-cmd");

const addCommandInput = document.querySelector(".add-command");
const addActionInput = document.querySelector(".add-action");

const addCmdSave = document.querySelector("#add-save");
const addCommandInputID = document.querySelector("#add-command");
const addActionInputID = document.querySelector("#add-action");

let giveCommand;
let runOrNot = false; // false = stopped
let savedText = "";

let commandText = "";

let editCommndActive = false;
let addCommndActive = false;

let commandMap = new Map();

const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'en-US';

recognition.onresult = function (event) {
    const text = Array.from(event.results)
        .map(results => results[0])
        .map(results => results.transcript)
        .join(' ');

    if (commandArea.style.display === "flex") {
        giveCommand[giveCommand.length - 1].innerHTML = "<i>" + text + "</i>";
        commandText = text;
    } else {
        view.innerHTML = savedText + " " + text;
    }

    // If the language is Sinhala, translate to English
    if (recognition.lang === 'si-LK') {
        translateText(text, 'si', 'en');
    }
};

recognition.onend = function () {
    if (runOrNot) {
        savedText = view.textContent;
        recognition.start();
    }

    if (commandArea.style.display === "flex" && runOrNot) {
        commandReaction();
        createCommandRecieve();
    }
};

recognition.onerror = function (event) {
    console.log(event);
    recognition.stop();
    runOrNot = false;
    startPauseSpan.textContent = "play_arrow";
    startPauseCMDSpan.textContent = "play_arrow";
    buttonEnable();
    language.disabled = false;
    language.className = "";
    animation("Listening stopped...");

    if (commandArea.style.display === "flex") {
        giveCommand[giveCommand.length - 1].innerHTML = "<i> Waiting for start... </i>";
    }
};

startPause.onclick = function () {
    if (!runOrNot) {
        recognition.start();
        runOrNot = true;
        startPauseSpan.textContent = "close";
        buttonDisable();
        language.disabled = true;
        language.className = "disabled";
        animation("Listening started...");
    } else {
        recognition.stop();
        runOrNot = false;
        startPauseSpan.textContent = "play_arrow";
        buttonEnable();
        language.disabled = false;
        language.className = "";
        animation("Listening stopped...");
    }
};

clear.onclick = function () {
    savedText = "";
    view.innerHTML = "<i>Say Something...</i>";
    translatedView.innerHTML = "<i>Translated text will appear here...</i>";
};

copy.onclick = function () {
    navigator.clipboard.writeText(savedText);
    animation("Copied to clipboard!");
};

language.onclick = function () {
    const lang = recognition.lang;

    if (lang === "en-US") {
        recognition.lang = "si-LK";
        languageChange.textContent = "සිංහල";
    } else if (lang === "si-LK") {
        recognition.lang = "en-US";
        languageChange.textContent = "English";
    }
};

// Function to display a text animation
function animation(text) {
    const span = document.createElement("span");
    span.textContent = text;
    document.querySelector("#main-div").appendChild(span);
    setTimeout(() => {
        span.remove();
    }, 3000);
}

// Function to disable buttons
function buttonDisable() {
    clear.disabled = true;
    copy.disabled = true;
    clear.className = "disabled";
    copy.className = "disabled";
}

// Function to enable buttons
function buttonEnable() {
    clear.disabled = false;
    copy.disabled = false;
    clear.className = "";
    copy.className = "";
}

// New function to translate text using Google Translate API
function translateText(text, sourceLang, targetLang) {
    const apiKey = 'AIzaSyCiuhXf9kUFtWvhF-1KBGKDVZBVvC6KGvs'; // Replace with your actual API key
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const data = {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.data && data.data.translations && data.data.translations.length > 0) {
            const translatedText = data.data.translations[0].translatedText;
            // Set the translated text in the new view
            translatedView.innerHTML = translatedText;
        }
    })
    .catch(error => {
        console.error('Error translating text:', error);
    });
}
