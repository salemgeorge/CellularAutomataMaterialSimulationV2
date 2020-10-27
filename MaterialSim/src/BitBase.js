class BitBase {
    x;
    y;
    modifiers;
    direction;

    constructor(x, y, modifiers) {
        this.x = x;
        this.y = y;
        this.modifiers = modifiers;

        Object.defineProperties(this.modifiers, {
            UPDATE_PROGRESS_TO_MOVE: {
                value: 100,
                writable: false
            },
            CURRENT_UPDATE_PROGRESS: {
                value: 0,
                writable: true
            },
            IS_FALLING: {
                value: true,
                writable: true
            }
        })

        this.direction = {
            LEFT: 'left',
            RIGHT: 'right',
            UP: 'up',
            DOWN: 'down'
        }
    }

    MoveSelf(direction) {
        let x = this.x;
        let y = this.y;

        switch(direction) {
            case this.direction.LEFT:
                grid[x - 1][y] = grid[x][y]
                x--
                break;
            case this.direction.RIGHT:
                grid[x + 1][y] = grid[x][y]
                x++
                break;
            case this.direction.UP:
                grid[x][y - 1] = grid[x][y]
                y--
                break;
            case this.direction.DOWN:
                grid[x][y + 1] = grid[x][y]
                y++
                break;
        }

        this.x = x;
        this.y = y;

        return {x, y, didMove: true}
    }

    DrawSelf(ctx) {
        ctx.fillStyle = this.modifiers.COLOR;
        ctx.fillRect(this.x * 5, this.y * 5, 5, 5)
    }

    ApplyGravity() {
        let mods = this.modifiers

        if(mods.CURRENT_UPDATE_PROGRESS >= mods.UPDATE_PROGRESS_TO_MOVE) {

            let canMove = this.y < 99
            if(canMove) {
                mods.CURRENT_UPDATE_PROGRESS = 0

                this.MoveSelf(this.direction.DOWN)

                this.modifiers = mods

                let x = this.x;
                let y = this.y
                let didMove = true;
                return {x, y, didMove}
            }
            let x = this.x;
            let y = this.y
            let didMove = false;

            return {x, y, didMove}
        } 
        mods.CURRENT_UPDATE_PROGRESS += mods.WEIGHT

        this.modifiers = mods

        let x = this.x;
        let y = this.y
        let didMove = false;
        return {x, y, didMove}
    }

    GetBit(x, y) {
        return grid[x][y]
    }

    HandleSlopePhysics(xSlope) {
        let mods = this.modifiers
        let x = this.x
        let y = this.y
        let bitBelow = this.GetBit(x, y + 1)
        let dirMoved = {x, y, didMove: false}

        if(y + 1 <= 99 && bitBelow) {
            let bitFarRight = this.GetBit(x + xSlope, y + 1)
            let bitFarLeft = this.GetBit(x - xSlope, y + 1)

            if(bitFarLeft == null && bitFarRight) {
                if(!this.GetBit(x - 1, y)) {
                    this.MoveSelf(this.direction.LEFT)
                    dirMoved.x--;
                    dirMoved.didMove = true
                }
            } else if(bitFarLeft && bitFarRight == null) {
                if(!this.GetBit(x + 1, y)) {
                    this.MoveSelf(this.direction.RIGHT)
                    dirMoved.x++;
                    dirMoved.didMove = true
                }
            } else if(bitFarLeft == null && bitFarRight == null) {
                let randDir = Math.random()

                if(randDir < 0.5) {
                    if(!this.GetBit(x - 1, y)) {
                        this.MoveSelf(this.direction.LEFT)
                        dirMoved.x--;
                        dirMoved.didMove = true
                    }
                } else {
                    if(!this.GetBit(x + 1, y)) {
                        this.MoveSelf(this.direction.RIGHT)
                        dirMoved.x++;
                        dirMoved.didMove = true
                    }
                }
            }
            return dirMoved;
        }
        return dirMoved;
    }
}