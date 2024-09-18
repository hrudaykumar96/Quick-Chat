import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { signupuser } from "../services/api";
import swal from 'sweetalert';
import ButtonLoader from "../effects/ButtonLoader";


const Signup = () => {

    /* document title */
    useEffect(()=>{
        document.title = 'Quick Chat | Registration'
    },[]);

    /* for loading */
    const[loading, setLoading] = useState(false);

    /* for api response */
    const [response, setResponse] = useState(null);

    /* signup form validation */
    const formik = useFormik({
      initialValues:{
        name:'', email:'', mobile:'', gender:'',password:'', confirm_password:''
      },
      validationSchema: yup.object({
        name: yup.string().required('enter your name').min(3,'name should be atleast 3 characters'),
        email: yup.string().required('enter email address').email('enter valid email'),
        mobile: yup.string().required('enter mobile number').length(10,"enter valid mobile number"),
        gender: yup.string().required('select gender'),
        password: yup.string().required('enter password').min(5,'password should be atleast 5 characters').max(15, 'password should not exceeds greater than 15 characters'),
        confirm_password: yup.string().required('enter confirm password').oneOf([yup.ref('password')],'password does not match with confirm password')
      }),
      onSubmit:async(values)=>{
        setLoading(true);
        const response = await signupuser(values);
        setResponse(response);
        setLoading(false);
      }
    });


    /* for alerts */
    useEffect(()=>{
      if(response){
        if(response.success){
          swal("Success!", response.success, "success");
          formik.resetForm();
        }
        else if(response.email){
          formik.setErrors({email:response.email})
        }
        else if(response.mobile){
          formik.setErrors({mobile:response.mobile})
        }
        else {
          swal("Error!", 'internal server error', "error");
        }
      }
    },[response]);

  return (
    <div className="authentication-form">
      <form className="container" onSubmit={formik.handleSubmit}>
      <img src={logo} alt="logo" className="img-fluid mx-auto d-block" loading="lazy" />
      <div className="row">
            <div className="mb-3">
                <label htmlFor="name" className="form-label">name</label><span className="text-danger">*</span>
                <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="enter your name" className="form-control" required style={formik.errors.name ? {border: '2px solid red'}:{}}/>
                { formik.errors.name && <small className="text-danger">{formik.errors.name}</small>}
            </div>
            <div className="mb-3 col-lg-6 col-md-12">
                <label htmlFor="email" className="form-label">email</label><span className="text-danger">*</span>
                <input type="email" name="email" value={formik.values.email} onBlur={formik.handleBlur} onChange={formik.handleChange} placeholder="enter email address" className="form-control" required style={formik.errors.email ? {border: '2px solid red'}:{}}/>
                { formik.errors.email && <small className="text-danger">{formik.errors.email}</small>}
            </div>
            <div className="mb-3 col-lg-6 col-md-12">
                <label htmlFor="mobile" className="form-label">mobile</label><span className="text-danger">*</span>
                <input type="number" name="mobile" value={formik.values.mobile} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="enter mobile number" className="form-control" required style={formik.errors.mobile ? {border: '2px solid red'}:{}}/>
                { formik.errors.mobile && <small className="text-danger">{formik.errors.mobile}</small>}
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">gender</label><span className="text-danger">*</span><br />
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" checked={formik.values.gender === 'male'} name="gender" id="male" value="male" onChange={formik.handleChange} onBlur={formik.handleBlur} style={formik.errors.gender ? {border:'2px solid red'}:{}}/>
                  <label className="form-check-label" htmlFor="inlineRadio1">male</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" checked={formik.values.gender === 'female'} name="gender" id="female" value="female" onChange={formik.handleChange} onBlur={formik.handleBlur} style={formik.errors.gender ? {border:'2px solid red'}:{}}/>
                  <label className="form-check-label" htmlFor="inlineRadio2">female</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" checked={formik.values.gender === 'transgender'} id="transgender" value="transgender" onChange={formik.handleChange} onBlur={formik.handleBlur} style={formik.errors.gender ? {border:'2px solid red'}:{}}/>
                  <label className="form-check-label" htmlFor="inlineRadio3">transgender</label>
                </div><br />
                { formik.errors.gender && <small className="text-danger">{formik.errors.gender}</small>}
            </div>
            <div className="mb-3 col-lg-6 col-md-12">
                <label htmlFor="password" className="form-label">password</label><span className="text-danger">*</span>
                <input type="password" name="password" placeholder="enter password" className="form-control" required value={formik.values.password} onBlur={formik.handleBlur} onChange={formik.handleChange} style={formik.errors.password ? {border : '2px solid red'}:{}}/>
                { formik.errors.password && <small className="text-danger">{formik.errors.password}</small>}
            </div>
            <div className="mb-3 col-lg-6 col-md-12">
                <label htmlFor="password" className="form-label">confirm password</label><span className="text-danger">*</span>
                <input type="password" name="confirm_password" placeholder="enter confirm password" className="form-control" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.confirm_password} style={formik.errors.confirm_password ? {border:'2px solid red'}:{}}/>
                { formik.errors.confirm_password && <small className="text-danger">{formik.errors.confirm_password}</small>}
            </div>
            { loading ? (
              <ButtonLoader/>
            ): (
              <div className="mb-3 d-flex align-items-center justify-content-around flex-wrap">
              <input type="submit" value="signup" className="btn btn-success" />
              <Link to="/" className="text-dark btn">already have an account</Link>
            </div>
            )}
            </div>
      </form>
    </div>
  )
}

export default Signup
