import React from "react";
import { IoIosClose } from "react-icons/io";

const UserBadge = ({ user, handleFunction }) => {
  return (
      <div className="bg-secondary fs-5 fw-normal rounded-pill py-1 px-2 m-2 d-inline-flex text-white">
        {user.name}
        <button type="button" className="ms-2 text-white" onClick={handleFunction}>
          {" "}
          <IoIosClose />
        </button>
      </div>
  );
};

export default UserBadge;
