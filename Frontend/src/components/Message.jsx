import React from "react";
import ScrollableFeed from "react-scrollable-feed";

const Message = ({ message }) => {
  console.log(message)
  return (
    <div className="message">
      <div className="messagesender">
        <div className="avatar ">
          <img
            src={message?.sender?.image ? message.sender.image :"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
            alt="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          />
        </div>
        <div className="sender">{message?.sender?.name}</div>
        <div>
          {message?.createdAt
            ? new Date(message.createdAt).toDateString() +
              " " +
              new Date(message.createdAt).toLocaleTimeString()
            : "Date"}
        </div>
      </div>
      <div className="messagetext ">{message?.content}</div>
    </div>
  );
};

export default Message;
