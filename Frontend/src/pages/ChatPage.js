import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import { ChatState } from "../context/ChatProvider";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import Loader from "../components/Loader";

const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  useEffect(() => {
    console.log(user);
  }, [user]);

  if(!user){
    return <div><Loader/></div>
  }
  return (
    <div className="chatPage col-12 container-fluid p-0 gap-10 ">
      <Navbar />
      <div className="chatArea ">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
      <ToastContainer theme="colored" />
    </div>
  );
};

export default Chat;
