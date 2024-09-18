import { useCallback, useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileDetails from "../components/ProfileDetails";
import ProfileForm from "../forms/ProfileForm";
import { profiledata } from "../services/api";
import { Usercontext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import Loader from "../effects/Loader";

const Profile = () => {

  /* globaldata */
  const { data, receiverid, setReceiverid } = useContext(Usercontext);

  const navigate = useNavigate('/home');

  /* get token from localstorage */
  const token = localStorage.getItem('token');


  /* for profile change form */
  const [profileform, setProfileForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userdata, setUserdata] = useState([]);
  const [hidebutton, setHidebutton] = useState(false);

  useEffect(()=>{
    if(data?.success?._id === userdata?.success?._id ){
      setHidebutton(true)
    } else {
      setHidebutton(false)
    }
  },[data, userdata]);

  /* open profile form */
  const openprofileform=useCallback(()=>{
    setProfileForm(true);
  },[]);

  /* close profile form */
  const closeprofileform=useCallback(()=>{
    setProfileForm(false);
  },[]);

  /* fetch profile data */
  useEffect(()=>{
    const fetchprofiledata=async()=>{
      if(!receiverid){
        if(data?.success){
          const response = await profiledata({token, id:data?.success?._id});
          setUserdata(response)
        }
        else if(!data?.success){
          navigate('/home');
          setUserdata([]);
        } else if(!token){
          navigate('/')
        } else if(receiverid){
          const response = await profiledata({token, id:data?.success?._id});
          setUserdata(response)
        }
       } else {
          const response = await profiledata({token, id:receiverid});
          setUserdata(response)
        }
        setLoading(false)
      } 
      fetchprofiledata()
      return()=>{
        setReceiverid('')
      }

  },[data, token, navigate, receiverid, setReceiverid]);

  /* show loading loading spinner when data loading */
  if(loading) return(<Loader/>)

  return (
    <div>
      <Navbar/>
      <ProfileDetails openprofileform={openprofileform} userdata={userdata} hidebutton={hidebutton}/>
      { profileform && 
      <ProfileForm closeprofileform={closeprofileform} userdata={userdata}/>
    }
    </div>
  )
}

export default Profile
