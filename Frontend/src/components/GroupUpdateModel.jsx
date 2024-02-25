import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import UserBadge from "./UserBadge";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "./Loader";
import UserListItem from "./UserListItem";
import { useNavigate } from "react-router-dom";
const GroupUpdateModel = ({ fetchAgain, setFetchAgain, fetchAllMessages }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { selectedChat, user, setSelectedChat } = ChatState();
  const navigate = useNavigate();

  const handleRemoveUser = async (userToBeRemoved) => {
    if (user.user._id !== selectedChat.groupAdmin._id) {
      toast.info("Only Admins can add/remove member");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chats/groupremove`,
        {
          userId: userToBeRemoved._id,
          chatId: selectedChat._id,
        },
        config
      );

      userToBeRemoved._id === user._d
        ? setSelectedChat()
        : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchAllMessages();
      setLoading(false);
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    setRenameLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chats/grouprename",
        { chatName: groupChatName, chatId: selectedChat._id },
        config
      );
      toast.info(`Group name successfully changed to ${data.chatName}`);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (err) {
      toast.error(err);
      setRenameLoading(false);
      return;
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      // ? if query string is empty
      toast.info("please search to add users");
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
  const handleAddMember = async (userToAdd) => {
    if (userToAdd.email === "guest@deLink.com") {
      toast.info("\nGuest user can not be a part of group");
      return;
    }
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast.info("User already present in the group");
      return;
    }
    if (user.user._id !== selectedChat.groupAdmin._id) {
      toast.info("Only Admins can add/remove member");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chats/groupadd`,
        {
          userId: userToAdd._id,
          chatId: selectedChat._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };
  const handleRemove = async (userToBeRemoved) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(
        `/api/chats/groupremove`,
        {
          userId: userToBeRemoved.user._id,
          chatId: selectedChat._id,
        },
        config
      );
      setSelectedChat();
      setFetchAgain(!fetchAgain);
      fetchAllMessages();
      setLoading(false);
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };

  return (
    <div
      class="modal fade"
      id="groupupdatemodal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header ">
            <h1
              class="modal-title fs-2 w-100 text-center"
              id="staticBackdropLabel"
            >
              {selectedChat.chatName}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <span>Group Members</span>
            <br />
            {selectedChat?.users?.map((user) => (
              <UserBadge
                key={user._id}
                user={user}
                handleFunction={() => handleRemoveUser(user)}
              />
            ))}
            <div class="input-group mb-1 mt-1 fw-bold">
              <input
                type="text"
                class="form-control"
                placeholder="Chat Name"
                value={groupChatName}
                aria-label="Chat Name"
                aria-describedby="button-addon2"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <button
                class="btn btn-primary rounded-end fw-bold"
                type="button"
                id="button-addon2"
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </button>
            </div>
          </div>
          <div className="mx-3">
            <input
              type="text"
              placeholder="Add members to group"
              className="form-control"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          {/* {searchResult?.map((user) => console.log(user))} */}
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <Loader />
            </div>
          ) : (
            <div
              className="d-flex flex-column mt-2 overflow-auto"
              style={{ height: "200px" }}
            >
              {searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddMember(user)}
                />
              ))}
            </div>
          )}

          <div class="modal-footer">
            <button
              class="btn btn-light w-100"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#warningMessage"
              aria-expanded="false"
              aria-controls="warningMessage"
            >
              LEAVE GROUP
            </button>
            <div class="collapse" id="warningMessage">
              By Leaving the Group, you will not be able to access old chat and
              all the chat media will be deleted as well
              <button
                class="btn btn-danger w-100"
                onClick={() => handleRemove(user)}
                type="button"
              >
                LEAVE GROUP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupUpdateModel;
