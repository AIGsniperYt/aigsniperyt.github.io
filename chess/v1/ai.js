// Get the canvas element and its 2D context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Create a Map to represent the chessboard
const chessboard = new Map();

// Set the number of rows and columns
const rows = 8;
const cols = 8;

// Disable image smoothing for sharper edges
ctx.imageSmoothingEnabled = false;

let turn = "white";

let whiteRookMoved = {
    kingside: false,
    queenside: false
};
let blackRookMoved = {
    kingside: false,
    queenside: false
};

let whiteCanCastle = true;
let blackCanCastle = true;

let blackLegalMoves = []; // Declare blackLegalMoves as a global array
let whiteLegalMoves = []; // Declare whiteLegalMoves as a global array

let whiteKingMoved = false;
let blackKingMoved = false;

// Create an array to store moves
const moveHistory = [];

// array to store squares controlled by the enemy
const blackControlledSquares = [];

let chessboardHeight = 0; // Initialize chessboard height
let tileSize = calculateTileSize(); // Initial calculation

// Function to calculate the tileSize based on the canvas size
function calculateTileSize() {
    return Math.min(canvas.width / 8, canvas.height / 8);
}

// Function to set canvas size based on viewport dimensions
function setCanvasSize() {
    chessboardHeight = (window.innerHeight / 5) * 4; // 80% of viewport height
    canvas.height = chessboardHeight;
    canvas.width = chessboardHeight; // Make it a square
    tileSize = calculateTileSize(); // Recalculate tileSize after resizing
}


function init() {
    setCanvasSize();
    drawBoard();
    drawPieces();
    // Call the setupInitialPieces function to set up the starting positions
    setupInitialPieces();
    calculateBlackLegalMoves();
    calculateWhiteLegalMoves();
}

// Event listener for window resize
window.addEventListener('resize', () => {
    init();
});
// Initial setup
setCanvasSize();

// Define image sources for different pieces for both black and white
const pieceImages = {
    "empty": "",
    'white_pawn': 'images/white-pawn.png',
    'black_pawn': 'images/black-pawn.png',
    'white_rook': 'images/white-rook.png',
    'black_rook': 'images/black-rook.png',
    'white_knight': 'images/white-knight.png',
    'black_knight': 'images/black-knight.png',
    'white_bishop': 'images/white-bishop.png',
    'black_bishop': 'images/black-bishop.png',
    'white_queen': 'images/white-queen.png',
    'black_queen': 'images/black-queen.png',
    'white_king': 'images/white-king.png',
    'black_king': 'images/black-king.png',
};



// Set up the initial state of the chessboard as 'empty'
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const tileKey = String.fromCharCode(97 + row) + (8 - col);
        chessboard.set(tileKey, 'empty');
    }
}


// Initialize tilesToColour array
let tilesToColour = [];


console.log("check 1: ", tilesToColour)

// Add a new array to keep track of coloured tiles
let colouredTiles = [];

function drawBoard() {
    // Loop through the chessboard Map
    for (const [tileKey, piece] of chessboard) {
        // Extract row and col from the tileKey
        const row = 8 - parseInt(tileKey[1]);
        const col = tileKey.charCodeAt(0) - 97;

        // Calculate the x and y coordinates for each tile
        const x = col * tileSize;
        const y = row * tileSize;

        // Determine the color for the tile and coordinates
        const tileColor = (row + col) % 2 === 0 ? '#F5F5DC' : '#5C87A7'; // Creamy white and lighter blue colors
        const textColor = (row + col) % 2 === 0 ? '#5C87A7' : '#F5F5DC'; // Swap colors for text based on tile color

        ctx.fillStyle = tileColor;


        ctx.fillRect(x, y, tileSize, tileSize);

        // Draw the coordinates on the tile for the bottom row and left column
        ctx.fillStyle = textColor;
        ctx.font = 'bold 14px Arial';

        // Display the numbers on the left column
        if (col === 0) {
            ctx.fillText(8 - row, x + tileSize - 88, y + 15);
        }

        // Display the letters on the bottom right of the bottom row
        if (row === 7) {
            ctx.fillText(String.fromCharCode(97 + col), x + tileSize - 13, y + tileSize - 5);
        }
    }
}


function drawPieces() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawBoard();

    // Loop through the chessboard Map
    for (const [tileKey, piece] of chessboard) {
        // Extract row and col from the tileKey
        const row = 8 - parseInt(tileKey[1]);
        const col = tileKey.charCodeAt(0) - 97;

        // Calculate the x and y coordinates for each tile
        const x = col * tileSize;
        const y = row * tileSize;

        // Get the image source based on the piece value and color
        const pieceImageSrc = pieceImages[piece];

        // If the piece is not empty, draw the image on the tile
        if (pieceImageSrc !== '') {
            const img = new Image();
            img.src = pieceImageSrc;
            // Use the onload event to ensure the image is loaded before drawing
            img.onload = function () {
                ctx.drawImage(img, x, y, tileSize, tileSize);
            };


        }
    }
}

