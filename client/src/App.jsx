import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { lazy, Suspense } from "react";
import Loader from "./effects/Loader";
const Invalid = lazy(()=> import ('./effects/Invalid'));
const Login = lazy(()=> import ("./forms/Login"));
const Signup = lazy(()=> import ("./forms/Signup"));
const ResetForm = lazy(()=> import ('./forms/ResetForm'));
const Home = lazy(()=>import('./pages/Home'));
const Profile = lazy(()=>import('./pages/Profile'));


const App = () => {
  return (
    <BrowserRouter>
        <Suspense fallback={<Loader/>}>
           <Routes>
            <Route path="*" element={<Invalid/>}/>
            <Route path="/" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/resetpassword" element={<ResetForm/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/profile" element={<Profile/>}/>
          </Routes>  
        </Suspense>
    </BrowserRouter>
  )
}

export default App
