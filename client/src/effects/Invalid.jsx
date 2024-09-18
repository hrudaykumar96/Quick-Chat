import { useEffect } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";


const Invalid = () => {

    /* document title */
    useEffect(()=>{
        document.title = 'Quick Chat | Invalid URL'
    },[]);

  return (
    <div className="invalid">
        <img src={logo} alt="logo" className="img-fluid" loading="lazy" />
        <h5>invalid url</h5>
        <Link to="/" className="btn btn-warning">homepage</Link>      
    </div>
  )
}

export default Invalid
