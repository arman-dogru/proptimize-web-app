import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div className="d-flex border p-2 mx-3 my-1 align-items-center rounded" onClick={handleFunction}>
      <img
        src={
          user?.image
            ? user.image
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        }
        className="img-fluid rounded-circle d-block"
        style={{ width: "10%" }}
        alt="No Photo"
      />
      <p className="fs-5">{user.name}</p>
    </div>
  );
};

export default UserListItem;
