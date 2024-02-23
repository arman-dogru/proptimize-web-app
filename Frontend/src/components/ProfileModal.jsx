import React, { useEffect } from "react";

const ProfileModal = ({ user }) => {
  
  useEffect(() => {
   console.log("useEffect", user) 
  }, [user]);
  return (
    <div
      class="modal fade"
      id="profilemodal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              class="modal-title fs-1 w-100 text-center"
              id="exampleModalLabel"
            >
              {user?.name}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body text-center">
            <img
              src={
                user?.image
                  ? user.image
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              className="img-fluid w-25 rounded-circle mx-auto d-block"
              alt="No Photo"
            />
          </div>
          <div class="modal-footer">
            <h3 className="fs-4 w-100 text-center">{user?.email}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal ;
