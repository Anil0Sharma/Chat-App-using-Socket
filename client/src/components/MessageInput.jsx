import React, { useRef, useState } from "react";

export default function MessageInput({ onSend, selectedUser, socket }) {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);
  const handleSend = () => {
    if (text.trim() !== "") {
      onSend(text);
      setText("");
    }
  };

  const handleTyping = () => {
    console.log("typing event sent");
    socket.emit("typing", {
      to: selectedUser._id,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      console.log("stop typing sent");
      socket.emit("stop-typing", { to: selectedUser._id });
    }, 1000);
  };

  return (
    <div className="p-3 border-t bg-white flex gap-2 items-center">
      <input
        type="text"
        value={text}
        placeholder="Text a message"
        onChange={(e) => {
          setText(e.target.value);
          handleTyping();
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 px-4 py-2 border rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm"
      >
        Send
      </button>
    </div>
  );
}
