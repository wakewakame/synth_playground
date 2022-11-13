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
  port.postMessage(`mouse: ${e.pageX}, ${e.pageY}`);
});
