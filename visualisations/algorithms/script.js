const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let data = [];
let comparisons = 0;
let swaps = 0;

// Generate random data
function generateRandomData(size) {
    data = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    comparisons = 0; // Reset comparisons
    swaps = 0; // Reset swaps
    draw();
}

// Draw bars on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / data.length;

    data.forEach((value, index) => {
        ctx.fillStyle = 'blue';
        ctx.fillRect(index * barWidth, canvas.height - value * 3, barWidth - 1, value * 3);
    });
}

// Update statistics display
function updateStats() {
    document.getElementById('comparisons').textContent = comparisons;
    document.getElementById('swaps').textContent = swaps;
}

// Bubble Sort algorithm
async function bubbleSort(speed) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length - i - 1; j++) {
            comparisons++;
            if (data[j] > data[j + 1]) {
                swaps++;
                [data[j], data[j + 1]] = [data[j + 1], data[j]];
                draw();
                updateStats();
                await new Promise(resolve => setTimeout(resolve, speed));
            }
        }
    }
}

// Selection Sort algorithm
async function selectionSort(speed) {
    for (let i = 0; i < data.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < data.length; j++) {
            comparisons++;
            if (data[j] < data[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            swaps++;
            [data[i], data[minIndex]] = [data[minIndex], data[i]];
            draw();
            updateStats();
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }
}

// Insertion Sort algorithm
async function insertionSort(speed) {
    for (let i = 1; i < data.length; i++) {
        let key = data[i];
        let j = i - 1;
        while (j >= 0 && data[j] > key) {
            comparisons++;
            data[j + 1] = data[j];
            j--;
            swaps++;
            draw();
            updateStats();
            await new Promise(resolve => setTimeout(resolve, speed));
        }
        data[j + 1] = key;
        draw();
        updateStats();
    }
}

// Quick Sort algorithm
async function quickSort(arr = data, left = 0, right = arr.length - 1, speed) {
    if (left < right) {
        const pivotIndex = await partition(arr, left, right, speed);
        await Promise.all([
            quickSort(arr, left, pivotIndex - 1, speed),
            quickSort(arr, pivotIndex + 1, right, speed)
        ]);
    }
}

// Partition function for Quick Sort
async function partition(arr, left, right, speed) {
    const pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
        comparisons++;
        if (arr[j] < pivot) {
            i++;
            swaps++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            draw();
            updateStats();
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    draw();
    updateStats();
    return i + 1;
}

// Event Listeners
document.getElementById('reroll').addEventListener('click', () => {
    const dataSize = parseInt(document.getElementById('dataSize').value);
    generateRandomData(dataSize);
});

document.getElementById('startSort').addEventListener('click', async () => {
    const speed = parseInt(document.getElementById('speed').value);
    const selectedAlgorithm = document.getElementById('algorithm').value;
    switch (selectedAlgorithm) {
        case 'bubble':
            await bubbleSort(speed);
            break;
        case 'selection':
            await selectionSort(speed);
            break;
        case 'insertion':
            await insertionSort(speed);
            break;
        case 'quick':
            await quickSort(data, 0, data.length - 1, speed);
            break;
    }
});

// Initial random data
generateRandomData(100);
