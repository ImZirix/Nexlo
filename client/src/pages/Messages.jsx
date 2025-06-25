import { useEffect, useState } from "react";
import api from "../utils/axios.js";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    async function fetchConversations() {
      const res = await api.get("/messages/conversations");
      setConversations(res.data);
    }
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    async function fetchMessages() {
      const res = await api.get(`/messages/${selectedUser.id}`);
      setMessages(res.data);
    }
    fetchMessages();
  }, [selectedUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const res = await api.post(`/messages/${selectedUser.id}`, {
      content: newMessage,
    });

    setMessages((prev) => [...prev, { ...res.data, fromCurrentUser: true }]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {conversations.map((user) => (
          <button
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`w-full text-left mb-2 p-2 rounded ${
              selectedUser?.id === user.id ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <img
                src={
                  user.profilePic ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                }
                className="w-8 h-8 rounded-full"
              />
              <span>{user.name}</span>
            </div>
          </button>
        ))}
      </aside>

      <main className="flex-1 bg-gray-800 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
              Chat with {selectedUser.name}
            </h2>
            <div className="flex-1 overflow-y-auto space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-xs p-2 rounded ${
                    msg.fromCurrentUser ? "bg-blue-600 ml-auto" : "bg-gray-700"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="mt-4 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <p className="text-gray-400 text-center m-auto">
            Select a conversation to start chatting.
          </p>
        )}
      </main>
    </div>
  );
}

export default Messages;
