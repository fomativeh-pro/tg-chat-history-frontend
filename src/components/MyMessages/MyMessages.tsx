import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Message {
  id: number;
  content: string;
  messageType: string;
  senderType: string;
  date: number;
}

interface MessagesProps {
  phoneNumber: string;
  chatId: number;
  setChatId: Dispatch<SetStateAction<number | null>>;
}

const MyMessages: React.FC<MessagesProps> = ({
  phoneNumber,
  chatId,
  setChatId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatmate, setChatmate] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL+"/api/messages", {
        phone_number: phoneNumber,
        chat_id: chatId,
      });
      setMessages(response.data.data.messages);
      setChatmate(response.data.data.chatmateName);
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "Error fetching messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phoneNumber && chatId) {
      fetchMessages();
    }
  }, [phoneNumber, chatId]);

  return (
    <section className="h-full w-full flex flex-col justify-start items-center pt-[60px]">
      {!loading && (
        <>
          <section className="fixed top-0 flex justify-center items-center h-[60px] max-w-[500px] bg-blue-800 w-full">
            <section className="relative w-full h-full flex justify-center items-center">
              <h2 className="text-[22px] font-bold text-white">{chatmate.length>18? chatmate.slice(0,20)+"...":chatmate}</h2>

              <section className="absolute top-0 flex justify-start items-center pl-[20px] h-[60px] w-full">
                <section
                  onClick={() => setChatId(null)}
                  className="cursor-pointer flex justify-start items-center p-[10px] rounded-[12px] bg-blue-950"
                >
                  <figure className="relative w-[20px] h-[15px] rotate-180">
                    <Image
                      src={"/assets/icons/right-arrow.svg"}
                      alt="Back icon"
                      fill
                    />
                  </figure>
                </section>
              </section>
            </section>
          </section>
        </>
      )}

      {loading && (
        <section className="fixed top-0 flex justify-center items-center h-[60px] max-w-[500px] bg-blue-800 w-full">
          <h2 className="text-[22px] font-bold text-white">Loading...</h2>
        </section>
      )}

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {!loading && (
        <ul className="w-full bg-[#101f4a] p-[20px] flex flex-col justify-start items-center">
          {messages.map((msg) => (
            <li
              className="flex w-full my-[5px]"
              key={msg.id}
              style={{
                justifyContent:
                  msg.senderType === "sent" ? "flex-end" : "flex-start",
              }}
            >
              <span
                className={`p-[10px] rounded-[12px] break-words text-white w-fit max-w-[300px] ${
                  msg.senderType === "sent" ? `bg-[#5d5d9a]` : `bg-[#8d2626]`
                }`}
              >
                {msg.messageType === "text" ? msg.content : `[${msg.content}]`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default MyMessages;
