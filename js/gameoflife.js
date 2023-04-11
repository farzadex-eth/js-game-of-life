// Canvas element
let canvas = document.getElementById("gol");

/**
 * Class for the game board
 */
class Board {

    changed = [];
    /**
     * Board Constructor
     * @param {number} w - board width = number of columns
     * @param {number} h - board height = number of rows
     * @param {number} cellSize - single cell size (square)
     * @param {number} probability - probability of a cell being alive in Gen. 0
     * @param {number} interv - time interval between generations
     */
    constructor(w, h, cellSize, probability, interv) {
        this.size = cellSize;
        this.cells = Array(w * h);
        this.width = w;
        this.height = h;
        this.ctx = canvas.getContext("2d");
        this.ctx.canvas.width = w * cellSize;
        this.ctx.canvas.height = h * cellSize;
        this.prob = probability;
        this.interv = interv;
        this.initCells();
        this.gen = 0;
    }

    /**
     * Set new width
     * @param {number} val - number of columns
     */
    setW(val) {
        this.clear();
        this.width = val;
        this.cells = Array(this.width * this.height);
        this.initCells();
        this.ctx.canvas.width = val * this.size;
        this.draw();
    }

    /**
     * Set new height
     * @param {number} val - number of rows
     */
    setH(val) {
        this.clear();
        this.height = val;
        this.cells = Array(this.width * this.height);
        this.initCells();
        this.ctx.canvas.height = val * this.size;
        this.draw();
    }

    /**
     * Set new cell size
     * @param {number} val - cell size
     */
    setSize(val) {
        this.clear();
        this.size = val;
        this.ctx.canvas.width = this.width * val;
        this.ctx.canvas.height = this.height * val;
        this.draw();
    }

    /**
     * Set new probability of life
     * @param {number} val - probability
     */
    setP(val) {
        this.clear();
        this.prob = val;
        this.initCells();
        this.draw();
    }

    /**
     * Set new time interval
     * @param {number} val - time interval
     */
    setI(val) {
        this.interv = val;
        if (this.interval) {
            this.stop();
            this.run();
        }
    }

    /**
     * Generate random array of dead or alive cells based on the probability
     */
    initCells() {
        for (let i = 0; i < this.width * this.height; i++) {
            this.cells[i] = Math.floor(Math.random() * 100) >= (100 - this.prob) ? 1 : 0;
        }
    }

    /**
     * Clear the board
     */
    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    /**
     * Draw a single cell
     * @param {number} i - cell index 
     * @param {number} status - cell value
     * @returns 
     */
    drawCell(i, status) {
        if (status === 1) {
            this.ctx.fillRect((i % this.width) * this.size, Math.floor(i / this.width) * this.size, this.size, this.size);
            return;
        }
        this.ctx.beginPath();
        this.ctx.lineWidth = "0.5";
        this.ctx.strokeStyle = "black";
        this.ctx.rect((i % this.width) * this.size, Math.floor(i / this.width) * this.size, this.size, this.size);
        this.ctx.stroke();
    }

    /**
     * Clear a single cell
     * @param {number} i - cell index 
     */
    clearCell(i) {
        this.ctx.clearRect((i % this.width) * this.size, Math.floor(i / this.width) * this.size, this.size, this.size);
    }

    /**
     * Draw whole board
     */
    draw() {
        for (let i = 0; i < this.width * this.height; i++) {
            this.drawCell(i, this.cells[i]);
        }
        this.showGen();
    }

    /**
     * Clear and draw a singlechanged cell
     */
    clearDrawChanged(cell) {
        this.clearCell(cell.index);
        this.drawCell(cell.index, cell.status);
    }

    /**
     * Update cells array and cells on board
     */
    updateBoard() {
        this.changed.forEach((cell) => {
            this.cells[cell.index] = cell.status;
            this.clearDrawChanged(cell);
        })
    }

    /**
     * Update generation counter on the page
     */
    showGen() {
        document.getElementById("gen").innerHTML = `Generation ${this.gen}`;
    }

    /**
     * Returns if a cell is alive or dead
     * @param {number} i - cell index in cells array
     * @returns {number}
     */
    cellState(i) {
        return this.cells[i];
    }

    /**
     * Returns cell index in cells array that's left of the ith cell
     * @param {number} i - cell index in cells array
     * @returns {number}
     */
    leftOf(i) {
        return (
            Math.floor(i / this.width) * this.width + (((i - 1) % this.width) + this.width) % this.width
        );
    }

    /**
     * Returns cell index in cells array that's right of the ith cell
     * @param {number} i - cell index in cells array
     * @returns {number}
     */
    rightOf(i) {
        return (
            Math.floor(i / this.width) * this.width + (((i + 1) % this.width) + this.width) % this.width
        );
    }

    /**
     * Returns cell index in cells array that's top of the ith cell
     * @param {number} i - cell index in cells array
     * @returns {number}
     */
    topOf(i) {
        return (
            (i - this.width + this.width * this.height) % (this.width * this.height)
        );
    }

    /**
     * Returns cell index in cells array that's bottom of the ith cell
     * @param {number} i - cell index in cells array
     * @returns {number}
     */
    bottomOf(i) {
        return (
            (i + this.width + this.width * this.height) % (this.width * this.height)
        );
    }

    /**
     * Returns number of alive neighbours for ith cell
     * @param {number} i - cell index in cells array
     * @returns {number}
     */
    countNeighbours(i) {
        return (
            this.cellState(this.leftOf(i)) +
            this.cellState(this.rightOf(i)) +
            this.cellState(this.topOf(i)) +
            this.cellState(this.bottomOf(i)) +
            this.cellState(this.leftOf(this.topOf(i))) +
            this.cellState(this.rightOf(this.topOf(i))) +
            this.cellState(this.leftOf(this.bottomOf(i))) +
            this.cellState(this.rightOf(this.bottomOf(i)))
        );
    }

    /**
     * Calculate next generation based on Conway's Game of Life Rules and record the changed cells
     * 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation. -> Change
     * 2. Any live cell with two or three live neighbours lives on to the next generation. -> No Change
     * 3. Any live cell with more than three live neighbours dies, as if by overpopulation. -> Change
     * 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. -> Change
     */
    nextGeneration() {
        this.changed = [];
        for (let i = 0; i < this.width * this.height; i++) {
            const n = this.countNeighbours(i);
            if (n < 2 && this.cellState(i) === 1) {
                    this.changed.push({ index: i, status: 0 });
            } else if (n > 3 && this.cellState(i) === 1) {
                this.changed.push({ index: i, status: 0 });
            } else if (n === 4 && this.cellState(i) === 0) {
                this.changed.push({ index: i, status: 1 });
            }
        }
        this.gen++;
    }

    /**
     * Run the game
     */
    run() {
        this.interval = setInterval(() => {
            this.nextGeneration();
            this.updateBoard();
            this.showGen();
        }, this.interv);
    }

    /**
     * Stop the game
     */
    stop() {
        clearInterval(this.interval);
    }

    /**
     * Stop & Reset the board
     */
    reset() {
        this.stop();
        this.gen = 0;
        this.initCells();
        this.clear();
        this.draw();
    }
}

export default Board


