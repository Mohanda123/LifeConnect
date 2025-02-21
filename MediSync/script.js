const btn = document.querySelector('.talk');
const stopBtn = document.querySelector('.stop');
const content = document.querySelector('.content');
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");

// Initialize Speech Synthesis
function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 0.9;

    let voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(voice => voice.name.toLowerCase().includes('male'));
    
    if (selectedVoice) {
        text_speak.voice = selectedVoice;
    }

    window.speechSynthesis.speak(text_speak);
}

// Greet the user based on time
function wishMe() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) speak("Good Morning ...");
    else if (hour >= 12 && hour < 17) speak("Good Afternoon ...");
    else speak("Good Evening ...");
}

// Load voices and initialize
window.addEventListener('load', () => {
    window.speechSynthesis.onvoiceschanged = () => {
        console.log("Available Voices:", window.speechSynthesis.getVoices());
        speak("Initializing MediSync ...");
        wishMe();
    };
});

// Initialize Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

// Start listening
if (btn) {
    btn.addEventListener('click', () => {
        content.textContent = "Listening...";
        try {
            recognition.start();
        } catch (error) {
            console.error("Speech Recognition Error:", error);
            content.textContent = "Error: Speech recognition not supported or permission denied.";
        }
    });
}

// Stop listening and speaking
if (stopBtn) {
    stopBtn.addEventListener('click', () => {
        stopRecognition();
        stopSpeech();
    });
}

function stopRecognition() {
    recognition.stop();
    content.textContent = "Stopped listening.";
}

function stopSpeech() {
    window.speechSynthesis.cancel();
    content.textContent = "Speech stopped.";
}

// Process user commands
function takeCommand(message) {
    console.log("User Command:", message);

    if (message.includes('hello') || message.includes('hi')) {
        speak("Hello Mohan, How may I help you?");
    } 
    else if (message.includes('bye') || message.includes('ok bye')){
        speak("See you, friend...I leave the rest...To you..");
    } 
    else if (message.includes('time')) {
        const time = new Date().toLocaleTimeString();
        const response = `The current time is ${time}.`;
        speak(response);
        appendMessage("Sushi", response);
    } 
    else if (message.includes('date')) {
        const date = new Date().toDateString();
        const response = `Today's date is ${date}.`;
        speak(response);
        appendMessage("Sushi", response);
    } 
    else if (message.includes('calculator')) {
        const expression = message.replace('calculator', '').trim();
        if (expression) {
            try {
                const result = evaluateExpression(expression);
                speak(`The result is ${result}`);
                appendMessage("Sushi", `The result is ${result}`);
            } catch (error) {
                speak("Sorry, I couldn't evaluate that expression.");
                appendMessage("Sushi", "Sorry, I couldn't evaluate that expression.");
            }
        } else {
            speak("Please provide an expression to calculate.");
            appendMessage("Sushi", "Please provide an expression to calculate.");
        }
    } 
    else if (message.includes('open youtube')) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } 
    else if (message.includes('open whatsapp')) {
        window.open("https://web.whatsapp.com", "_blank");
        speak("Opening WhatsApp...");
    } 
    else if (message.includes('open spotify')) {
        window.open("https://open.spotify.com", "_blank");
        speak("Opening Spotify...");
    } 
    else if (message.includes('open instagram')) {
        window.open("https://www.instagram.com", "_blank");
        speak("Opening Instagram...");
    } 
    else if (message.includes('wikipedia') || message.includes('what is') || message.includes('who is') || message.includes('define')) {
        const topic = message.replace(/wikipedia|what is|who is|define/g, "").trim();
        if (topic) {
            searchWikipedia(topic);
        } else {
            speak("Please specify a topic.");
        }
    } 
    else if (message.includes('search google for') || message.includes('why') || message.includes('how') || message.includes('which')) {
        const query = message.replace('search google for', '').trim();
        if (query) {
            searchGoogle(query);
        } else {
            speak("Please specify what you want to search for.");
        }
    } 
    else {
        speak("I'm not sure about that. Can you ask something else?");
    }
}

// Handle chat input
if (sendButton) {
    sendButton.addEventListener("click", handleChatInput);
}
if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleChatInput();
    });
}

function handleChatInput() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    appendMessage("You", userMessage);
    processChat(userMessage);
    chatInput.value = "";
}

function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function processChat(message) {
    takeCommand(message.toLowerCase());
}

// Search Wikipedia
function searchWikipedia(query) {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error("Wikipedia API Error");
            return response.json();
        })
        .then(data => {
            if (data.extract) {
                const result = data.extract;
                speak(result);
                appendMessage("Sushi", result);
            } else {
                speak("I couldn't find anything on Wikipedia.");
            }
        })
        .catch(error => {
            console.error("Wikipedia API Error:", error);
            speak("Sorry, I couldn't fetch the information.");
        });
}

// Evaluate math expressions
function evaluateExpression(expression) {
    try {
        return math.evaluate(expression); // Using math.js library
    } catch (error) {
        console.error("Invalid Expression:", expression);
        return "Invalid expression";
    }
}

// Search Google
async function searchGoogle(query) {
    const apiKey = "AIzaSyArOJTL-AzZn0DccnNpCu2YTNX_KRUyC4s"; // Replace with your API key
    const cx = "052ccd7cfb6dc4fa1"; // Replace with your CX
    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const firstResult = data.items[0]; 
            const resultMessage = `${firstResult.title}\n${firstResult.snippet}\nRead more: ${firstResult.link}`;
            speak(resultMessage);
            appendMessage("Sushi", resultMessage);
        } else {
            speak("No results found.");
        }
    } catch (error) {
        console.error("Google API Error:", error);
        speak("Error fetching search results.");
    }
}