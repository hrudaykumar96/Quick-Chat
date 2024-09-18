import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import profile from "../assets/profile.png";
import { Link, useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import { Usercontext } from "../context/userContext";
import { blockusers, deleteparticipant } from "../services/api";
import swal from "sweetalert";
import { participants, usermessages } from "../services/api";


const Sidebar = React.memo(({participant}) => {

    const offCanvasref = useRef(null);

    const navigate = useNavigate();

    const { setReceiverid, setParticipant, setId, id, setMessages } = useContext(Usercontext);

    const redirect=(id)=>{
      if(id){
        setReceiverid(id);
        navigate('/profile')
      }
    }

    const userID = id;

    const getidforconversion = (id)=>{
      setId(id)
    }



    const [searchName, setSearchName] = useState('');
    const token = localStorage.getItem('token');

    const blockuser = async ({id, participantID}) => {
      try {
          const willBlock = await swal({
              title: "Are you sure you want to block this user?",
              text: "This action will prevent the user from interacting with you.",
              icon: "warning",
              buttons: true,
              dangerMode: true,
          });
  
          if (willBlock) {
              const response = await blockusers({ token, id });
              if (response.success) {
                const response = await deleteparticipant({ token, id:participantID });
                if(response.success){
                  setParticipant(response.success)
                }
                if(userID){
                const userresponse = await usermessages({token, id:userID });
                if(userresponse.success){
                  setMessages(userresponse.success)
                }
              }
                  await swal("Blocked!", "The user has been blocked.", "success");
              } else if (response.error) {
                  await swal({
                      title: "Error!",
                      text: response.error,
                      icon: "error",
                      buttons: {
                          cancel: true,
                          confirm: true
                      }
                  });
              }
          }
      } catch (error) {
        if(error){
          await swal({
            title: "Error!",
            text: "An unexpected error occurred.",
            icon: "error",
            buttons: {
                cancel: true,
                confirm: true
            }
        });
        }          
      }
  };



    const filtereddata = () => {
      if (!participant || !searchName.trim()) return participant;
  
      return participant.filter(person =>
        person.name.toLowerCase().includes(searchName.toLowerCase())
      );
    };

    /* for responsive sidebar */
    useLayoutEffect(() => {
        const handleResize = () => {
          if (offCanvasref.current) {
            if (window.innerWidth < 992) {
                offCanvasref.current.classList.remove('show');
            } else {
              offCanvasref.current.classList.add('show');
            }
          }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      /* delete participant */
      const deleteconversation = async (id) => {
        try {
            // Show confirmation dialog to the user
            const willDelete = await swal({
                title: "Are you sure?!",
                text: "Once deleted, you will not be able to recover this!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            });
    
            if (willDelete) {
                const response = await deleteparticipant({ token, id });
                if (response.success) {
                  const response = await participants(token);
                  if(response.success){
                    setParticipant(response.success)
                  }
                  if(userID){
                    const userresponse = await usermessages({token, id:userID });
                    if(userresponse.success){
                      setMessages(userresponse.success)
                    }
                  }
                    await swal("Deleted!", "The conversation has been deleted.", "success");
                } else if (response.error) {
                    await swal({
                        title: "Error!",
                        text: response.error,
                        icon: "error",
                        buttons: {
                            cancel: true,
                            confirm: true
                        }
                    });
                }
            }
        } catch (error) {
          if(error){
            await swal({
              title: "Error!",
              text: "An unexpected error occurred.",
              icon: "error",
              buttons: {
                  cancel: true,
                  confirm: true
              }
          });
          }
        }
    };

  return (
      <div className="offcanvas offcanvas-start show" tabIndex="-1" id="offcanvas" aria-labelledby="offcanvasLabel" ref={offCanvasref}>
  <div className="offcanvas-header">
    <input type="search" name="search" onChange={(e)=>setSearchName(e.target.value)} className="form-control" placeholder="search" />
    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div className="offcanvas-body">
  <ul className="list-group">
    { filtereddata() && filtereddata().length === 0 ? (
      <p className="text-center text-danger">no participants found</p>
    ):(
      filtereddata().map && filtereddata().map((item, index)=>(
        


<li className="list-group-item" key={index} >
    <div className="d-flex align-items-center">
    <div className="pic">
      <Link className="text-dark" onClick={()=>getidforconversion(item._id)}>
      { item.image ?(
        <img src={`http://localhost:5000/uploads/${item?.image}`} alt="profile" className="img-fluid" />
      ):(
        <img src={profile} alt="profile" className="img-fluid" />
      )}
    </Link>
    </div>
    <div className="d-flex justify-content-between w-100 align-items-center">
      <Link className="text-dark"  onClick={()=>getidforconversion(item._id)}>
    <div className="info ms-2">
        <span>{item?.name}</span><br />
        { item?.status ? (
                <small className="text-success">online</small>  
        ):(
          <small className="text-secondary">offline</small>
        )}
    </div>
    </Link>
    <div className="time">
    <small className="text-dark">
  {item?.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'No Date Available'}
</small>
    <div className="dropdown">
  <button className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
  </button>
  <ul className="dropdown-menu">
    <li><button className="dropdown-item" type="button" onClick={()=>redirect(item._id)}>profile</button></li>
    <li><button className="dropdown-item" type="button" onClick={()=>blockuser({id:item._id, participantID:item.participantId})}>block</button></li>
    <li><button className="dropdown-item" onClick={()=>deleteconversation(item.participantId)}>delete chat</button></li>
  </ul>
</div>
    </div>
    </div>
    </div>
  </li>

      ))
    )}
  
</ul>
  </div>
</div>
  )
});

Sidebar.displayName = 'Navbar';
Sidebar.propTypes={
  participant: propTypes.any
}
export default Sidebar