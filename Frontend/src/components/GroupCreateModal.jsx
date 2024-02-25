import React, { useState } from "react";
import { toast } from "react-toastify";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import Loader from "./Loader";
import UserListItem from "./UserListItem";
import UserBadge from "./UserBadge";
import { IoIosArrowForward } from "react-icons/io";

const GroupCreateModal = () => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { user, chats, setChats } = ChatState();

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
  const handleSelectUser = (user) => {
    console.log(user);
    if (selectedUser.includes(user)) {
      toast.info("User already added to the Group");
      return;
    }
    setSelectedUser([...selectedUser, user]);
  };
  const handleRemoveUser = (user) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== user._id));
  };
  const handleSubmit = async () => {
    if (user.user.email === "guest@deLink.com") {
      toast.info("Guest cannot create groups");
      return;
    }
    if (
      selectedUser.map((u) => {
        if (u.email === "guest@deLink.com") {
          toast.info("Guest user can not be added in group");
        }
        return {};
      })
    )
      if (!groupChatName || !selectedUser) {
        toast.info("Please fill in all the required fields");
        return;
      }
    if (selectedUser.length <= 2) {
      toast.info("Group must have at least 3 members");
      return;
    }
    // create chat
    setSubmitLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const usersString = JSON.stringify(selectedUser.map((u) => u._id));
      const { data } = await axios.post(
        "/api/chats/group",
        { name: groupChatName, users: usersString },
        config
      );
      setChats([data, ...chats]);
      document.getElementById("closebtn").click()
      setSubmitLoading(false);
      toast.success(`${groupChatName} successfully created`);
      setSelectedUser([]);
    } catch (err) {
      toast.error(err);
      setSubmitLoading(false);
      return;
    }
  };
  return (
    <div
      class="modal fade"
      id="groupcreatemodal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header ">
            <h1 class="modal-title fs-3 w-100 text-center">Create Group</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="closebtn"
            ></button>
          </div>
          <div class="modal-body">
            <div class="input-group mb-1 mt-1 fw-bold">
              <input
                type="text"
                class="form-control"
                placeholder="Enter Group Name"
                aria-label="Chat Name"
                aria-describedby="button-addon2"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </div>
          </div>
          <div className="mx-3">
            <input
              type="text"
              placeholder="Add members to group"
              className="form-control"
              onChange={(e) => handleSearch(e.target.value)}
            />
            {selectedUser?.map((user) => (
              <UserBadge
                key={user._id}
                user={user}
                handleFunction={() => handleRemoveUser(user)}
              />
            ))}
          </div>

          <div
            className="d-flex flex-column mt-2 overflow-auto"
            style={{ height: "200px" }}
          >
            {loading ? (
              <Loader />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    width="100%"
                    key={user._id}
                    user={user}
                    handleFunction={() => handleSelectUser(user)}
                  />
                ))
            )}
          </div>

          <div class="modal-footer">
            <button
              class="btn btn-primary fw-bold w-100"
              type="button"
              onClick={handleSubmit}
              rightIcon={<IoIosArrowForward />}
              isLoading={submitLoading}
            >
              CREATE GROUP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCreateModal;
