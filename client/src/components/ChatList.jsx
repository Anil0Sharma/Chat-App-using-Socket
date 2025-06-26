import React from "react";
import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import ChatWindow from "./ChatWindow";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

export default function ChatList() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]); //
  const [lastMessages, setLastMessages] = useState({}); //

  useEffect(() => {
    const fetchUsersAndMessages = async () => {
      try {
        const { data } = await API.get(`/users?userId=${user._id}`);
        console.log("Fetched users:", data);

        const messagesMap = {};
        await Promise.all(
          data.map(async (u) => {
            const convRes = await API.post("/conversations", {
              senderId: user._id,
              receiverId: u._id,
            });

            const msgRes = await API.get(`/messages/${convRes.data._id}`);
            const msgs = msgRes.data;
            console.log("Messages for", u._id, msgs);
            if (msgs.length > 0) {
              messagesMap[u._id] = msgs[msgs.length - 1];
            }
          })
        );

        console.log("last message map", messagesMap);
        setLastMessages(messagesMap);
        setUsers(data);
        console.log("last message map", lastMessages);
        console.log("checking user", user._id, lastMessages[user._id]);
      } catch (err) {
        console.error("Error fetching users or messages", err);
      }
    };
    fetchUsersAndMessages();

    if (user?._id) {
      socket.emit("add-user", user._id);
    }

    socket.on("online-users", (online) => {
      setOnlineUsers(online);
    });

    // return () => {
    //   socket.off("online-users");
    // };
  }, [user]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <div className="space-y-2 overflow-y-auto max-h-[85vh]">
          {users.map((u) => {
            const lastMsg = lastMessages[u._id]?.text || "No messages yet";
            return (
              <div
                key={u._id}
                className={`p-2 rounded cursor-pointer transition-all ${
                  selectedUser?._id === u._id
                    ? "bg-blue-500 text-white font-semibold"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedUser(u)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      onlineUsers.includes(u._id)
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  <span>{u.username}</span>
                </div>
                <div className="">{lastMsg}</div>
              </div>
            );
          })}
        </div>
      </aside>

      <main className="flex-1 p-4">
        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} />
        ) : (
          <div className="text-gray-600 text-center mt-20">
            <p className="text-xl">Select a user to start chatting 💬</p>
          </div>
        )}
      </main>
    </div>
  );
}
