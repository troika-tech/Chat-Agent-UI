/**
 * Creates a WAV header for PCM audio data
 * Based on the backend's StreamingVoiceService.createWavHeader implementation
 *
 * @param {number} dataLength - Length of audio data in bytes
 * @param {number} sampleRate - Sample rate (default: 24000 Hz for TTS)
 * @param {number} numChannels - Number of channels (1 for mono, 2 for stereo)
 * @param {number} bitsPerSample - Bits per sample (16 for 16-bit PCM)
 * @returns {Uint8Array} WAV header bytes
 */
export function createWavHeader(
  dataLength,
  sampleRate = 24000,
  numChannels = 1,
  bitsPerSample = 16
) {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true); // File size - 8
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // ByteRate
  view.setUint16(32, numChannels * (bitsPerSample / 8), true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true); // Subchunk2Size

  return new Uint8Array(header);
}

/**
 * Helper function to write string to DataView
 */
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Decodes base64 audio chunk to Uint8Array
 * @param {string} base64String - Base64 encoded audio data
 * @returns {Uint8Array} Decoded audio data
 */
export function decodeBase64Audio(base64String) {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:audio\/\w+;base64,/, '');

  // Decode base64 to binary string
  const binaryString = atob(base64Data);

  // Convert binary string to Uint8Array
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

/**
 * Creates a complete WAV file from PCM audio chunks
 * @param {Uint8Array[]} chunks - Array of PCM audio chunks
 * @param {number} sampleRate - Sample rate (default: 24000 Hz)
 * @returns {Blob} WAV audio blob
 */
export function createWavBlob(chunks, sampleRate = 24000) {
  // Calculate total data length
  const dataLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);

  // Create WAV header
  const header = createWavHeader(dataLength, sampleRate, 1, 16);

  // Combine header and all chunks
  const wavFile = new Uint8Array(header.length + dataLength);
  wavFile.set(header, 0);

  let offset = header.length;
  for (const chunk of chunks) {
    wavFile.set(chunk, offset);
    offset += chunk.length;
  }

  return new Blob([wavFile], { type: 'audio/wav' });
}
