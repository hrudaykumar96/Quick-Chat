import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import propTypes from "prop-types";
import React from 'react';
import swal from "sweetalert";

const Navbar = React.memo(({ openpwdform, openchatform, data, setData, setSocket, setMessages, setReceiverid, setParticipant }) => {

    const location = useLocation();
    const navigate = useNavigate();

    /* logout function */
    const logout=()=>{
      localStorage.removeItem('token');
      setData([]);
      setSocket('');
      setMessages([]);
      setReceiverid(null);
      setParticipant([]);
      navigate('/');
      swal('Success!','logged out successfully', 'success');
    }

  return (
<nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container">
    { location.pathname === '/profile' ? null : (
  <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    )}
    <Link className="navbar-brand" to="/home"><span className="left">quick</span><span className="right">chat</span></Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`} aria-current="page" to="/home">Home</Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`} to="/profile">profile</Link>
        </li>
        { location.pathname === "/profile" ? null : (
        <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          { data?.success?.name}
        </a>
        <ul className="dropdown-menu">
          <li><Link className="dropdown-item" onClick={openpwdform}>change password</Link></li>
          <li><Link className="dropdown-item" onClick={openchatform}>new chat</Link></li>
          <li><Link className="dropdown-item" onClick={logout}>logout</Link></li>
        </ul>
      </li>
        )}
      </ul>
    </div>
  </div>
</nav>
  )
});

Navbar.displayName = 'Navbar'

Navbar.propTypes={
  openpwdform:propTypes.func,
  openchatform:propTypes.func,
  data:propTypes.any,
  setData:propTypes.any,
  setSocket:propTypes.any,
  setMessages:propTypes.any,
  setReceiverid:propTypes.any,
  setParticipant:propTypes.any,
}
export default Navbar