function setupInitialPieces() {
    // Initial positions for white pieces
    chessboard.set('a1', 'white_rook');
    //chessboard.set('b1', 'white_knight');
    //chessboard.set('c1', 'white_bishop');
    //chessboard.set('d1', 'white_queen');
    chessboard.set('e1', 'white_king');
    //chessboard.set('f1', 'white_bishop');
    //chessboard.set('g1', 'white_knight');
    chessboard.set('h1', 'white_rook');
    for (let col = 0; col < cols; col++) {
        const tileKey = String.fromCharCode(97 + col) + '2';
        //chessboard.set(tileKey, 'white_pawn');
    }

    // Initial positions for black pieces
    chessboard.set('a8', 'black_rook');
    //chessboard.set('b8', 'black_knight');
    //chessboard.set('c8', 'black_bishop');
    //chessboard.set('d8', 'black_queen');
    chessboard.set('e8', 'black_king');
    //chessboard.set('f8', 'black_bishop');
    //chessboard.set('g8', 'black_knight');
    chessboard.set('h8', 'black_rook');
    for (let col = 0; col < cols; col++) {
        const tileKey = String.fromCharCode(97 + col) + '7';
        //chessboard.set(tileKey, 'black_pawn');
    }
}

// Call the setupInitialPieces function to set up the starting positions
setupInitialPieces();
calculateBlackLegalMoves(blackLegalMoves, chessboard);
calculateWhiteLegalMoves(whiteLegalMoves, chessboard);
updateTilesToColour();

// Call the drawBoard and drawPieces functions to update the board
drawPieces();

function updateTilesToColour() {
    tilesToColour.length = 0;
    // Determine the opponent's legal moves array based on the current turn
    const opponentLegalMoves = (turn === 'white') ? blackLegalMoves : whiteLegalMoves;
    console.log("OPPONENT LEGAL MOVES: ", opponentLegalMoves)
    // Iterate through each object in the opponent's legal moves array
    for (const move of opponentLegalMoves) {
        const legalMovesArray = move.legalMoves;

        // Iterate through each string in legalMovesArray
        for (const tile of legalMovesArray) {
            // Check if the tile doesn't exist in tilesToColour array
            if (!tilesToColour.includes(tile)) {
                // Add the tile to tilesToColour array
                tilesToColour.push(tile);
            }
        }
    }
    console.log("TILES TO COLOUR: ", tilesToColour);
    // Now, tilesToColour contains unique data from all legalMoves arrays
}




function getPieceAtTile(tileKey) {
    return chessboard.get(tileKey);
}


// drag and drop

let selectedPiece = null;
let col = 1; // Initialize col
let row = 8; // Initialize row




// Define a list to store tiles to be highlighted
let highlightedTiles = [];
// Function to highlight tiles in the list
function highlightTiles() {
    for (const tile of highlightedTiles) {
        const targetCol = tile.charCodeAt(0) - 97;
        const targetRow = 8 - parseInt(tile[1]);
        const targetX = targetCol * tileSize;
        const targetY = targetRow * tileSize;

        // Highlight the tile by coloring it green
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.fillRect(targetX, targetY, tileSize, tileSize);
    }
}

function highlightOpponentLegalMovesRed() {
    for (const tile of tilesToColour) {
        const targetCol = tile.charCodeAt(0) - 97;
        const targetRow = 8 - parseInt(tile[1]);
        const targetX = targetCol * tileSize;
        const targetY = targetRow * tileSize;

        // Highlight the tile by coloring it red
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(targetX, targetY, tileSize, tileSize);
    }
}

