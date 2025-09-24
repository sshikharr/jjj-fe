"use client";
import { MyContext } from "@/context/MyContext";
import { useContext, useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";

const DocsChatList = () => {
  const { user, setSelectedChat, selectedChat, chats, setChats } =
    useContext(MyContext);

  useEffect(() => {
    const fetchChats = async () => {
      const data = await fetch(
        `https://juristo-back.vercel.app/api/image-chat/${user.userId}`
        // `https://juristo-back.vercel.app/api/image-chat/${user.userId}`
      ).then((res) => res.json());
      setChats(data.reverse());
    };
    fetchChats();
  }, [user, selectedChat]);

  const deleteChat = async (chatId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://juristo-back.vercel.app/api/image-chat/${chatId}`,
        {
          // const response = await fetch(`https://juristo-back.vercel.app/api/image-chat/${chatId}`, {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setChats((prevChats) =>
          prevChats.filter((chat) => chat.chatId !== chatId)
        );
        if (selectedChat?.chatId === chatId) setSelectedChat(null);
        alert("Chat deleted successfully.");
      } else {
        alert("Failed to delete chat. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("An error occurred while deleting the chat.");
    }
  };

  return (
    <div className="w-1/3 bg-gray-200 p-4 min-h-screen max-h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Chats</h2>

      {/* New Chat Button */}
      <button
        onClick={() => setSelectedChat(null)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        New Chat
      </button>

      {chats.map((chat) => (
        <div
          key={chat.chatId}
          className={`p-3 mb-2 bg-white rounded shadow cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
            chat.chatId === selectedChat?.chatId
              ? "bg-gray-300 hover:bg-gray-300"
              : ""
          }`}
        >
          <div className="flex-1">
            <p>{chat.title}</p>
            <small>{new Date(chat.createdAt).toLocaleString()}</small>
          </div>
          <button
            onClick={() => deleteChat(chat.chatId)}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            <FiTrash size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocsChatList;
