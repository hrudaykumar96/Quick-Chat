import React, { useContext, useEffect, useRef } from "react";
import { Usercontext } from "../context/userContext";
import propTypes from "prop-types";
import { usermessages } from "../services/api";
import logo from "../assets/logo.png";

const Messages = React.memo(({ sendmessagetouser }) => {
  const { msg, setMsg, messages, setMessages, data, id } = useContext(Usercontext);
  const token = localStorage.getItem('token');
  const currentMessage = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (id) {
          const response = await usermessages({ token, id });
          if (response && response.success) {
            setMessages(response.success);
          } else {
            console.error("Failed to fetch messages:", response.message);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [id, token, setMessages]);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className='messages'>
      {messages.length === 0 ? (
        <div className="empty-data">
          <h5 className="text-center text-primary">You can start a conversation</h5>
          <img src={logo} alt="logo" className="img-fluid" loading="lazy" />
        </div>
      ) : (
        messages.map((group, index) => (
          <div className="message-group" key={`${group.date}-${index}`}>
            <div className="date mb-3">
              <small className="text-uppercase">{new Date(group.date).toLocaleDateString()}</small>
            </div>
            {group.messages.map((message) => (
              <React.Fragment key={message._id}>
                {!message.isread && (
                  <p className="text-center text-secondary" key={`unread-${message._id}`}>
                    Unread Messages
                  </p>
                )}
                <div
                  className={`message ${message.sender === data?.success?._id ? 'sender' : 'receiver'}`}
                  key={message._id}
                >
                  <p>{message.message}</p>
                  <hr />
                  <small className="text-uppercase">{new Date(message.createdAt).toLocaleTimeString()}</small>
                </div>
              </React.Fragment>
            ))}
          </div>
        ))
      )}

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={msg}
          disabled={messages.length === 0}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message"
          aria-label="Type a message"
        />
        <button
          className="btn btn-success"
          type="button"
          id="button-addon2"
          disabled={msg.length === 0}
          onClick={sendmessagetouser}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
      <div ref={currentMessage}></div>
    </div>
  );
});

Messages.displayName = 'Messages';

Messages.propTypes = {
  sendmessagetouser: propTypes.func.isRequired,
};

export default Messages;