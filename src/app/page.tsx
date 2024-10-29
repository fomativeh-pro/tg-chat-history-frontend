"use client";
import React, { useState } from "react";
import Login from "@/components/Login/Login";
import ChatList from "@/components/ChatList/ChatList";
import MyMessages from "@/components/MyMessages/MyMessages";

const App: React.FC = () => {
  // const [phoneNumber, setPhoneNumber] = useState<string>('+2348175276071');
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [chatId, setChatId] = useState<number | null>(null);

  // Handle chat selection
  const handleChatSelect = (selectedChatId: number) => {
    setChatId(selectedChatId); // Update chatId state with the selected chat ID
  };

  return (
    <main className="w-full max-w-[500px] flex justify-start items-center bg-blue-800 font-[Manrope]">
      {!phoneNumber && <Login setPhoneNumber={setPhoneNumber} />}
      {phoneNumber && (
        <>
          {!chatId && (
            <ChatList
              phoneNumber={phoneNumber}
              onChatSelect={handleChatSelect}
            />
          )}
          {chatId && (
            <MyMessages
              setChatId={setChatId}
              phoneNumber={phoneNumber}
              chatId={chatId}
            />
          )}
        </>
      )}
    </main>
  );
};

export default App;
