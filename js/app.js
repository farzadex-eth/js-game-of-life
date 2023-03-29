import Board from "./gameoflife.js";

const board = new Board(20, 20, 20, 30, 1000);
board.draw();

let r = document.getElementById("rows");
let c = document.getElementById("columns");
let s = document.getElementById("size");
let p = document.getElementById("prob");
let interv = document.getElementById("interval");

r.value = 20;
c.value = 20;
s.value = 20;
p.value = 30;
interv.value = 1000;

const inputValue = (val, min, max) => {
    return Math.max(Math.min(val, max), min);
}

r.addEventListener("change", (e) => {
    const v = inputValue(e.target.value, 5, 1000);
    e.target.value = v;
    board.setH(v);
})

c.addEventListener("change", (e) => {
    const v = inputValue(e.target.value, 5, 1000);
    e.target.value = v;
    board.setW(v);
})

s.addEventListener("change", (e) => {
    const v = inputValue(e.target.value, 5, 50);
    e.target.value = v;
    board.setSize(v);
})

p.addEventListener("change", (e) => {
    const v = inputValue(e.target.value, 10, 99);
    e.target.value = v;
    board.setP(v);
})

interv.addEventListener("change", (e) => {
    const v = inputValue(e.target.value, 10, 1000000);
    e.target.value = v;
    board.setI(v);
})

document.getElementById("start").addEventListener("click", (e) => {
    board.run();
})

document.getElementById("stop").addEventListener("click", (e) => {
    board.stop();
})

document.getElementById("reset").addEventListener("click", (e) => {
    board.reset();
})