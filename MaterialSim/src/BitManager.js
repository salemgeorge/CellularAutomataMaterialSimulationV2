class BitManager {
    grid;
    ctx;
    constructor(grid, ctx) {
        this.grid = grid
        this.ctx = ctx
    }

    UpdateBits() {
        this.ctx.clearRect(0, 0, 500, 500)
        for(let x = 99; x > 0; x--) {
            for(let y = 99; y > 0; y--) {
                if(!grid[x][y]) continue;
                
                let bitToUpdate = grid[x][y]
                let bitPos = {x, y, didMove: null}
                let bitBelow = this.GetBit(x, y + 1) 

                bitPos = grid[bitPos.x][bitPos.y].ApplyVelocity()

                if(bitToUpdate.modifiers.HAS_GRAVITY) {
                    if(!bitBelow && grid[bitPos.x][bitPos.y]) {
                        bitPos = grid[bitPos.x][bitPos.y].ApplyGravity()
                        grid[bitPos.x][bitPos.y].modifiers.IS_FALLING = true
                        if(bitPos.didMove) grid[x][y] = null
                    } else {
                        if(grid[bitPos.x][bitPos.y])
                            grid[bitPos.x][bitPos.y].modifiers.IS_FALLING = false
                    }
                }
                if(bitToUpdate.modifiers.IS_SAND) {
                    if(grid[bitPos.x][bitPos.y])
                        grid[bitPos.x][bitPos.y].HandleSandPhysics()
                }

                if(grid[bitPos.x][bitPos.y]) {
                    grid[bitPos.x][bitPos.y].DrawSelf(ctx)
                }
            }
        }
    }

    SpawnBit(x, y, bitToSpawn) {
        if(!grid[x][y]) {
            bitToSpawn.x = x;
            bitToSpawn.y = y;
            grid[x][y] = bitToSpawn;
        }
    }

    GetBit(x, y) {
        return grid[x][y]
    }
}