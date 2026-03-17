import React from 'react';
import './UnsupportedBrowser.scss';

export function UnsupportedBrowser() {
  return (
    <div className="message-box-wrapper">
      <div className="message-box">
        <h1>Unsupported Web Browser</h1>
        <p>
          Remap Standalone works on web browsers that support the WebHID API.
          <br />
          For example, Google Chrome version 89 or later supports the WebHID
          API.
        </p>
      </div>
    </div>
  );
}
