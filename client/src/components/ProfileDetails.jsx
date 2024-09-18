import React from 'react';
import profile from "../assets/profile.png";
import propTypes from "prop-types";
import { Link, useNavigate } from 'react-router-dom';
import { unblockusers } from '../services/api';
import swal from "sweetalert";

const ProfileDetails = React.memo(({ openprofileform, userdata, hidebutton }) => {

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const unblock = async(id)=>{
    const response = await unblockusers({token, id})
    if(response.success){
      navigate('/home')
      swal('Success!', response.success, 'success')
    }
    else{
      swal('Error!', 'internal server error', 'error')
    }
  };

  return (
    <div className='profile-section'>
        <div className="pic">
          { userdata?.success?.image ? (
            <img src={`http://localhost:5000/uploads/${userdata?.success?.image}`} alt='profile' className='img-fluid' loading='lazy'/>
          ):(
            <img src={profile} alt="profile" className='img-fluid' loading='lazy'/>
          )}
      </div>
      <div className="info">
        <p><strong>name:</strong> <span>{userdata?.success?.name}</span></p>
        <p><strong>email:</strong> <span className='email'>{userdata?.success?.email}</span></p>
        <p><strong>mobile number:</strong> <span>{userdata?.success?.mobile}</span></p>
        <p><strong>gender:</strong> <span>{userdata?.success?.gender}</span></p>
        { hidebutton && 
        <button type="button" className='btn btn-secondary' onClick={openprofileform}>edit profile</button>
      }
        <Link to="/home" className='btn btn-danger'>back to home</Link>
      </div>
      { hidebutton && 
      <div className="blocked-section">
  {userdata?.success?.blocked?.length > 0 ? (
    <ul className='list-group'>
      <h5 className='text-center'>blocked contacts</h5>
      {userdata?.success?.blocked?.map((item, index) => (
        <li className='list-group-item lh-1' key={index}>
          <div className="d-flex flex-wrap justify-content-center align-items-center">
              { item.image ? (
                <img src={`http://localhost:5000/uploads/${item.image}`} alt="profile" className="img-fluid profile-img" loading="lazy" />
              ) : (
                <img src={profile} alt="profile" className="img-fluid profile-img" loading="lazy" />
              )}
              <div className="ms-3">
                <p className='text-wrap name'>{item.name}</p>
                <p className='email text-wrap'>{item.email}</p>
                <p>{item.mobile}</p>
                <button type="button" className="btn btn-primary w-100" onClick={()=>unblock(item._id)}>Unblock</button>
              </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p></p>
  )}
</div>
      }
    </div>
  )
});

ProfileDetails.displayName = 'ProfileDetails'

ProfileDetails.propTypes ={
  openprofileform:propTypes.func,
  userdata: propTypes.any,
  hidebutton: propTypes.bool,
}
export default ProfileDetails