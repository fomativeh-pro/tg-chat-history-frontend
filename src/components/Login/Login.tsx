import React, { useEffect, useState } from "react";
import axios from "axios";

interface LoginProps {
  setPhoneNumber: (phoneNumber: string) => void; // Prop to set phone number in App component
}

const Login: React.FC<LoginProps> = ({ setPhoneNumber }) => {
  const [phoneNumber, setLocalPhoneNumber] = useState<string>("");
  const [phoneCode, setPhoneCode] = useState<string>("");
  const [phoneCodeHash, setPhoneCodeHash] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSendCode = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL+"/api/send-code", {
        phone_number: phoneNumber,
      });
      if (response.data.messages) {
        return setPhoneNumber(phoneNumber); //User session is still valid, open chat list
      }
      setPhoneCodeHash(response.data.phone_code_hash);
      setMessage("Code sent! Please check your phone.");
    } catch (error: any) {
      setMessage(error.response.data.error || "Error sending code");
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL+"/api/sign-in", {
        phone_number: phoneNumber,
        phone_code: phoneCode,
        phone_code_hash: phoneCodeHash,
        password,
      });
      setMessage(
        "Successfully signed in! User data: " +
          JSON.stringify(response.data.user)
      );
      setPhoneNumber(phoneNumber); // Update phone number in App component
    } catch (error: any) {
      setMessage(error.response.data.error || "Error signing in");
    }
  };

  useEffect(() => {
    if (phoneCode.length > 0) {
      setMessage("");
    }
  }, [phoneCode]);

  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 4000);
  }, [message]);

  return (
    <form
      className="w-full max-w-[500px] flex flex-col justify-start items-center pb-[40px]"
      onSubmit={(e) => e.preventDefault()}
    >
      <h1 className="text-white font-bold text-[20px] mt-[20px] mb-[30px]">
        Login
      </h1>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setLocalPhoneNumber(e.target.value)}
        className="rounded-[8px] w-[60%] h-[40px] pl-[12px] outline-none"
      />
      {!phoneCodeHash && (
        <button
          onClick={handleSendCode}
          className="mt-[20px] text-green-900 font-semibold bg-green-400 rounded-[8px] px-[20px] py-[8px]"
        >
          Send Code
        </button>
      )}

      {phoneCodeHash && (
        <input
          type="text"
          placeholder="Enter Code"
          className="rounded-[8px] w-[60%] h-[40px] pl-[12px] outline-none mt-[12px]"
          value={phoneCode}
          onChange={(e) => setPhoneCode(e.target.value)}
        />
      )}

      {phoneCode && (
        <input
          type="password"
          placeholder="Enter password"
          className="rounded-[8px] w-[60%] h-[40px] pl-[12px] outline-none mt-[12px]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      {phoneCode && (
        <p className="text-white text-center text-[14px] max-w-[300px] mt-[5px]">
          If your account has a password set(2FA), enter it, or you won't be
          able to login. Else, skip to sign-in.
        </p>
      )}

      {phoneCode && (
        <button
          onClick={handleSignIn}
          className="mt-[20px] text-green-900 font-semibold bg-green-400 rounded-[8px] px-[20px] py-[8px]"
        >
          Sign In
        </button>
      )}

      <p className="text-red-300 text-center text-[14px] max-w-[300px] mt-[5px]">
        {message}
      </p>
    </form>
  );
};

export default Login;
