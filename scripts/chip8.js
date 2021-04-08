import Renderer from './renderer.js'
import Keyboard from './keyboard.js'
import Speaker from './speaker.js'
import CPU from './cpu.js'

const renderer = new Renderer(10)
const keyboard = new Keyboard()
const speaker = new Speaker()
const cpu = new CPU(renderer,keyboard,speaker)
const ROMS = [
    "15PUZZLE",
    "BLINKY",
    "BLITZ",
    "BRIX",
    "CONNECT4",
    "GUESS",
    "HIDDEN",
    "IBM",
    "INVADERS",
    "KALEID",
    "MAZE",
    "MERLIN",
    "MISSILE",
    "PONG",
    "PONG2",
    "PUZZLE",
    "SYZYGY",
    "TANK",
    "TETRIS",
    "TICTAC",
    "UFO",
    "VBRIX",
    "VERS",
    "WIPEOFF"
  ]
let loop

let fps = 60, fpsInterval, startTime, now, then, elapsed

function init() {
    fpsInterval = 1000 / fps
    then = Date.now()
    startTime = then

    renderer.render()

    cpu.loadSpritesIntoMemory()
}

function step() {
    now = Date.now()
    elapsed = now - then

    if (elapsed > fpsInterval) {
        cpu.cycle()
    }

    loop = requestAnimationFrame(step)
}


function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}





var romSelector = document.getElementById("rom_selector");
loop = requestAnimationFrame(step)
for (var i = 0, romsCount = ROMS.length; i < romsCount; i++) {
    var option = document.createElement("option");
    var rom = ROMS[i];
    option.value = option.innerHTML = rom;
    romSelector.appendChild(option);
}

romSelector.addEventListener("change", function(event) {
if (event.target.value != "") {
    cpu.reset()
    readTextFile("../data/roms.json", function(text){
        var data = JSON.parse(text);
        console.log(data[event.target.value])
        cpu.loadProgramIntoMemory(data[event.target.value].data)
        init()
    });
    init()
    romSelector.blur()


}}, false);


init()