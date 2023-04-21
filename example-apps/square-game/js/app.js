var port = null;

const canvas = document.getElementById("cnv");
/**
 * @type CanvasRenderingContext2D
 */
const ctx = canvas.getContext("2d");
const background = getComputedStyle(canvas).getPropertyValue("background-color");

const playerWidth = 30;
const speed = 10;

const map = [
    [100, 100, 600, 100],
    [100, 100, 100, 200],
    [200, 200, 700, 200],
    [450, 200, 450, 500],
    [450, 500, 800, 500],
    [600, 350, 900, 350],
    [900, 350, 900, 50],
    [100, 300, 300, 300],
    [200, 300, 200, 500],
    [980, 150, 1200, 150],
    [1200, 150, 1200, 450]
]

var playerX = canvas.width / 2 - playerWidth / 2;
var playerY = canvas.height / 2 - playerWidth / 2;

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

function drawMap() {
    for(let wall of map) {
        ctx.beginPath();
        ctx.moveTo(wall[0], wall[1]);
        ctx.lineTo(wall[2], wall[3]);

        ctx.strokeStyle = 'yellow';
        ctx.stroke();
    }
}

function updatePosition(portReadings) {
    //8 Hz -> Left
    if(portReadings[1] > 2.5) {
        playerX--;
    }

    //6 Hz -> Right
    if(portReadings[0] > 2.5) {
        playerX++;
    }

    //10 Hz -> Up
    if(portReadings[2] > 2.5) {
        playerY--;
    }

    //12 Hz -> Down
    if(portReadings[3] > 2.5) {
        playerY++;
    }

    update();
}

/**
 * 
 * @param {SerialPort} givenPort 
 * @param {(arr: [Number]) => {}} callback 
 */
async function readFromPort(givenPort, callback) {
    const textDecoder = new TextDecoder();

    const reader = givenPort.readable.getReader();
    let res = "";

    while (true) {
        const { value, done } = await reader.read();

        if (done) {
            reader.releaseLock();
            break;
        }

        let str = textDecoder.decode(value);

        if(!str.includes("$")) {
            res += str;
        } else {
            res += str.split("$")[0];

            let values = res.split(" ").map(x => Number(x));
            callback(values);

            res = "";
        }
    }
}

function start() {
    drawMap();
    drawPlayer();
}

function update() {
    clearCanvas();

    drawMap();
    drawPlayer();
}

window.addEventListener("keydown", async event => {
    switch(event.key) {
    case "c":
        port = await navigator.serial.requestPort();

        await port.open({ baudRate: 9600 });
        await readFromPort(port, updatePosition);
        
        break;
    case "d":
        if(port) {
            await port.close();
        }
        break;
    }
});