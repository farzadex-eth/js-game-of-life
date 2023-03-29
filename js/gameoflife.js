let canvas = document.getElementById("gol");

class Board {

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

    setW(val) {
        this.clear();
        this.width = val;
        this.cells = Array(this.width * this.height);
        this.initCells();
        this.ctx.canvas.width = val * this.size;
        this.draw();
    }

    setH(val) {
        this.clear();
        this.height = val;
        this.cells = Array(this.width * this.height);
        this.initCells();
        this.ctx.canvas.height = val * this.size;
        this.draw();
    }

    setSize(val) {
        this.clear();
        this.size = val;
        this.ctx.canvas.width = this.width * val;
        this.ctx.canvas.height = this.height * val;
        this.draw();
    }

    setP(val) {
        this.clear();
        this.prob = val;
        this.initCells();
        this.draw();
    }

    setI(val) {
        this.interv = val;
        if(this.interval) {
            this.stop();
            this.run();
        }
    }

    initCells() {
        for (let i = 0; i < this.width * this.height; i++) {
            this.cells[i] = Math.floor(Math.random() * 100) >= (100-this.prob) ? 1 : 0;
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    draw() {
        for (let i = 0; i < this.width * this.height; i++) {
            if (this.cells[i] === 1) {
                this.ctx.fillRect((i % this.width) * this.size, Math.floor(i / this.width) * this.size, this.size, this.size);
                continue;
            }
            this.ctx.beginPath();
            this.ctx.lineWidth = "0.5";
            this.ctx.strokeStyle = "black";
            this.ctx.rect((i % this.width) * this.size, Math.floor(i / this.width) * this.size, this.size, this.size);
            this.ctx.stroke();
        }
        this.showGen();
    }

    showGen() {
        document.getElementById("gen").innerHTML = `Generation ${this.gen}`;
    }

    cellState(i) {
        return this.cells[i];
    }

    leftOf(i) {
        return (
            Math.floor(i / this.width) * this.width + (((i - 1) % this.width) + this.width) % this.width
        );
    }

    rightOf(i) {
        return (
            Math.floor(i / this.width) * this.width + (((i + 1) % this.width) + this.width) % this.width
        );
    }

    topOf(i) {
        return (
            (i - this.width + this.width * this.height) % (this.width * this.height)
        );
    }

    bottomOf(i) {
        return (
            (i + this.width + this.width * this.height) % (this.width * this.height)
        );
    }

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

    nextGeneration() {
        let nextCells = [...this.cells];
        for (let i = 0; i < this.width * this.height; i++) {
            const n = this.countNeighbours(i);
            if (n < 2) {
                nextCells[i] = 0;
            } else if ((n === 2 || n === 3) && this.cellState(i) === 1) {
                nextCells[i] = 1;
            } else if (n > 3 && this.cellState(i) === 1) {
                nextCells[i] = 0;
            } else if (n === 4 && this.cellState(i) === 0) {
                nextCells[i] = 1;
            }
        }
        this.cells = [...nextCells];
        this.gen++;
    }

    run() {
        this.interval = setInterval(() => {
            this.nextGeneration();
            this.clear();
            this.draw();
        }, this.interv);
    }

    stop() {
        clearInterval(this.interval);
    }

    reset() {
        this.stop();
        this.gen = 0;
        this.initCells();
        this.clear();
        this.draw();
    }
}

export default Board


