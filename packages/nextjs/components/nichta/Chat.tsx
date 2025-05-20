import React from 'react';

export default function Chat() {
  return (
    <div className="p-3">
      <h2 className="text-xl font-semibold mb-4">Chat</h2>
      <input
        className="input input-info"
        type="text"
        placeholder="Send message"
        required
      />
      <button className="btn btn-neutral">Send</button>
    </div>
  );
}
