let eventIdx = -1;
let events = [
    () => {
        if(playerY >= 140) {
            playerY -= speed / 2;
            return false;
        } else {
            return true;
        }
    },
    () => {
        if(playerX >= 120) {
            playerX -= speed / 2;
            return false;
        } else {
            return true;
        }
    },
    () => {
        if(playerY <= 250) {
            playerY += speed / 2;
            return false;
        } else {
            return true;
        }
    },
    () => {
        if(playerX <= 330) {
            playerX += speed / 2;
            return false;
        } else {
            return true;
        }
    },
    () => {
        if(playerY <= 500) {
            playerY += speed / 2;
            return false;
        } else {
            return true;
        }
    }
];

function scriptedEvent() {
    setInterval(() => {
        update();

        events[eventIdx]();
    }, 1000 / 60);
}

window.addEventListener("keypress", async event => {
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
    case "p":
        scriptedEvent();
        break;
    }
});

window.addEventListener("mousedown", (event) => {
    eventIdx++;
})