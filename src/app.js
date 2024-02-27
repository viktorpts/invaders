window.onload = start;

const PLAYER_SPEED = 5;
const ALIEN_SPEED = 1;
const LASER_SPEED = 15;

const shipSprite = {
    x: 465,
    y: 289,
    w: 62,
    h: 44
};
const alienSprite = {
    x: 118,
    y: 27,
    sw: 95,
    sh: 69,
    w: 60,
    h: 40
};

function start() {
    const ship = { x: 50, y: 580 };
    const laser = { x: 0, y: 0, alive: false };
    /** @type {Array<{x: number, y: number, alive: boolean}>} */
    const invaders = [];
    /** @type {Object.<string, boolean>} */
    const controls = {};
    let alienDir = 1;

    const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
    const ctx = canvas.getContext('2d');
    const spritesheet = /** @type {HTMLImageElement} */ (document.getElementById('spritesheet'));

    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'blue';

    document.addEventListener('keydown', (event) => {
        controls[event.code] = true;
        event.preventDefault();
    });
    document.addEventListener('keyup', (event) => {
        controls[event.code] = false;
        event.preventDefault();
    });

    for (let col = 0; col < 10; col++) {
        for (let row = 0; row < 5; row++) {
            invaders.push({ x: 60 + col * 75, y: 100 + row * 60, alive: true });
        }
    }

    setInterval(render, 16);

    function render() {
        if (controls['ArrowLeft']) {
            ship.x -= PLAYER_SPEED;
            if (ship.x < shipSprite.w / 2) {
                ship.x = shipSprite.w / 2;
            }
        } else if (controls['ArrowRight']) {
            ship.x += PLAYER_SPEED;
            if (ship.x > 800 - shipSprite.w / 2) {
                ship.x = 800 - shipSprite.w / 2;
            }
        } else if (controls['Space'] && !laser.alive) {
            laser.x = ship.x;
            laser.y = ship.y - shipSprite.h;
            laser.alive = true;
        }

        clear();
        drawShip(ship.x, ship.y);

        const alienRight = Math.max(...invaders.filter(i => i.alive).map(i => i.x));
        const alienLeft = Math.min(...invaders.filter(i => i.alive).map(i => i.x));

        if (laser.alive) {
            laser.y -= LASER_SPEED;

            if (laser.y < 0) {
                laser.alive = false;
            }

            drawLaser(laser.x, laser.y);
        }

        if (alienDir > 0 && alienRight >= 800 - alienSprite.w / 2) {
            alienDir = -1;
        } else if (alienDir < 0 && alienLeft <= alienSprite.w / 2) {
            alienDir = 1;
        }

        for (let invader of invaders) {
            if (!invader.alive) {
                continue;
            }

            if (laser.alive) {
                const laserLeft = laser.x - 4;
                const laserRight = laserLeft + 8;
                const laserTop = laser.y;
                const laserBottom = laserTop + 20;

                const alienLeft = invader.x - alienSprite.w / 2;
                const alienRight = alienLeft + alienSprite.w;
                const alienBottom = invader.y;
                const alienTop = alienBottom - alienSprite.h;

                // ctx.strokeRect(laserLeft, laserTop, laserRight - laserLeft, laserBottom - laserTop);
                // ctx.strokeRect(alienLeft, alienTop, alienRight - alienLeft, alienBottom - alienTop);

                if (laserRight > alienLeft && laserLeft < alienRight) {
                    if (laserTop < alienBottom && laserBottom > alienTop) {
                        invader.alive = false;
                        laser.alive = false;
                    }
                }
            }

            invader.x += ALIEN_SPEED * alienDir;
            drawAlien(invader.x, invader.y);
        }
    }

    function clear() {
        ctx.clearRect(0, 0, 800, 600);
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    function drawShip(x, y) {
        ctx.drawImage(spritesheet, shipSprite.x, shipSprite.y, shipSprite.w, shipSprite.h, x - shipSprite.w / 2, y - shipSprite.h, shipSprite.w, shipSprite.h);
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    function drawAlien(x, y) {
        ctx.drawImage(spritesheet, alienSprite.x, alienSprite.y, alienSprite.sw, alienSprite.sh, x - alienSprite.w / 2, y - alienSprite.h, alienSprite.w, alienSprite.h);
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    function drawLaser(x, y) {
        ctx.fillRect(x - 4, y, 8, 20);
    }
}
