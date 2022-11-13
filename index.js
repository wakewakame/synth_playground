"use strict";

const AudioContext = window.AudioContext || window.webkitAudioContext;

let port=null;
document.addEventListener("click", async (e) => {
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
document.addEventListener("mousemove", async (e) => {
  const samplerate = 44100;  // サンプリング周波数
  const freq = 1.0 + e.pageX * 10;  // カットオフ周波数
  const q = 2.0;  // Q値
  const omega = 2.0 * Math.PI * freq / samplerate;
  const alpha = Math.sin(omega) / (2.0 * q);
  const params = {
    a0:  1.0 + alpha,
    a1: -2.0 * Math.cos(omega),
    a2:  1.0 - alpha,
    b0: (1.0 - Math.cos(omega)) / 2.0,
    b1:  1.0 - Math.cos(omega),
    b2: (1.0 - Math.cos(omega)) / 2.0,
  };
  port?.postMessage(JSON.stringify(params));
});
