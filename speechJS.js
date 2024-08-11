// Querying DOM elements
const voiceInputView = document.querySelector("#voice-input p:last-of-type");
const englishTranslationView = document.querySelector("#english-translation p:last-of-type");
const replyEnglishView = document.querySelector("#reply-english p:last-of-type");
const replySinhalaView = document.querySelector("#reply-sinhala p:last-of-type");

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

const listeningStatus = document.querySelector("#listening-status");

let giveCommand;
let runOrNot = false; // false = stopped
let savedText = "";

let commandText = "";

let editCommndActive = false;
let addCommndActive = false;

let commandMap = new Map();

let currentLanguage = 'en'; // Default language is English

// Speech recognition setup
const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = currentLanguage;

recognition.onresult = function (event) {
    const text = Array.from(event.results)
        .map(results => results[0])
        .map(results => results.transcript)
        .join(' ');

    if (commandArea.style.display === "flex") {
        giveCommand[giveCommand.length - 1].innerHTML = "<i>" + text + "</i>";
        commandText = text;
    } else {
        // Update the voice input box
        voiceInputView.innerHTML = text;

        // Translate text to English if the current language is Sinhala
        if (currentLanguage === 'si') {
            translateText(text, 'si', 'en').then(translatedText => {
                englishTranslationView.innerHTML = translatedText;
                // Generate a reply in English
                generateReply(translatedText).then(replyText => {
                    replyEnglishView.innerHTML = replyText;
                    // Translate the reply to Sinhala
                    translateText(replyText, 'en', 'si').then(sinhalaReplyText => {
                        replySinhalaView.innerHTML = sinhalaReplyText;
                        listeningStatus.style.display = "none"; // Hide "Listening..." after text is generated
                    });
                });
            });
        } else {
            // Directly display English text and reply
            englishTranslationView.innerHTML = text;
            generateReply(text).then(replyText => {
                replyEnglishView.innerHTML = replyText;
                // Translate the reply to Sinhala
                translateText(replyText, 'en', 'si').then(sinhalaReplyText => {
                    replySinhalaView.innerHTML = sinhalaReplyText;
                    listeningStatus.style.display = "none"; // Hide "Listening..." after text is generated
                });
            });
        }
    }
};

recognition.onend = function () {
    if (runOrNot) {
        savedText = voiceInputView.textContent;
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

    listeningStatus.style.display = "none"; // Hide "Listening..." on error
};

// Start/Pause button functionality
startPause.onclick = function () {
    if (!runOrNot) {
        recognition.start();
        runOrNot = true;
        startPauseSpan.textContent = "close";
        buttonDisable();
        language.disabled = true;
        language.className = "disabled";
        listeningStatus.style.display = "block"; // Show "Listening..."
        animation("Listening started...");
    } else {
        recognition.stop();
        runOrNot = false;
        startPauseSpan.textContent = "play_arrow";
        buttonEnable();
        language.disabled = false;
        language.className = "";
        listeningStatus.style.display = "none"; // Hide "Listening..."
        animation("Listening stopped...");
    }
};

startPauseCMD.onclick = function () {
    if (!runOrNot) {
        recognition.start();
        runOrNot = true;
        startPauseCMDSpan.textContent = "close";
        buttonDisable();
        language.disabled = true;
        language.className = "disabled";
        listeningStatus.style.display = "block"; // Show "Listening..."
        animation("Listening started...");
    } else {
        recognition.stop();
        runOrNot = false;
        startPauseCMDSpan.textContent = "play_arrow";
        buttonEnable();
        language.disabled = false;
        language.className = "";
        listeningStatus.style.display = "none"; // Hide "Listening..."
        animation("Listening stopped...");
    }
};

// Function to translate text
function translateText(text, sourceLang, targetLang) {
    const apiKey = 'AIzaSyCiuhXf9kUFtWvhF-1KBGKDVZBVvC6KGvs'; 
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const data = {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
    };

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.data && data.data.translations && data.data.translations.length > 0) {
            return data.data.translations[0].translatedText;
        }
        return text;
    })
    .catch(error => {
        console.error('Error translating text:', error);
        return text;
    });
}

// Function to generate a dummy reply in English
function generateReply(text) {
    const dummyResponse = "This is a dummy response based on your input: " + text;
    return Promise.resolve(dummyResponse);
}

// Toggle language between English and Sinhala
language.onclick = function () {
    if (currentLanguage === 'en') {
        currentLanguage = 'si';
        languageChange.textContent = 'සිංහල'; // Sinhala
        recognition.lang = 'si-LK';
    } else {
        currentLanguage = 'en';
        languageChange.textContent = 'English'; // English
        recognition.lang = 'en-US';
    }
    if (runOrNot) {
        recognition.stop();
        recognition.start();
    }
};
