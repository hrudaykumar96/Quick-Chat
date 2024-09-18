import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Messages from "../components/Messages";
import PasswordForm from "../forms/PasswordForm";
import { useCallback, useContext, useEffect, useState } from "react";
import NewChat from "../forms/NewChat";
import { userdata } from "../services/api";
import Loader from "../effects/Loader";
import { Usercontext } from "../context/userContext";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { participants, usermessages } from "../services/api";

const Home = () => {

    /* get token from localstorage */
    const token = localStorage.getItem('token');

    /* for password change form */
  const [pwdform, setPwdform] = useState(false);

  /* for new chat form */
  const [chatform, setChatForm] = useState(false);

  /* to open password change form */
  const openpwdform=useCallback(()=>{
    setPwdform(true)
  },[]);

  /* to close password change form */
  const closepwdform=useCallback(()=>{
    setPwdform(false)
  },[]);

  /* to open chat form */
  const openchatform=useCallback(()=>{
    setChatForm(true)
  },[]);

  /* to close chat form */
  const closechatform=useCallback(()=>{
    setChatForm(false)
  },[]);

    /* use context to set userdata globally */
    const { data, setData, msg, setMsg, socket, setSocket, participant, setParticipant, setReceiverid, messages, setMessages, id } = useContext(Usercontext);

    const location = useLocation();

  /* send message */

    const sendmessage=useCallback(async(id)=>{
      if(token && socket){
      socket.emit('register', data?.success?._id);
      const new_message = {
        sender: data?.success?._id, receiver:id ,message: "hi"
      }
      socket.emit('send message', new_message);
      const response = await usermessages({token, id});
      setMessages(response.success)
      closechatform();
    }
    },[socket, data, token, closechatform, setMessages]);

  const navigate = useNavigate();

  /* handle incoming messages */
  useEffect(() => {
    if (socket) {
      const handleMessage = async (message) => {
        if (message) {
            const response = await usermessages({ token, id });
            if (response.success) {
              setMessages(response.success)
            }
        }
      };
  
      // Register the event handler
      socket.on('receive message', handleMessage);
  
      return () => {
        socket.off('receive message', handleMessage);
      };
    }
  }, [socket, token, id, setMessages]); 
  


useEffect(() => {
  if(token && socket){
  if (data?.success?._id) {
    socket.emit('register', data.success._id);
  }
}
}, [data, token, socket]);

  /* document title */
  useEffect(()=>{
    document.title = 'Quick Chat | Home'
  },[]);

  /* for loading */
  const[loading, setLoading] = useState(true);

  /* login user data */
  useEffect(()=>{
    const fetchuserdata=async()=>{
      if(token){
        const response = await userdata(token);
        setData(response);
        if(response.success){
          setLoading(false);
        }
        else if(response.error){
          navigate('/')
          localStorage.removeItem('token');
          setData([]);
          swal("Error!", 'internal server error', "error");
        }

      }
    }
    fetchuserdata()
  },[token, setData, loading, navigate]);

  /* restrict allowint to home without proper authentication */
  useEffect(()=>{
    if(token){
      navigate('/home')
    } else {
      navigate('/')
    }
  },[token, navigate]);

  /* participants */
  useEffect(()=>{
    if(token && socket){
    socket.on('update online users',async(user)=>{
      if(user){
      const response = await participants(token);
      if(response.success){
        setParticipant(response.success)
      }
    }
    return()=>{
      socket.off('update online users');
    }
    })
  }
  },[token, socket, setParticipant]);

  const sendmessagetouser=useCallback(async()=>{
    if(token && socket && id ){
      socket.emit('register', data?.success?._id);
      socket.emit('send message', {
        sender: data?.success?._id, receiver:id ,message: msg
      });
      const response = await usermessages({token, id});
        setMessages(response.success);      

      setMsg('');
    }
  },[socket, data, token, id, msg, setMessages, setMsg]);
  

  /* show loading loading spinner when data loading */
  if(loading) return(<Loader/>)

  return (
    <div className="h-100">
    <Navbar openpwdform={openpwdform} openchatform={openchatform} data={data} setData={setData} setSocket={setSocket} setParticipant={setParticipant} setReceiverid={setReceiverid} setMessages={setMessages}/>
    <div className="d-flex w-100">
      { location.pathname === '/profile' ? null : (
    <Sidebar participant={participant}/>
    )}
    <Messages  sendmessagetouser={sendmessagetouser}/>
    </div>
    { pwdform && 
    <PasswordForm closepwdform={closepwdform} data={data}/>
  }
  { chatform && 
  <NewChat closechatform={closechatform} sendmessage={sendmessage} setMsg={setMsg}/>
}
    </div>
  )
}

export default Home
