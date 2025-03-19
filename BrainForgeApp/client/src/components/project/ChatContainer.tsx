import React, { useState } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI");
      }

      const data = await response.json();
      const aiMessage: Message = { sender: "ai", text: data.reply };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = { sender: "ai", text: "Error communicating with AI" };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-2">Chat with AI</h2>
      <div className="space-y-2 max-h-64 overflow-y-auto flex-1">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex mt-4 space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button onClick={handleSendMessage} className="px-4 py-2 bg-primary text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

