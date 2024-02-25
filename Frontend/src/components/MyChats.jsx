/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import "./MyChats.css";
import { IoIosSearch } from "react-icons/io";
import { MdGroupAdd } from "react-icons/md";
import { FaAngleDown, FaRegEnvelopeOpen, FaRegStar } from "react-icons/fa";
import Loader from "./Loader";
import UserListItem from "./UserListItem";
import GroupCreateModal from "./GroupCreateModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/chats`, config);
      setChats(data);
    } catch (err) {
      toast.error(err);
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("deLinkUser")));
    fetchChats();
  }, [fetchAgain]);

  const handleSearch = async () => {
    if (!search) {
      return toast.info("Please enter a query");
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${search}`, config);
      setSearchResult(data.users);
      setLoading(false);
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };
  const accessChat = async (userId) => {
    setLoading(true);
    setLoadingChat(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chats`, { userId }, config);
      if (!chats.find((item) => item._id === data._id))
        setChats([data, ...chats]);
      setSelectedChat(data);
      setLoading(false);
      setLoadingChat(false);
      document.getElementById("searchclosebtn").click();
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };

  return (
    <div className={`messagesbox col-sm-12 col-md-4 col-lg-3 me-4  d-md-block ${selectedChat?"d-none":""}`} >
      <div className="messagesboxheader">
        <div className="messagesheading">
          <p className="fs-3">All messages</p>
          <div className="messagesarrow">
            <FaAngleDown />
          </div>
        </div>

        <div className="chatsearch">
          <IoIosSearch
            size={33}
            data-bs-toggle="offcanvas"
            data-bs-target="#searchpeople"
            aria-controls="offcanvasExample"
          />
        </div>
        <div className="addagroupicon">
          <MdGroupAdd
            size={36}
            data-bs-toggle="modal"
            data-bs-target="#groupcreatemodal"
          />
          <GroupCreateModal />
        </div>
        <div
          class="offcanvas offcanvas-start"
          tabindex="-1"
          id="searchpeople"
          aria-labelledby="offcanvasExampleLabel"
        >
          <div class="offcanvas-header">
            Search Users
            <button
              type="button"
              class="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              id="searchclosebtn"
            ></button>
          </div>
          <div class="offcanvas-body">
            <div class="input-group mb-1 mt-1 fw-bold ">
              <input
                type="text"
                class="form-control"
                placeholder="Search by name or email"
                aria-label="Search by name or email"
                aria-describedby="button-addon2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                class="btn btn-primary rounded-end-circle fw-bold"
                type="button"
                id="button-addon2"
                onClick={handleSearch}
              >
                <IoIosSearch />
              </button>
            </div>
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "600px" }}
              >
                {" "}
                <Loader />
              </div>
            ) : (
              <div
                className="d-flex flex-column mt-2 overflow-auto"
                style={{ height: "600px" }}
              >
                {searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                    className="text-reset"
                    data-bs-dismiss="offcanvas"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* chats */}
      <div className="overflow-scroll">
        {chats.map((chat, index) => (
          <div
            className={`contacts border col-12 ${selectedChat == chat? "bg-light":""}`}
            onClick={() => setSelectedChat(chat)}
            key={index}
          >
            <img
              src={
                chat.isGroupChat
                  ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  : loggedUser &&
                    loggedUser.user &&
                    getSender(loggedUser.user, chat?.users).image
                  ? getSender(loggedUser.user, chat?.users).image
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              className="img-fluid col-3 rounded-circle mx-auto d-block "
              style={{ width: "15%" }}
              alt="Photo"
            />

            <div className="flex w-100">
              <div className="name">
                {chat.isGroupChat
                  ? chat.chatName
                  : loggedUser &&
                    loggedUser.user &&
                    getSender(loggedUser.user, chat?.users).name}
              </div>
              <div className="lastchatbox">
                <div className="lastchattext">
                  {chat?.latestMessage?.content?.length <= 10
                    ? chat.latestMessage.content
                    : chat?.latestMessage?.content?.substring(0, 15)}
                </div>
                <div className="lastchaticons">
                  <FaRegEnvelopeOpen size={17} />
                  <FaRegStar size={20} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyChats;
