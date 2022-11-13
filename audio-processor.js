"use strict";

// audio-processor.js
class AudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.port.onmessage = (e) => {
      console.log(`audio-processor: ${e.data}`);
    };
  }
  process(inputs, outputs, parameters) {
    const array = (new Uint8Array([1,2,3,4]));
    this.port.postMessage(array, [array.buffer]);
    const output = outputs[0];
    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = (Math.random() * 2 - 1) * 0.0;
      }
    });
    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);

