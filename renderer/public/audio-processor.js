class PCMProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];

    if (input && input.length > 0) {
      const channelData = input[0];

      // send Float32Array to main thread
      this.port.postMessage(channelData);
    }

    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
