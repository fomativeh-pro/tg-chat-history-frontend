import React, { useEffect, useState } from "react";
import axios from "axios";

interface Chat {
  id: number;
  name: string;
}

interface ChatListProps {
  phoneNumber: string;
  onChatSelect: (chatId: number) => void; // Callback to set selected chat ID
}

const ChatList: React.FC<ChatListProps> = ({ phoneNumber, onChatSelect }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_URL + "/api/chats/" + `${phoneNumber}`
      );
      setChats(response.data.data); // Assuming response.data is an array of chats
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "Error fetching chats");
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      fetchChats();
    }
  }, [phoneNumber]);

  return (
    <section className="h-full w-full flex flex-col justify-start items-center">
      <section className="w-full flex flex-col justify-start items-center my-[20px]">
        <h2 className="text-[22px] font-bold text-white my-[5px]">My Chats</h2>
        <span className="font-medium text-red-300">
          Click a chat to view your messages
        </span>
      </section>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <ul className="w-full bg-[#101f4a] p-[20px] flex flex-col justify-start items-center">
        {chats.length > 0 &&
          chats.map((eachChat, i) => {
            return (
              <li
                className="rounded-[8px] p-[12px] bg-blue-500 text-white w-[90%] my-[10px] cursor-pointer"
                key={i}
                onClick={() => onChatSelect(eachChat.id)}
                style={{ cursor: "pointer" }}
              >
                {eachChat.name}
              </li>
            );
          })}

        {chats.length == 0 && <p className="text-white">Loading...</p>}
      </ul>
    </section>
  );
};

export default ChatList;
