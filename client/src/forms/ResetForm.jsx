import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import swl from "sweetalert";
import { updatepassword } from "../services/api";
import ButtonLoader from "../effects/ButtonLoader";

const ResetForm = () => {

    /* document title */
    useEffect(()=>{
        document.title = 'Quick Chat | Reset Password'
    },[]);

      /* to store api response */
    const [response, setResponse] = useState(null);
    /* loading */
    const [loading, setLoading] = useState(false);

      /* form validation */
    const formik = useFormik({
        initialValues:{
        email:'', password:'', confirm_password:''
     },
        validationSchema: yup.object({
        email: yup.string().required('enter email address').email('enter valid email'),
            password: yup.string().required('enter password').min(5,'password should be atleast 5 characters').max(15, 'password should not exceeds greater than 15 characters'),
            confirm_password: yup.string().required('enter confirm password').oneOf([yup.ref('password')],'password does not match with confirm password')
        }),
        onSubmit:async(values)=>{
          setLoading(true);
          const response = await updatepassword(values);
          setResponse(response);
          setLoading(false);
     }
    });

      /* alerts */
  useEffect(()=>{
    if(response){
      if(response.success){
        swl('Success!', response.success, 'success');
        formik.resetForm();
      } else if(response.error){
        swl('Error!', 'internal server error', 'error')
      } else if(response.email){
        formik.setErrors({email: response.email})
      }
    }
  },[response]);
    
  return (
    <div className="authentication-form">
        <form className="container" onSubmit={formik.handleSubmit}>
            <img src={logo} alt="" loading="lazy"/>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">email</label><span className="text-danger">*</span>
                <input type="email" name="email" placeholder="enter email address" className="form-control" required value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={formik.errors.email ? { border: '2px solid red'}:{}}
          />
          { formik.errors.email && <small className="text-danger">{formik.errors.email}</small>}
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">password</label><span className="text-danger">*</span>
                <input type="password" name="password" placeholder="enter password" className="form-control" required             value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={formik.errors.password ? { border: '2px solid red'}:{}}
          />
          { formik.errors.password && <small className="text-danger">{formik.errors.password}</small>}
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">confirm password</label><span className="text-danger">*</span>
                <input type="password" name="confirm_password" placeholder="enter confirm password" className="form-control"             value={formik.values.confirm_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={formik.errors.confirm_password ? { border: '2px solid red'}:{}}
          />
          { formik.errors.confirm_password && <small className="text-danger">{formik.errors.confirm_password}</small>}
            </div>
            { loading ? (<ButtonLoader/>):(
            <div className="mb-3 d-flex align-items-center justify-content-around flex-wrap">
            <input type="submit" value="Change Password" className="btn btn-success" />
            <Link to="/" className="text-dark btn">back to login</Link>
          </div>
            )}
        </form>      
    </div>
  )
}

export default ResetForm
