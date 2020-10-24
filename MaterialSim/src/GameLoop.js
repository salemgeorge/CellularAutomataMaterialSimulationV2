const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const toggleMouseDragSpawnButton = document.getElementById("toggleBitDragSpawn")

let grid = []
let bitManager

let mouseX, mouseY

let shouldMouseDragSpawn = true;

function init() {
    for(let x = 0; x < 100; x++) {
        grid[x] = [];
        for(let y = 0; y < 100; y++) {
            grid[x][y] = null;
        }
    }
    bitManager = new BitManager(grid, ctx)
    gameLoop()

    // let modifiers = {
    //     HAS_GRAVITY: true,
    //     WEIGHT: 50,
    //     COLOR: '#FFC300',
    //     IS_SAND: true
    // }
    // let testBit = new BitBase(0, 0, modifiers)
    // bitManager.SpawnBit(1, 1, testBit)
}

function gameLoop() {
    bitManager.UpdateBits()

    window.requestAnimationFrame(gameLoop)
}

window.addEventListener('mousemove', event => {
    actualX = event.x - canvas.offsetLeft;
    actualY = event.y - canvas.offsetTop;

    mouseX = Math.floor(actualX / 5)
    mouseY = Math.floor(actualY / 5)

    if(shouldMouseDragSpawn) {
        let modifiers = {
            HAS_GRAVITY: true,
            WEIGHT: 75,
            COLOR: '#FFC300',
            IS_SAND: true
        }
        let testBit = new BitBase(0, 0, modifiers)
        bitManager.SpawnBit(mouseX, mouseY, testBit)
    }
})

toggleMouseDragSpawnButton.addEventListener('click', event => {
    shouldMouseDragSpawn = !shouldMouseDragSpawn
})

init()