import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";

const Navbar = () => {
  const { user } = ChatState();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("deLinkUser");
    navigate("/");
  };

  return (
    <div className="navbar pt-0 ">
      <nav class="navbar navbar-expand-md navbar-dark bg-primary">
        <a class="navbar-brand text-white fw-bold fs-2 ps-2 " href="/">
          Chat Application
        </a>
        <button
          class="navbar-toggler pe-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul class="navbar-nav pe-3 fs-4 primary">
            <li class="nav-item dropdown ps-2">
              <button
                class="nav-link dropdown-toggle pe-5 text-white"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {user?.user?.name}
              </button>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <button
                  type="button"
                  class="dropdown-item btn "
                  data-bs-toggle="modal"
                  data-bs-target="#profilemodal"
                >
                  Profile
                </button>
                <button class="dropdown-item" onClick={logoutHandler}>
                  Logout
                </button>
              </div>
              <ProfileModal user={user?.user} />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
