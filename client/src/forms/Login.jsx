import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useFormik } from "formik";
import * as yup from "yup";
import { loginpuser } from "../services/api";
import swal from "sweetalert";
import ButtonLoader from "../effects/ButtonLoader";


const Login = () => {

    const navigate = useNavigate();

    /* document title */
    useEffect(()=>{
        document.title = 'Quick Chat | Login'
    },[]);

    /* for loading */
    const [loading, setLoading] = useState(false);

    /* for api response */
    const [response, setResponse] = useState(null);

    /* login form validation */
    const formik = useFormik({
        initialValues:{
            email:'', password:''
        },
        validationSchema: yup.object({
            email: yup.string().required('enter email address').email('enter valid email'),
            password: yup.string().required('enter password').min(5,'password should be atleast 5 characters').max(15, 'password should not exceeds greater than 15 characters'),
        }),
        onSubmit:async(values)=>{
            setLoading(true);
            const response = await loginpuser(values);
            setResponse(response);
            setLoading(false);
        }
    });

    /* alerts */
    useEffect(()=>{
        if(response){
            if(response.success){
                localStorage.setItem("token", response.success);
                formik.resetForm();
                navigate('/home');
            }
            else if(response.email){
                formik.setErrors({email: response.email})
            }
            else if(response.password){
                formik.setErrors({password:'response.password'})
            }
            else{
                swal("Error!", 'internal server error', "error");
            }
        }
    },[response]);

  return (
    <div className="authentication-form">
        <form className="container" onSubmit={formik.handleSubmit}>
            <img src={logo} alt="logo" className="img-fluid mx-auto d-block" loading="lazy" />
            <div className="mb-3">
                <label htmlFor="email" className="form-label">email</label><span className="text-danger">*</span>
                <input type="email" name="email" placeholder="enter email address" value={formik.values.email} className="form-control" onBlur={formik.handleBlur} onChange={formik.handleChange} required style={formik.errors.email ? {border:'2px solid red'}: {}}/>
                { formik.errors.email && <small className="text-danger">{formik.errors.email}</small>}
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">password</label><span className="text-danger">*</span>
                <input type="password" name="password" value={formik.values.password} placeholder="enter password" className="form-control" required onBlur={formik.handleBlur} onChange={formik.handleChange} style={formik.errors.password ? {border: '2px solid red'}:{}}/>
                { formik.errors.password && <small className="text-danger">{formik.errors.password}</small>}
            </div>
            { loading ? (
                <ButtonLoader/>
            ):(
                <>
            <div className="mb-3 d-flex align-items-center justify-content-around flex-wrap">
                <input type="submit" value="login" className="btn btn-primary"/>
                <Link to="/resetpassword">forgot password</Link>
            </div>
            <div className="mb-3">
                <Link to="/signup" className="btn btn-success w-100">create account</Link>
            </div>
                </>
            )}
        </form>
      
    </div>
  )
}

export default Login
