/**
 * The Score Class
 */
class Score {

    /**
     * The Score constructor
     */
    constructor() {
        this.canvas = Board.boardCanvas;
        this.ctx    = this.canvas.context;

        this.score  = 0;
        this.level  = 1;
        this.lives  = 2;
        this.bonus  = 0;
        this.ghosts = 0;

        this.textTop     = 32.25;
        this.scoreLeft   = 3.2;
        this.livesLeft   = 16.3;
        this.scoreMargin = 0.5;
        this.scoreWidth  = 7;
        this.scoreHeight = 2;
        this.scoreColor  = "rgb(255, 255, 51)";
        this.fruitTile   = { x: 26, y: 31.5 };

        this.blobs = [ new ScoreBlob(0), new ScoreBlob(1) ];
        this.food  = new Fruit();
    }

    /**
     * Draws the Score, Blobs and Fruit in the board
     * @returns {Void}
     */
    draw() {
        this.drawTexts();
        this.drawScore();

        this.blobs.forEach(function (blob) {
            blob.draw();
        });
        this.food.draw(this.fruitTile);
    }



    /**
     * Increases the game score by the given amount
     * @param {Number} amount
     * @returns {Void}
     */
    incScore(amount) {
        this.score += amount;
        if (this.score > Data.extraLife * Math.pow(10, this.bonus)) {
            if (this.lives < 4) {
                this.incLife(true);
            }
            this.bonus += 1;
        }
        this.drawScore();
    }

    /**
     * Increases/Decreases the game lives depending on the param
     * @param {Boolean} isIncrease
     * @returns {Void}
     */
    incLife(isIncrease) {
        this.lives += isIncrease ? 1 : -1;

        if (isIncrease) {
            const blob = new ScoreBlob(this.lives - 1);
            this.blobs.push(blob);
            blob.draw();
        } else if (this.blobs.length) {
            const blob = this.blobs.pop();
            blob.clear();
        }
    }



    /**
     * Increases the game level
     * @returns {Void}
     */
    newLevel() {
        this.level += 1;
        this.ghosts = 0;
        Data.level  = this.level;
    }

    /**
     * The Blob ate a pill/energizer
     * @param {Number} value
     * @returns {Void}
     */
    pill(value) {
        this.incScore(value * Data.pillMult);
    }

    /**
     * The Blob ate a fruit
     * @returns {Number}
     */
    fruit() {
        const score = Data.getLevelData("fruitScore");
        this.incScore(score);
        return score;
    }

    /**
     * The Blob kill a Ghost
     * @param {Number} amount
     * @returns {Number}
     */
    kill(amount) {
        const score = Data.getGhostScore(amount);
        this.incScore(score);

        if (amount === 4) {
            this.ghosts += 1;
            if (this.ghosts === 4) {
                this.incScore(Data.eyesBonus);
            }
        }
        return score;
    }

    /**
     * The Blob died, decrease the lifes
     * @returns {Boolean} True on Game Over
     */
    died() {
        this.incLife(false);
        return this.lives >= 0;
    }



    /**
     * Draws the texts in the board
     * @returns {Void}
     */
    drawTexts() {
        this.canvas.drawText({
            text : "Score",
            size : 1.8,
            pos  : { x: this.scoreLeft, y: this.textTop },
        });
        this.canvas.drawText({
            text : "Lives",
            size : 1.8,
            pos  : { x: this.livesLeft, y: this.textTop },
        });
    }

    /**
     * Draws the score in the board
     * @returns {Void}
     */
    drawScore() {
        const left   = this.ctx.measureText("Score").width;
        const margin = this.scoreMargin * Board.tileSize;
        const top    = this.textTop     * Board.tileSize;
        const width  = this.scoreWidth  * Board.tileSize + margin / 2;
        const height = this.scoreHeight * Board.tileSize;

        this.ctx.save();
        this.ctx.fillStyle = this.scoreColor;
        this.ctx.textAlign = "left";
        this.ctx.font      = `1.8em "Whimsy TT"`;
        this.ctx.clearRect(left + margin / 2, top - height / 2 - 2, width, height + 2);
        this.ctx.fillText(this.score, left + margin, top);
        this.ctx.restore();
    }
}
