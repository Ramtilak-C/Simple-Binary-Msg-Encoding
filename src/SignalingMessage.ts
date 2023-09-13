export class SignalingMessage {
  headers: Map<string, string>;
  payload: string;

  constructor() {
    this.headers = new Map<string, string>();
    this.payload = '';
  }

  addHeader(name: string, value: string): boolean {
    if (this.headers.size < 63) {
      this.headers.set(name, value);
      return true;
    }
    return false; // Header limit exceeded
  }

  setPayload(payload: string): boolean {
    if (payload.length <= 256 * 1024) {
      this.payload = payload;
      return true;
    }
    return false; // Payload size exceeds the limit
  }

  encode(): Uint8Array {
    const headersString = Array.from(this.headers.entries())
      .map(([name, value]) => `${name}: ${value}`)
      .join('\n');

    const encodedHeaders = new TextEncoder().encode(headersString);
    const encodedPayload = new TextEncoder().encode(this.payload);

    const payloadLength = encodedPayload.byteLength;
    const encodedLength = encodedHeaders.byteLength;
    const messageData = new Uint8Array(4 + encodedHeaders.byteLength + payloadLength);

    // Write the payload length as a 32-bit integer
    new DataView(messageData.buffer).setUint32(0, encodedLength, false);
    messageData.set(encodedHeaders, 4);
    messageData.set(encodedPayload, 4 + encodedHeaders.byteLength);

    return messageData;
  }

  static decode(data: Uint8Array): { headers: Record<string, string>, payload: string } | null {
    try {
      const encodedLength = new DataView(data.buffer).getUint32(0, false);

      // Extract the encoded headers and payload
      const encodedHeaders = data.slice(4, 4 + encodedLength);
      const encodedPayload = data.slice(4 + encodedLength);

      // Decode headers (assuming ASCII encoding)
      const headersString = new TextDecoder().decode(encodedHeaders);

      // Split headers into name-value pairs
      const headersArray = headersString.split('\n').filter(Boolean);
      const headers: Record<string, string> = {};

      for (const header of headersArray) {
        const [name, value] = header.split(': ', 2);
        headers[name] = value;
      }

      // Decode payload (assuming ASCII encoding)
      const payload = new TextDecoder().decode(encodedPayload);

      return { headers, payload };
    } catch (error) {
      console.error("Error decoding binary data:", error);
      return null;
    }
  }





}
