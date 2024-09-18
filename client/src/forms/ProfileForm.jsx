import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as yup from "yup";
import { updateprofile } from "../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import swl from "sweetalert";

const ProfileForm = ({ closeprofileform, userdata }) => {

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  /* for api response */
  const [response, setResponse] = useState(null);

  /* Form validation  */
  const formik = useFormik({
    initialValues: {
      name: userdata?.success?.name,
      email: userdata?.success?.email,
      mobile: userdata?.success?.mobile,
      gender: userdata?.success?.gender,
      image: null
    },
    validationSchema: yup.object({
      name: yup.string().required('Enter your name').min(3, 'Name should be at least 3 characters'),
      email: yup.string().required('Enter email address').email('Enter a valid email'),
      mobile: yup.string().required('Enter mobile number').length(10, 'Enter a valid mobile number'),
      gender: yup.string().required('Select gender'),
      image: yup.mixed().nullable()
        .test('fileType', 'Only JPG, JPEG, and PNG files are allowed', value => {
          if (value && value instanceof File) {
            const validTypes = ['image/jpeg', 'image/png'];
            return validTypes.includes(value.type);
          }
          return true;
        })
    }),
    onSubmit: async(values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('mobile', values.mobile);
      formData.append('gender', values.gender);
      if (values.image) {
          formData.append('file', values.image);
      }
      const response = await updateprofile({token, formData});
      setResponse(response);
    }
  });

  /* alerts */
  useEffect(()=>{
    if(response){
      if(response.success){
        closeprofileform()
        navigate('/home')
        swl('Success!',response.success, 'success')
      }
      else if(response.error){
        swl('Error!','internal server error', 'error')
      }
      else if(response.email){
        formik.setErrors({email:response.email})
      } else if(response.mobile){
        formik.setErrors({mobile: response.mobile})
      }
    }
  },[response, navigate, closeprofileform]);


  return (
    <div className="pwd-form">
      <form className="container" onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label><span className="text-danger">*</span>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="form-control"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={formik.touched.name && formik.errors.name ? { border: '2px solid red' } : {}}
            />
            {formik.touched.name && formik.errors.name && (
              <small className="text-danger">{formik.errors.name}</small>
            )}
          </div>

          <div className="mb-3 col-lg-6 col-md-12">
            <label htmlFor="email" className="form-label">Email</label><span className="text-danger">*</span>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              className="form-control"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={formik.touched.email && formik.errors.email ? { border: '2px solid red' } : {}}
            />
            {formik.touched.email && formik.errors.email && (
              <small className="text-danger">{formik.errors.email}</small>
            )}
          </div>

          <div className="mb-3 col-lg-6 col-md-12">
            <label htmlFor="mobile" className="form-label">Mobile</label><span className="text-danger">*</span>
            <input
              type="text"
              name="mobile"
              placeholder="Enter mobile number"
              className="form-control"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={formik.touched.mobile && formik.errors.mobile ? { border: '2px solid red' } : {}}
            />
            {formik.touched.mobile && formik.errors.mobile && (
              <small className="text-danger">{formik.errors.mobile}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Gender</label><span className="text-danger">*</span><br />
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="male"
                value="male"
                checked={formik.values.gender === 'male'}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={formik.touched.gender && formik.errors.gender ? { border: '2px solid red' } : {}}
              />
              <label className="form-check-label" htmlFor="male">Male</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="female"
                value="female"
                checked={formik.values.gender === 'female'}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={formik.touched.gender && formik.errors.gender ? { border: '2px solid red' } : {}}
              />
              <label className="form-check-label" htmlFor="female">Female</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="transgender"
                value="transgender"
                checked={formik.values.gender === 'transgender'}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={formik.touched.gender && formik.errors.gender ? { border: '2px solid red' } : {}}
              />
              <label className="form-check-label" htmlFor="transgender">Transgender</label>
            </div><br />
            {formik.touched.gender && formik.errors.gender && (
              <small className="text-danger">{formik.errors.gender}</small>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">Profile Image</label>
            <input
              className="form-control"
              type="file"
              id="image"
              name="image"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                formik.setFieldValue('image', file);
                formik.setFieldError('image', formik.errors.image);
              }}
              onBlur={formik.handleBlur}
              style={formik.touched.image && formik.errors.image ? { border: '2px solid red' } : {}}
            />
            {formik.touched.image && formik.errors.image && (
              <small className="text-danger">{formik.errors.image}</small>
            )}
          </div>

          <div className="mb-3 d-flex align-items-center justify-content-around flex-wrap">
            <input type="submit" value="Update" className="btn btn-success" />
            <button type="button" className="btn btn-danger" onClick={closeprofileform}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
};

ProfileForm.propTypes = {
  closeprofileform: PropTypes.func.isRequired,
  userdata:PropTypes.any
};

export default ProfileForm;