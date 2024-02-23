import React, { useEffect, useState } from "react";
import "./ChatBox.css";
import Message from "./Message";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { getSender } from "../config/ChatLogics";
// for socket.io
import io from "socket.io-client";
import Loader from "./Loader";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import ScrollableFeed from "react-scrollable-feed";
import GroupUpdateModel from "./GroupUpdateModel";
import UserModal from "./UserModal";
const ENDPOINT = "https://react-chat-vars.herokuapp.com";
var socket, selectedChatCompare;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loggedUser, setLoggedUser] = useState();
  const [newMessage, setNewMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState();
  const [isTyping, setIsTyping] = useState();

  const fetchAllMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      toast.error(err);
      setLoading(false);
      return;
    }
  };

  const sendMessage = async (e) => {
    if (newMessage) {
      e.preventDefault();
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (err) {
        toast.error(err);
        return;
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchAllMessages();
    setLoggedUser(JSON.parse(localStorage.getItem("deLinkUser")));
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  // console.log(selectedChat);

  return (
    <>
      {console.log(selectedChat)}
      {selectedChat ? (
        <div
          className={`chatbox border col-12 col-md-8 col-lg-9 d-md-flex ${
            selectedChat ? "" : "d-none"
          } `}
        >
          <div>
            <button
              className=" d-md-none "
              id="showchat"
              onClick={() => setSelectedChat("")}
              style={{ position: "absolute", top: "62px", left: "0px" }}
            >
              <AiOutlineMenuUnfold size={40} />
            </button>
          </div>
          <div className="chatarea ">
            <div className="chatprofilearea border-bottom ">
              <div className="d-flex flex-column gap-1 pb-3">
                <div
                  className="userid d-flex align-items-center gap-2"
                  data-bs-toggle="modal"
                  data-bs-target={
                    selectedChat?.isGroupChat
                      ? "#groupupdatemodal"
                      : "#usermodal"
                  }
                >
                  <div className="onlineicon"></div>
                  <p>
                    {selectedChat?.isGroupChat
                      ? selectedChat?.chatName
                      : getSender(loggedUser?.user, selectedChat?.users).name}
                  </p>
                  <div className="userid">
                    @
                    {selectedChat?.isGroupChat
                      ? selectedChat?.chatName
                      : getSender(loggedUser?.user, selectedChat?.users).name}
                  </div>
                </div>
                <div className="lastseen">
                  Last seen 6 hour ago | Local Time Jan 21 5.25PM
                </div>
                {!selectedChat?.isGroupChat &&
                  loggedUser?.user &&
                  selectedChat?.users && (
                    <UserModal
                      user={getSender(loggedUser?.user, selectedChat?.users)}
                    />
                  )}

                <GroupUpdateModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchAllMessages={fetchAllMessages}
                />
              </div>
            </div>
            {/* {console.log(getSender(loggedUser?.user, selectedChat?.users))} */}

            <div className="allmessages">
              {loading ? (
                <Loader />
              ) : (
                <ScrollableFeed>
                  {messages.map((message) => (
                    <Message message={message} />
                  ))}
                </ScrollableFeed>
              )}
            </div>
          </div>
          <div className="newmessage w-100">
            <form onSubmit={sendMessage}>
              <input
                onChange={typingHandler}
                value={newMessage}
                type="text"
                placeholder="Send Message..."
                className="form-control p-2"
              />
              <div className="mt-1 d-flex gap-2 justify-content-between">
                <div className="d-flex gap-2 align-items-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      class="bi bi-emoji-smile"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                    </svg>
                  </div>
                  <div>
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      class="bi bi-paperclip"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
                    </svg>
                  </div>{" "}
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-light d-flex fw-bolder align-items-center gap-2 border"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-chevron-down"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                      />
                    </svg>
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="chatbox border d-none d-md-flex col-md-8 col-lg-9 align-items-center justify-content-center">
          <h1 className="fs-1">Select a user to chat</h1>
        </div>
      )}
    </>
  );
};

export default ChatBox;
