"use strict";

// audio-processor.js
class AudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    // 双二次フィルタに用いるパラメータの初期値
    this.params = {
      a0: 1.0, a1: 0.0, a2: 0.0,
      b0: 1.0, b1: 0.0, b2: 0.0,
    };
    // ワーカーの生成元から送られてくるパラメータを適応
    this.port.onmessage = (e) => {
      this.params = JSON.parse(e.data);
    };
    // 過去の入出力の値
    this.val = {
      in1: 0.0, in2: 0.0,
      out1: 0.0, out2: 0.0,
    };
  }
  process(inputs, outputs, parameters) {
    const val = this.val;
    const params = this.params;
    const output = outputs[0];
    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        const in0 = (Math.random() * 2 - 1) * 0.1;
        const out0 = in0      * params.b0/params.a0 +
                     val.in1  * params.b1/params.a0 +
                     val.in2  * params.b2/params.a0 -
                     val.out1 * params.a1/params.a0 -
                     val.out2 * params.a2/params.a0;
        this.val.in2  = val.in1;
        this.val.in1  = in0;
        this.val.out2 = val.out1;
        this.val.out1 = out0;
        channel[i] = out0;
      }
    });
    // 生成した波形をワーカーの生成もとに送る
    //this.port.postMessage(output);
    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);

