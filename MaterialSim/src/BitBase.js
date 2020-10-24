class BitBase {
    x;
    y;
    modifiers;
    direction;

    xVel = 0;
    yVel = 0;

    constructor(x, y, modifiers) {
        this.x = x;
        this.y = y;
        this.modifiers = modifiers;

        Object.defineProperties(this.modifiers, {
            UPDATE_PROGRESS_TO_MOVE: {
                value: 100,
                writable: true
            },
            CURRENT_UPDATE_PROGRESS: {
                value: 0,
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

        return {x, y, didMove: false}
    }

    DrawSelf(ctx) {
        ctx.fillStyle = this.modifiers.COLOR;
        ctx.fillRect(this.x * 5, this.y * 5, 5, 5)
    }

    ApplyGravity() {
        let mods = this.modifiers

        if(mods.CURRENT_UPDATE_PROGRESS >= mods.UPDATE_PROGRESS_TO_MOVE) {

            let canMove = this.y < 99
            if(canMove && this.yVel == 0) {
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

    ApplyVelocity() {
        let mods = this.modifiers
        let x = this.x
        let y = this.y
        let dirMoved = {x, y, didMove: false}

        if(this.xVel > 0) {
            //mods.CURRENT_UPDATE_PROGRESS >= mods.UPDATE_PROGRESS_TO_MOVE
            if(true) {
                mods.CURRENT_UPDATE_PROGRESS = 0;

                this.modifiers = mods

                if(x < 99 && !this.GetBit(x + 1, y)) {
                    this.MoveSelf(this.direction.RIGHT)
                    this.xVel--;
                    dirMoved.x++;

                    console.log('applied vel')
                }
            }
        } else if(this.xVel < 0) {
            if(mods.CURRENT_UPDATE_PROGRESS >= mods.UPDATE_PROGRESS_TO_MOVE) {
                mods.CURRENT_UPDATE_PROGRESS = 0;

                this.modifiers = mods

                if(x > 0 && this.GetBit(x - 1, y) == null) {
                    this.MoveSelf(this.direction.LEFT)
                    this.xVel++;
                    dirMoved.x--;
                }
            }
        }

        if(this.yVel < 0) {
            if(mods.CURRENT_UPDATE_PROGRESS >= mods.UPDATE_PROGRESS_TO_MOVE) {
                mods.CURRENT_UPDATE_PROGRESS = 0;

                this.modifiers = mods

                if(y > 0 && this.GetBit(x, y - 1) == null) {
                    this.MoveSelf(this.direction.UP)
                    this.yVel++;
                    dirMoved.y--;
                }
            }
        } else if(this.yVel > 0) {
            if(mods.CURRENT_UPDATE_PROGRESS >= mods.UPDATE_PROGRESS_TO_MOVE) {
                mods.CURRENT_UPDATE_PROGRESS = 0;

                this.modifiers = mods

                if(y < 99 && this.GetBit(x, y + 1) == null) {
                    this.MoveSelf(this.direction.DOWN)
                    this.yVel--;
                    dirMoved.y++;
                }
            }
        }

        return dirMoved;
    }

    AddVelocity(xAmount, yAmount) {
        this.xVel += xAmount;
        this.yVel += yAmount;
    }

    GetBit(x, y) {
        return grid[x][y]
    }

    HandleSandPhysics() {
        let mods = this.modifiers
        let x = this.x
        let y = this.y
        let dirMoved = {x, y, didMove: false}
        let bitBelow = this.GetBit(x, y + 1)

        if(y < 99 && bitBelow) {
            let bitRight = this.GetBit(x + 3, y + 1)
            if(!bitRight) {
                this.AddVelocity(3, 0)
            }
        }
    }
}