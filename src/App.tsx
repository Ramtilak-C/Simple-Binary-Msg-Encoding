import React, { useState } from 'react';
import './App.css';
import { SignalingMessage } from './SignalingMessage.ts';

function App() {
  const [textMessage, setTextMessage] = useState('');
  const [decodedMessage, setDecodedMessage] = useState<SignalingMessage | null>(null);
  const [encodedMessage, setEncodedMessage] = useState<SignalingMessage | null>(null);

  const handleEncodeClick = () => {
    const message = new SignalingMessage();
    message.addHeader('Content-Type', 'text/plain');
    message.addHeader("Accept", "application/json");
    message.setPayload(textMessage);

    const encodedMessage = message.encode();
    setEncodedMessage(encodedMessage);
    setDecodedMessage(SignalingMessage.decode(encodedMessage));
  };

  return (
    <div className="App">
      <h1>Binary Message Encoding and Decoding with React</h1>
      <div>
        <label htmlFor="textMessage">Enter Text Message:</label>
        <textarea
          id="textMessage"
          rows={4}
          cols={50}
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
        />
      </div>
      <button onClick={handleEncodeClick}>Encode</button>
      <div className='Encode-message'>
      {encodedMessage && (
        <div>
          <h2>Encoded Message:</h2>
          <pre>{JSON.stringify(encodedMessage, null, 2)}</pre>
        </div>
      )}
      {decodedMessage && (
        <div>
          <h2>Decoded Message:</h2>
          <pre>{JSON.stringify(decodedMessage, null, 2)}</pre>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
