"use strict";

const AudioContext = window.AudioContext || window.webkitAudioContext;
let port=null;
document.addEventListener("click", async () => {
  if (port === null) {
    const audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule("./audio-processor.js");
    const AudioNode = new AudioWorkletNode(
      audioContext,
      "audio-processor"
    );
    AudioNode.connect(audioContext.destination);
    port = AudioNode.port;
    port.onmessage = (e) => {
      console.log(`index: ${e.data}`);
    };
    return;
  }
});

const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');
let drag = false;
let mouse = { x: 0, y: 0 };
let params = { a0: 1, a1: 0, a2: 0, b0: 1, b1: 0, b2: 0 };
canvas.addEventListener("mousedown", () => { drag=true; });
canvas.addEventListener("mouseup", () => { drag=false; });
canvas.addEventListener("mousemove", (e) => {
  if (drag) {
    mouse = { x: e.offsetX, y: e.offsetY };
    const samplerate = 44100;  // サンプリング周波数
    const freq = (44100 / 2) ** ((1 + mouse.x) / canvas.width);  // カットオフ周波数
    const q = (1 - ((1 + mouse.y) / (1 + canvas.height))) * 2;  // Q値
    const omega = 2 * Math.PI * freq / samplerate;
    const alpha = Math.sin(omega) / (2.0 * q);
    params = {
      a0:  1.0 + alpha,
      a1: -2.0 * Math.cos(omega),
      a2:  1.0 - alpha,
      b0: (1.0 - Math.cos(omega)) / 2.0,
      b1:  1.0 - Math.cos(omega),
      b2: (1.0 - Math.cos(omega)) / 2.0,
    };
    console.log(freq);
    port?.postMessage(JSON.stringify(params));
  }
});
const animate = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#16213E";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const p = params;
  context.beginPath();
  for(let i = 0; i < canvas.width; i++) {
    const hz = (44100 / 2) ** ((1 + i) / canvas.width);  // カットオフ周波数
    const omega = 2 * Math.PI * hz / 44100;
    const sin = Math.sin;
    const cos = Math.cos;
    const gain = Math.sqrt(
      ((p.b0+p.b1*cos(omega)+p.b2*cos(omega*2))**2 + (p.b1*sin(omega)+p.b2*sin(omega*2))**2) /
      ((p.a0+p.a1*cos(omega)+p.a2*cos(omega*2))**2 + (p.a1*sin(omega)+p.a2*sin(omega*2))**2)
    );
    const db = 5 * 10 * Math.log10(gain);
    if (i === 0) { context.moveTo(i, canvas.height * 0.5 - db); }
    else         { context.lineTo(i, canvas.height * 0.5 - db); }
  }
  context.lineWidth = 4;
  context.strokeStyle = "#E94560";
  context.stroke();
  context.fillStyle = "#E94560";
  context.fillRect(mouse.x - 10, mouse.y - 10, 20, 20);
  window.requestAnimationFrame(() => { animate(); });
};
animate();