// Add event listener to handle piece selection and legal move visualization
canvas.addEventListener('mousedown', (e) => {
    col = 1; // Reset col
    row = 8; // Reset row


    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Calculate the column based on mouse position
    let theMouseX = mouseX;
    let theMouseY = mouseY;

    while (theMouseX > tileSize) {
        theMouseX -= tileSize;
        col++;
    }

    // Calculate the row based on mouse position
    while (theMouseY > tileSize) {
        theMouseY -= tileSize;
        row--;
    }

    // Get the tile key corresponding to the mouse position
    const tileKey = String.fromCharCode(97 + col - 1) + row;

    // Check if a piece is present on the clicked tile
    const piece = chessboard.get(tileKey);
    if (piece !== 'empty' && piece.includes(turn)) {
        selectedPiece = { tileKey, piece };

        // Calculate legal moves for the selected piece
        const legalMoves = calculatePieceLegalMoves(tileKey, piece, turn, chessboard);

        // Update the list of highlighted tiles
        highlightedTiles = legalMoves;

        // Redraw the board with highlighted tiles
        drawBoard();
        drawPieces();
        highlightTiles();
        highlightOpponentLegalMovesRed();
    }
});
canvas.addEventListener('mousemove', (e) => {
    if (selectedPiece) {
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (selectedPiece) {
        // Check if the selected piece has the current turn information
        if (selectedPiece.piece.includes(turn)) {
            let newCol = 1; // Initialize newCol
            let newRow = 8; // Initialize newRow

            const mouseX = e.offsetX;
            const mouseY = e.offsetY;

            // Calculate the new column based on mouse position
            let theMouseX = mouseX;
            while (theMouseX > tileSize) {
                theMouseX -= tileSize;
                newCol++;
            }

            // Calculate the new row based on mouse position
            let theMouseY = mouseY;
            while (theMouseY > tileSize) {
                theMouseY -= tileSize;
                newRow--;
            }

            // Get the new tile key corresponding to the mouse position
            const newTileKey = String.fromCharCode(97 + newCol - 1) + newRow;

            // Update the turn based on the returned value from handleMove
            turn = handleMove(selectedPiece.tileKey, newTileKey, selectedPiece.piece, turn);

            updateTilesToColour();
            console.log(turn);


            // Clear the selected piece after dropping
            selectedPiece = null;
        }
    }
});


// piece legal movement system

// Function to check if a pawn move is legal
function isPawnMoveLegal(initialTile, targetTile, color) {
    // Determine the direction based on the pawn's color
    const direction = (color === 'white') ? 1 : -1;

    // Calculate the row difference and column difference
    const rowDiff = targetTile[1] - initialTile[1];
    const colDiff = targetTile.charCodeAt(0) - initialTile.charCodeAt(0);

    // Check for en passant capture
    if (Math.abs(colDiff) === 1 && rowDiff === direction) {
        const targetPiece = chessboard.get(targetTile);

        // Check if the target tile is empty and the piece to be captured is an enemy pawn
        if (targetPiece === 'empty' && isEnemyPawnAdjacent(initialTile, targetTile, color)) {
            const enemyPawnTile = String.fromCharCode(targetTile.charCodeAt(0)) + initialTile[1];

            // Capture the enemy pawn by setting its tile to 'empty'
            chessboard.set(enemyPawnTile, 'empty');
            return true;
        }
    }

    // Pawn can move one square forward only if the target tile is empty
    if (colDiff === 0 && rowDiff === direction) {
        const targetPiece = chessboard.get(targetTile);
        if (targetPiece === 'empty') {
            return true; // Regular move is legal
        }
    }

    // Pawn can make a double move from its starting position only if the target tile is empty and the intermediate tile is also empty
    if (colDiff === 0 && rowDiff === 2 * direction && ((color === 'white' && initialTile[1] === '2') || (color === 'black' && initialTile[1] === '7'))) {
        const intermediateTile = String.fromCharCode(initialTile.charCodeAt(0)) + (parseInt(initialTile[1]) + direction);
        const targetPiece = chessboard.get(targetTile);
        const intermediatePiece = chessboard.get(intermediateTile);

        // Check if both the target tile and intermediate tile are empty
        if (targetPiece === 'empty' && intermediatePiece === 'empty') {
            return true;
        }
    }

    // Pawn can capture diagonally only if the target tile is not empty and contains an opponent's piece
    if (Math.abs(colDiff) === 1 && rowDiff === direction) {
        const targetPiece = chessboard.get(targetTile);
        return targetPiece !== 'empty' && !targetPiece.includes(color);
    }

    // Invalid move
    return false;
}

// Function to check and perform pawn promotion on the entire chessboard
function checkAndPerformPawnPromotion() {
    for (const [tile, piece] of chessboard.entries()) {
        const rank = parseInt(tile[1]);

        if (piece.includes('pawn') && (rank === 1 || rank === 8)) {
            // Perform pawn promotion
            const color = piece.split('_')[0];
            const promotionPiece = color + "_queen";
            chessboard.set(tile, promotionPiece);
            console.log(`Promoted pawn to ${promotionPiece} at: ${tile}`);
        }
    }
}

// Function to retrieve the last move from the move history
function getLastMove() {
    // Return the last move object if available, otherwise, return null
    return moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;
}

// Function to check if an enemy pawn is adjacent for en passant
function isEnemyPawnAdjacent(initialTile, targetTile, color) {
    const enemyPawnTile = String.fromCharCode(targetTile.charCodeAt(0)) + initialTile[1];

    // Check if the tile adjacent to the target tile contains an enemy pawn
    const enemyPawn = chessboard.get(enemyPawnTile);

    // Check if the enemy pawn has just moved two squares forward in the previous turn
    const lastMove = getLastMove();
    return (
        enemyPawn !== 'empty' &&
        !enemyPawn.includes(color) &&
        enemyPawn.includes('pawn') &&
        lastMove &&
        lastMove.piece.includes('pawn') &&
        Math.abs(lastMove.from[1] - lastMove.to[1]) === 2
        );
    }



    // Modify the isKnightMoveLegal function to check for friendly piece on target square
    function isKnightMoveLegal(initialTile, targetTile, turn) {
        const colDiff = Math.abs(targetTile.charCodeAt(0) - initialTile.charCodeAt(0));
        const rowDiff = Math.abs(targetTile[1] - initialTile[1]);

        const targetPiece = chessboard.get(targetTile);

        // Knights move in an L-shape: 2 squares in one direction and 1 square in the other
        return (colDiff === 1 && rowDiff === 2) || (colDiff === 2 && rowDiff === 1) &&
        (targetPiece === 'empty' || !targetPiece.includes(turn));
    }

    function isBishopMoveLegal(initialTile, targetTile, turn, calculatingMoves) {
        const colDiff = Math.abs(targetTile.charCodeAt(0) - initialTile.charCodeAt(0));
        const rowDiff = Math.abs(targetTile[1] - initialTile[1]);

        const targetPiece = chessboard.get(targetTile);

        // Check if the move is along a diagonal
        if (colDiff !== rowDiff) {
            return false;
        }

        // Check if there are any pieces obstructing the bishop's diagonal path
        const colDirection = (targetTile.charCodeAt(0) > initialTile.charCodeAt(0)) ? 1 : -1;
        const rowDirection = (targetTile[1] > initialTile[1]) ? 1 : -1;

        for (let i = 1; i < colDiff; i++) {
            const intermediateTile = String.fromCharCode(initialTile.charCodeAt(0) + i * colDirection) +
            (parseInt(initialTile[1]) + i * rowDirection);

            const pieceAtIntermediateTile = chessboard.get(intermediateTile);

            // Check if the tile contains an opponent's king
            if (pieceAtIntermediateTile.includes(opponent(turn) + '_king')) {
                continue; // Allow the bishop to pass through the opponent's king
            }

            if (pieceAtIntermediateTile !== 'empty') {
                return false; // Bishop's path is obstructed by a piece (except the opponent's king)
            }
        }

        // Bishops can only move to an empty square or capture an opponent's piece
        if (targetPiece !== 'empty' && targetPiece.includes(turn)) {
            return false;
        }

        if (!calculatingMoves) {
            // Update any flags related to bishop movements here if necessary
        }

        return true;
    }


    function isRookMoveLegal(initialTile, targetTile, turn, calculatingMoves) {
        const colDiff = Math.abs(targetTile.charCodeAt(0) - initialTile.charCodeAt(0));
        const rowDiff = Math.abs(targetTile[1] - initialTile[1]);

        const targetPiece = chessboard.get(targetTile);

        // Check if the move is along a column or a row
        if (colDiff !== 0 && rowDiff !== 0) {
            return false;
        }

        // Check if there are any pieces obstructing the rook's path
        const colDirection = (targetTile.charCodeAt(0) > initialTile.charCodeAt(0)) ? 1 : (targetTile.charCodeAt(0) < initialTile.charCodeAt(0)) ? -1 : 0;
        const rowDirection = (targetTile[1] > initialTile[1]) ? 1 : (targetTile[1] < initialTile[1]) ? -1 : 0;

        for (let i = 1; i < Math.max(colDiff, rowDiff); i++) {
            const intermediateTile = String.fromCharCode(initialTile.charCodeAt(0) + i * colDirection) +
            (parseInt(initialTile[1]) + i * rowDirection);

            const pieceAtIntermediateTile = chessboard.get(intermediateTile);

            // Check if the tile contains an opponent's king
            if (pieceAtIntermediateTile.includes(opponent(turn) + '_king')) {
                continue; // Allow the rook to pass through the opponent's king
            }

            if (pieceAtIntermediateTile !== 'empty') {
                return false; // Rook's path is obstructed by a piece (except the opponent's king)
            }
        }

        // Rooks can only move to an empty square or capture an opponent's piece
        if (targetPiece !== 'empty' && targetPiece.includes(turn)) {
            return false;
        }

        if (!calculatingMoves) {
            // Update the rookMoved flag if a rook has moved
            if (initialTile === 'a1' && !whiteRookMoved.queenside) {
                whiteRookMoved.queenside = true;
            }
            if (initialTile === 'h1' && !whiteRookMoved.kingside) {
                whiteRookMoved.kingside = true;
            }
            if (initialTile === 'a8') {
                blackRookMoved.queenside = true;
            }
            if (initialTile === 'h8') {
                blackRookMoved.kingside = true;
            }
        }

        return true;
    }

    // Helper function to get opponent's color
    function opponent(turn) {
        return (turn === 'white') ? 'black' : 'white';
    }




    function isQueenMoveLegal(initialTile, targetTile, turn, calculatingMoves) {
        const colDiff = Math.abs(targetTile.charCodeAt(0) - initialTile.charCodeAt(0));
        const rowDiff = Math.abs(targetTile[1] - initialTile[1]);

        const targetPiece = chessboard.get(targetTile);

        // Check if the move is along a diagonal, column, or row
        if (colDiff !== rowDiff && colDiff !== 0 && rowDiff !== 0) {
            return false;
        }

        // Check if there are any pieces obstructing the queen's path
        const colDirection = (targetTile.charCodeAt(0) > initialTile.charCodeAt(0)) ? 1 : (targetTile.charCodeAt(0) < initialTile.charCodeAt(0)) ? -1 : 0;
        const rowDirection = (targetTile[1] > initialTile[1]) ? 1 : (targetTile[1] < initialTile[1]) ? -1 : 0;

        for (let i = 1; i < Math.max(colDiff, rowDiff); i++) {
            const intermediateTile = String.fromCharCode(initialTile.charCodeAt(0) + i * colDirection) +
            (parseInt(initialTile[1]) + i * rowDirection);

            const pieceAtIntermediateTile = chessboard.get(intermediateTile);

            // Check if the tile contains an opponent's king
            if (pieceAtIntermediateTile.includes(opponent(turn) + '_king')) {
                continue; // Allow the queen to pass through the opponent's king
            }

            if (pieceAtIntermediateTile !== 'empty') {
                return false; // Queen's path is obstructed by a piece (except the opponent's king)
            }
        }

        // Queen can only move to an empty square or capture an opponent's piece
        if (targetPiece !== 'empty' && targetPiece.includes(turn)) {
            return false;
        }

        if (!calculatingMoves) {
            // Update the rookMoved flag if a rook has moved (This part is specific to rooks, not needed for queens)
            // You can remove this part if not needed
            if (initialTile === 'a1' && !whiteRookMoved.queenside) {
                whiteRookMoved.queenside = true;
            }
            if (initialTile === 'h1' && !whiteRookMoved.kingside) {
                whiteRookMoved.kingside = true;
            }
            if (initialTile === 'a8') {
                blackRookMoved.queenside = true;
            }
            if (initialTile === 'h8') {
                blackRookMoved.kingside = true;
            }
        }

        return true;
    }


    // Function to find the opponent's king tile
    function findOpponentKingTile(color) {
        const opponentColor = (color === 'white') ? 'black' : 'white';
        const chessboardEntries = chessboard.entries();
        for (const [tile, piece] of chessboardEntries) {
            if (piece.includes('king') && piece.includes(opponentColor)) {
                return tile;
            }
        }
        return null; // Return null if the opponent's king is not found
    }

    // Function to calculate the tiles controlled by a given tile
    function calculateControlledTiles(color) {
        let tile = findOpponentKingTile(color);

        const file = tile.charCodeAt(0) - 97; // Convert file to index (0-7)
        const rank = parseInt(tile[1]); // Get the rank (1-8)

        const surroundingTiles = [];

        // Iterate over neighboring squares
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                // Skip the central square
                if (dx === 0 && dy === 0) {
                    continue;
                }

                // Calculate the coordinates of the neighboring square
                const targetFile = file + dx;
                const targetRank = rank + dy;

                // Check if the neighboring square is within the board boundaries
                if (targetFile >= 0 && targetFile <= 7 && targetRank >= 1 && targetRank <= 8) {
                    // Convert coordinates back to tile notation and add to the array
                    surroundingTiles.push(String.fromCharCode(97 + targetFile) + targetRank);
                }
            }
        }

        return surroundingTiles;
    }


    // Function to check if a king move is legal
    function isKingMoveLegal(initialTile, targetTile, color) {

        // Check if the target tile is in the array of legal moves for the opposite color
        const oppositeLegalMoves = (color === 'white') ? blackLegalMoves : whiteLegalMoves;
        for (const obj of oppositeLegalMoves) {
            if (obj.legalMoves && obj.legalMoves.includes(targetTile)) {
                return false;
            }
        }

        // Check if the target tile is threatened by the opponent's king
        const kingThreatenedTiles = calculateControlledTiles(color);
        if (kingThreatenedTiles.includes(targetTile)) {
            return false;
        }

        if (isCastlingMove(initialTile, targetTile, color)) {
            return true;
        }

        // Calculate the row and column differences
        const rowDiff = Math.abs(targetTile[1] - initialTile[1]);
        const colDiff = Math.abs(targetTile.charCodeAt(0) - initialTile.charCodeAt(0));

        // Check if the move is within the king's range (1 square in any direction)
        if ((rowDiff <= 1 && colDiff <= 1) && (rowDiff !== 0 || colDiff !== 0)) {
            const targetPiece = chessboard.get(targetTile);

            // Check if the target tile is empty or contains an enemy piece
            if (targetPiece === 'empty' || !targetPiece.includes(color)) {
                if (isCastlingMove(initialTile, targetTile, color)) {
                    if (color === 'black') {
                        blackCanCastle = false;
                    }
                    if (color === 'white') {
                        whiteCanCastle = false;
                    }
                    return true;
                }

                return true; // Legal move
            }

            return false; // Invalid move
        }
    }

    function moveGetsKingOutOfCheck(initialTile, targetTile, piece, turn) {
        // Simulate the move in the engine's head
        const hypotheticalChessboard = deepCopyMap(chessboard);
        hypotheticalChessboard.set(initialTile, 'empty');
        hypotheticalChessboard.set(targetTile, piece);

        // Check if the king is in check after the hypothetical move
        const check = isKingInCheck(turn, hypotheticalChessboard);
        console.log("IS THE KING STILL IN Check", check)
        // If the king is still in check after the move, return false
        return !check;
    }

    function isCastlingMove(initialTile, targetTile, color) {
        if (color === 'black' && blackCanCastle === false) {
            return false;
        }
        if (color === 'white' && whiteCanCastle === false) {
            return false;
        }

        const isKingOnStartingPosition = (color === 'white' && initialTile === 'e1') || (color === 'black' && initialTile === 'e8');
        if (isKingOnStartingPosition === false) {
            return false;
        }

        // Check if the target tile is a valid square for castling
        const isTargetValid = (color === 'white' && (targetTile === 'c1' || targetTile === 'g1')) ||
        (color === 'black' && (targetTile === 'c8' || targetTile === 'g8'));
        if (!isTargetValid) {
            return false;
        }

        // Check if there are no pieces between the king and the target tile
        const colStart = Math.min(initialTile.charCodeAt(0), targetTile.charCodeAt(0));
        const colEnd = Math.max(initialTile.charCodeAt(0), targetTile.charCodeAt(0));

        for (let col = colStart + 1; col < colEnd; col++) {
            const tile = String.fromCharCode(col) + initialTile[1];
            if (chessboard.get(tile) !== 'empty') {
                return false; // There's a piece in between, castling not allowed
            }
        }

        // Check if there is a rook on the corresponding side
        const rookInitialTile = (targetTile === 'g1' || targetTile === 'g8') ? `h${initialTile[1]}` : `a${initialTile[1]}`;
        const rookPiece = chessboard.get(rookInitialTile);

        // Verify that the piece at the rook's initial position is a rook of the same color
        if (!rookPiece || !rookPiece.includes(color + '_rook')) {
            return false;
        }

        // Check if the corresponding rook has moved
        if (color === 'white') {
            if ((targetTile === 'g1' && whiteKingMoved.kingside) || (targetTile === 'c1' && whiteKingMoved.queenside)) {
                return false; // Corresponding king has moved, castling not allowed
            }
        } else if (color === 'black') {
            if ((targetTile === 'g8' && blackKingMoved.kingside) || (targetTile === 'c8' && blackKingMoved.queenside)) {
                return false; // Corresponding king has moved, castling not allowed
            }
        }

        return true;
    }


    function handleRookForCastling(initialTile, targetTile) {
        // Determine the initial and target positions of the rook based on castling direction
        const rookInitialTile = (targetTile === 'g1' || targetTile === 'g8') ? `h${initialTile[1]}` : `a${initialTile[1]}`;
        const rookTargetTile = (targetTile === 'g1' || targetTile === 'g8') ? `f${initialTile[1]}` : `d${initialTile[1]}`;

        // Move the rook
        const piece = chessboard.get(rookInitialTile)
        chessboard.set(rookInitialTile, 'empty');
        chessboard.set(rookTargetTile, piece);
    }

    function makeMove(initialTile, targetTile) {
        const piece = chessboard.get(initialTile)
        chessboard.set(initialTile, 'empty');
        chessboard.set(targetTile, piece);
        console.log('computer moved ', piece, ' to ', targetTile)
    }
    // Function to create a deep copy of a Map
    function deepCopyMap(originalMap) {
        const newMap = new Map();

        for (const [key, value] of originalMap.entries()) {
            // Assuming the pieces are simple values (strings), otherwise, you might need a deeper cloning mechanism
            newMap.set(key, value);
        }

        return newMap;
    }


    function handleMove(initialTile, targetTile, piece, turn) {
        console.log(`Dropped piece at: ${targetTile}`);

        // Simulate the move in the engine's head
        const hypotheticalChessboard = deepCopyMap(chessboard);
        hypotheticalChessboard.set(initialTile, 'empty');
        hypotheticalChessboard.set(targetTile, piece);
        console.log("HYPOTHETICALLY SPEAKING HYPOTHETICALLY SPEAKING", hypotheticalChessboard)
        // Check if the king is in check after the hypothetical move
        const check = isKingInCheck(turn, hypotheticalChessboard);


        // Check if the move is legal for the pawn
        if (piece.includes('pawn') && !isPawnMoveLegal(initialTile, targetTile, turn)) {
            console.log(`Illegal move for the pawn. ${turn}'s turn remains.`);
            return turn; // Return the unchanged turn
        }

        // Check if the move is legal for the knight
        if (piece.includes('knight') && !isKnightMoveLegal(initialTile, targetTile, turn)) {
            console.log(`Illegal move for the knight. ${turn}'s turn remains.`);
            return turn; // Return the unchanged turn
        }

        // Check if the move is legal for the bishop
        if (piece.includes('bishop') && !isBishopMoveLegal(initialTile, targetTile, turn)) {
            console.log(`Illegal move for the bishop. ${turn}'s turn remains.`);
            return turn; // Return the unchanged turn
        }

        // Check if the move is legal for the rook
        if (piece.includes('rook') && !isRookMoveLegal(initialTile, targetTile, turn)) {
            console.log(`Illegal move for the rook. ${turn}'s turn remains.`);
            return turn; // Return the unchanged turn
        }

        // Check if the move is legal for the queen
        if (piece.includes('queen') && !isQueenMoveLegal(initialTile, targetTile, turn)) {
            console.log(`Illegal move for the queen. ${turn}'s turn remains.`);
            return turn; // Return the unchanged turn
        }

        // Check if the move is legal for the king
        if (piece.includes('king') && !isKingMoveLegal(initialTile, targetTile, turn)) {
            console.log(`Illegal move for the king. ${turn}'s turn remains.`);
            return turn; // Return the unchanged turn
        }

        if (check) {
            console.log(`${turn}'s king is in check. Illegal move.`);
            return turn;
        }
        // At this point, the move is legal for the specific piece being moved,
        // but we need to check if the move gets the king out of check
        const theMoveGetsKingOutOfCheck = moveGetsKingOutOfCheck(initialTile, targetTile, piece, turn);
        if (theMoveGetsKingOutOfCheck) {
            // Handle the move
            if (targetTile !== initialTile) {
                // Handle castling for the king
                if (piece.includes('king') && isCastlingMove(initialTile, targetTile, turn)) {
                    makeMove(initialTile, targetTile); // Move the king
                    handleRookForCastling(initialTile, targetTile); // Move the rook
                } else {
                    // Handle regular moves
                    chessboard.set(initialTile, 'empty');
                    chessboard.set(targetTile, piece);
                }

                // Add the move to the move history
                const move = {
                    from: initialTile,
                    to: targetTile,
                    piece: piece,
                };
                moveHistory.push(move);
                console.log("MOVE HISTORY:", moveHistory);

                // Switch turns
                turn = (turn === 'white') ? 'black' : 'white';

                // Log the change of turn
                console.log(`${turn.charAt(0).toUpperCase() + turn.slice(1)}'s turn`);
            } else {
                console.log(`Piece returned to the same square. ${turn}'s turn remains.`);
            }

            // Call the function to update colored tiles after black's turn
            if (turn === 'white') {
                updateTilesToColour();
            }

            drawBoard();
            drawPieces();
            calculateBlackLegalMoves(blackLegalMoves, chessboard);
            calculateWhiteLegalMoves(whiteLegalMoves, chessboard);
            updateTilesToColour();

            return turn; // Return the updated turn
        } else {
            console.log(`Illegal move. ${turn}'s turn remains.`);
            return turn; // Return the unchanged turn
        }
    }


    function calculateBlackLegalMoves(array, chessboard) {
        array.length = 0;
        for (const [tile, piece] of chessboard.entries()) {
            if (piece.includes('black')) {
                const legalMoves = calculatePieceLegalMoves(tile, piece, 'black', chessboard);
                if (legalMoves.length > 0) {
                    array.push({ piece, tile, legalMoves });
                }
            }
        }

        console.log('Black Legal Moves:', array); // Push to the array passed as a parameter
        return array;
    }

    function calculateWhiteLegalMoves(array, chessboard) {
        array.length = 0;
        for (const [tile, piece] of chessboard.entries()) {
            if (piece.includes('white')) {
                const legalMoves = calculatePieceLegalMoves(tile, piece, 'white', chessboard);
                if (legalMoves.length > 0) {
                    array.push({ piece, tile, legalMoves });
                }
            }
        }

        console.log('White Legal Moves:', array); // Push to the array passed as a parameter
        return array;
    }


    function calculatePieceLegalMoves(initialTile, piece, turn, chessboard) {
        const legalMoves = [];

        if (piece.includes('knight')) {
            for (const targetTile of chessboard.keys()) {
                if (isKnightMoveLegal(initialTile, targetTile, turn)) {
                    legalMoves.push(targetTile);
                }
            }
        }

        if (piece.includes('bishop')) {
            for (const targetTile of chessboard.keys()) {
                if (isBishopMoveLegal(initialTile, targetTile, turn)) {
                    legalMoves.push(targetTile);
                }
            }
        }

        if (piece.includes('rook')) {
            for (const targetTile of chessboard.keys()) {
                if (isRookMoveLegal(initialTile, targetTile, turn, true)) {
                    legalMoves.push(targetTile);
                }
            }
        }

        if (piece.includes('queen')) {
            for (const targetTile of chessboard.keys()) {
                if (isQueenMoveLegal(initialTile, targetTile, turn)) {
                    legalMoves.push(targetTile);
                }
            }
        }

        if (piece.includes('king')) {
            for (const targetTile of chessboard.keys()) {
                if (isKingMoveLegal(initialTile, targetTile, turn)) {
                    legalMoves.push(targetTile);
                }
            }
        }

        if (piece.includes('pawn')) {
            const forwardDirection = (turn === 'white') ? 1 : -1;
            const forwardTile = String.fromCharCode(initialTile.charCodeAt(0)) + (parseInt(initialTile[1]) + forwardDirection);
            const doubleForwardTile = String.fromCharCode(initialTile.charCodeAt(0)) + (parseInt(initialTile[1]) + 2 * forwardDirection);

            if (chessboard.get(forwardTile) === 'empty') {
                legalMoves.push(forwardTile);

                if (
                    (turn === 'white' && initialTile[1] === '2') ||
                    (turn === 'black' && initialTile[1] === '7')
                    ) {
                        // Add double move for pawns starting from their initial positions
                        if (chessboard.get(doubleForwardTile) === 'empty') {
                            legalMoves.push(doubleForwardTile);
                        }
                    }
                }

                // Add diagonal capture moves for pawns
                const leftDiagonalTile = String.fromCharCode(initialTile.charCodeAt(0) - 1) + (parseInt(initialTile[1]) + forwardDirection);
                const rightDiagonalTile = String.fromCharCode(initialTile.charCodeAt(0) + 1) + (parseInt(initialTile[1]) + forwardDirection);

                // Check if the left diagonal tile is within the chessboard boundaries
                if (leftDiagonalTile[0].charCodeAt(0) >= 'a'.charCodeAt(0) && leftDiagonalTile[0].charCodeAt(0) <= 'h'.charCodeAt(0)) {
                    const leftDiagonalPiece = chessboard.get(leftDiagonalTile);

                    if (leftDiagonalPiece !== 'empty' && !leftDiagonalPiece.includes(turn)) {
                        legalMoves.push(leftDiagonalTile);
                    }
                }

                // Check if the right diagonal tile is within the chessboard boundaries
                if (rightDiagonalTile[0].charCodeAt(0) >= 'a'.charCodeAt(0) && rightDiagonalTile[0].charCodeAt(0) <= 'h'.charCodeAt(0)) {
                    const rightDiagonalPiece = chessboard.get(rightDiagonalTile);

                    if (rightDiagonalPiece !== 'empty' && !rightDiagonalPiece.includes(turn)) {
                        legalMoves.push(rightDiagonalTile);
                    }
                }

            }

            return legalMoves;
        }






        function isKingInCheck(color, chessboard) {
            const kingTile = findKingTile(color, chessboard);
            let hypotheticalWhiteLegalMoves = [];
            calculateWhiteLegalMoves(hypotheticalWhiteLegalMoves, chessboard);
            let hypotheticalBlackLegalMoves = [];
            calculateBlackLegalMoves(hypotheticalBlackLegalMoves, chessboard);

            // Check if any opponent's piece has a legal move to the king's tile
            const oppositeLegalMoves = (color === 'white') ? hypotheticalBlackLegalMoves : hypotheticalWhiteLegalMoves;

            for (const pieceMoves of oppositeLegalMoves) {
                for (const move of pieceMoves.legalMoves) {
                    if (move === kingTile) {
                        console.log("TRUEEEEEEE")
                        return true; // King is in check
                    }
                }
            }
            console.log("FALSEEEEE")
            return false; // King is not in check
        }



        function findKingTile(color, chessboard) {
            const kingPiece = `${color}_king`;

            for (const [tile, piece] of chessboard.entries()) {
                if (piece === kingPiece) {
                    return tile;
                }
            }

            return null; // King not found (this should not happen in a valid chess position)
        }