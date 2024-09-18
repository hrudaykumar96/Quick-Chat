import profile from "../assets/profile.png";
import propTypes from "prop-types";
import { useFormik } from "formik";
import * as yup from "yup";
import { searchuser } from "../services/api";
import { useEffect, useState } from "react";
import swl from "sweetalert";

const NewChat = ({ closechatform, sendmessage }) => {

  /* get token from localstorage */
  const token = localStorage.getItem('token');

  /* for api data */
  const[data, setData] = useState([]);

  /* form validation */
  const formik = useFormik({
    initialValues:{
      mobile: ''
    },
    validationSchema: yup.object({
      mobile: yup.string().required('enter mobile number').length(10,"enter valid mobile number")
    }),
    onSubmit:async(values)=>{
      const response = await searchuser({token, values})
      setData(response);
    }
  });

  /* alerts */
  useEffect(()=>{
    if(data){
      if(data?.mobile){
        formik.setErrors({mobile: data?.mobile})
      }
      else if(data?.error){
        swl("Error!", 'internal server error','error')
      }
    }
  },[data]);


  return (
    <div className="pwd-form">
      <form className="container" onSubmit={formik.handleSubmit}>
        <h5 className="text-center text-decoration-underline">search users to chat</h5>
        <div className="mb-3">
          <label htmlFor="mobile" className="form-label">mobile number</label><span className="text-danger">*</span>
          <input type="number" name="mobile" onBlur={formik.handleBlur} onChange={formik.handleChange} placeholder="enter mobile number" className="form-control" value={formik.values.mobile} style={formik.errors.mobile ? {border: '2px solid red'}:{}} />
          { formik.errors.mobile && <small className="text-danger">{formik.errors.mobile}</small>}
        </div>
        <div className="mb-3 d-flex justify-content-around">
          <input type="submit" value="search" className="btn btn-success" />
          <button type="button" className="btn btn-danger" onClick={closechatform}>cancel</button>
        </div>
        { data?.success && 
        <div className="d-flex justify-content-around align-items-center">
          <div className="pic d-flex align-items-center lh-1">
            { data?.success?.image ? (
              <img src={`http://localhost:5000/uploads/${data?.success?.image}`} alt="profile" className="img-fluid" loading="lazy" />
            ):(
              <img src={profile} alt="profile" className="img-fluid" loading="lazy" />
            )}
        <div className="info ms-3">
          <p>{data?.success?.name}</p>
          { data?.success?.status ?(
            <small className="text-success">online</small>
          ):(
            <small className="text-secondary">offline</small>
          )}
        </div>
        </div>
        <div className="button">
        <button type="button" className="btn btn-primary" onClick={()=>sendmessage(data?.success?._id)}>say hi <i className="fa-solid fa-paper-plane"></i></button>
        </div>
        </div>
        }
      </form>
    </div>
  )
}
NewChat.propTypes={
  closechatform:propTypes.func,
  sendmessage:propTypes.func,
}
export default NewChat
