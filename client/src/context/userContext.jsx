import { createContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import io from "socket.io-client"

export const Usercontext = createContext();

const UserProvider = ({children})=>{
    const [data, setData] = useState([]);
    const [msg, setMsg] = useState('');
    const [socket, setSocket] = useState('');
    const [receiverid, setReceiverid] = useState(null);
    const [participant, setParticipant] = useState([]);
    const [messages, setMessages] = useState([]);
    const [id, setId] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            const socketIo = io('http://localhost:5000');
            setSocket(socketIo);

            return () => {
                socketIo.disconnect();
                setSocket(null);
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [token]);

    return(
        <Usercontext.Provider value={{ data, setData, msg, setMsg, socket, setSocket, receiverid, setReceiverid, participant, setParticipant, messages, setMessages, id, setId }}>
            {children}
        </Usercontext.Provider>
    )
}
UserProvider.propTypes={
    children:propTypes.any
}
export default UserProvider