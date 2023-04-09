const canvas = document.getElementById("cnv");
/**
 * @type CanvasRenderingContext2D
 */
const ctx = canvas.getContext("2d");
const background = getComputedStyle(canvas).getPropertyValue("background-color");

const playerWidth = 30;
const speed = 10;

let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height / 2 - playerWidth / 2;

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawPlayer() {
    drawRect(playerX, playerY, playerWidth, playerWidth, "yellow");
}

function clearCanvas() {
    drawRect(0, 0, canvas.width, canvas.height, background);
}

function start() {

}

function update() {
    clearCanvas();
    drawPlayer();
}

//To be removed
window.addEventListener("keypress", event => {
    switch(event.key) {
    case "w":
        playerY -= speed;
        break;
    case "a":
        playerX -= speed;
        break;
    case "s":
        playerY += speed;
        break;
    case "d":
        playerX += speed;
        break;
    }
})