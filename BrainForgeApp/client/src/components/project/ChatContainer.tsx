import ReactMarkdown from "react-markdown";
import { useApi } from "@/lib/hooks/use_api";
import { useState } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
}
type ChatContainerProps = {
  historyId?: number;
};

export const ChatContainer = ({ historyId }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const api = useApi();

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await api.post("/api/ai/chat", {
        historyId: historyId,
        userMessage: input,
      });
      console.log(response);

      if (!response) {
        throw new Error("Failed to communicate with AI");
      }

      const aiMessage: Message = { sender: "ai", text: response.chat.aiMessage };
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
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg w-full ${
              message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
            } break-words whitespace-normal`}
          >
            <ReactMarkdown
              components={{
                pre: ({ children }) => (
                  <pre className="whitespace-pre-wrap break-words bg-gray-100 p-2 rounded">
                    {children}
                  </pre>
                ),
                code: ({ children }) => (
                  <code className="whitespace-pre-wrap break-words bg-gray-200 p-1 rounded">
                    {children}
                  </code>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
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

