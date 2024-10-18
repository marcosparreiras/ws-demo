import React, { useState } from "react";

type Message = {
  content: string;
  user: string;
};

const ws = new WebSocket("ws://localhost:3000/chat");

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  ws.onmessage = (message: MessageEvent) => {
    const data = JSON.parse(message.data);
    if (typeof data.content !== "string" || typeof data.user !== "string") {
      setMessages((prev) => [
        { user: "ALERT", content: data.message },
        ...prev,
      ]);
      return;
    }
    setMessages((prev) => [data, ...prev]);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = { user: "frontend", content: inputValue };
    ws.send(JSON.stringify(message));
    setInputValue("");
  }

  return (
    <div className="app-container">
      <h1>Chat</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="type here"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" disabled={!inputValue}>
          Send
        </button>
      </form>
      {messages.length > 0 &&
        messages.map((message) => (
          <div className="message-container">
            <span>{message.user}</span>
            <p>{message.content}</p>
          </div>
        ))}
    </div>
  );
}

export default App;
