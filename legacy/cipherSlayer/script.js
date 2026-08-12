// Handle submission of input for processing
document.getElementById("decipherButton").addEventListener("click", () => {
    const inputField = document.getElementById("cipherInput");
    const text = inputField.value.trim();

    if (text === "") {
        alert("Please enter some text.");
        return;
    }

    // Store the input text for further processing
    sessionStorage.setItem("processedText", text);

    // Change text color to cyan
    inputField.style.color = "cyan";
});

// Reverse Word Order Tool
function reverseWordOrder() {
    // Retrieve the text directly from the input field
    const inputField = document.getElementById("cipherInput");
    const text = inputField.value.trim();

    if (!text) {
        alert("Please enter text and press the input button first.");
        return;
    }

    // Reverse word order
    const reversed = text.split(/\s+/).reverse().join(" ");
    inputField.value = reversed;

    // Update session storage
    sessionStorage.setItem("processedText", reversed);
}

// Apply Caesar Shift Tool
function applyCaesarShift() {
    const inputField = document.getElementById("cipherInput");
    const text = inputField.value.trim();

    if (!text) {
        alert("Please enter text and press the input button first.");
        return;
    }

    // Prompt user for shift amount
    const shiftAmount = prompt("Enter the shift amount (positive or negative integer):", "3");

    if (shiftAmount === null) return; // User canceled

    const shift = parseInt(shiftAmount);

    if (isNaN(shift)) {
        alert("Please enter a valid integer for the shift amount.");
        return;
    }

    // Apply the shift
    const shiftedText = caesarShift(text, shift);
    inputField.value = shiftedText;

    // Update session storage
    sessionStorage.setItem("processedText", shiftedText);
}

// Caesar cipher shift function
function caesarShift(text, shift) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return text
        .split("")
        .map((char) => {
            const isLetter = alphabet.includes(char);
            if (!isLetter) return char;

            const index = alphabet.indexOf(char);
            const newIndex = (index + shift + alphabet.length) % alphabet.length;
            return alphabet[newIndex];
        })
        .join("");
}

// Existing animation logic for the header
function animateCaesarShifts(element, text, shifts, interval = 80) {
    let currentStep = 0;

    const updateText = () => {
        if (currentStep < shifts.length) {
            element.textContent = caesarShift(text, shifts[currentStep]);
            currentStep++;
        } else {
            element.textContent = text; // Display the original text
            clearInterval(animationInterval);
        }
    };

    const animationInterval = setInterval(updateText, interval);
}

document.addEventListener("DOMContentLoaded", () => {
    const scrambleTextElement = document.getElementById("scrambleText");
    const finalText = "Enter your encrypted text below:";
    const shifts = [3, 6, 10, 15, 18, 21, 0]; // Increased scrambling
    animateCaesarShifts(scrambleTextElement, finalText, shifts, 80);
});