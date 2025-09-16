import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Auth.css";
import axios from "axios";

const Login = () => {
  const [form, setform] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
  });
  const [submition, setsubmition] = useState(false);
  const navigate = useNavigate();

  function changeHandler(e) {
    const { name, value } = e.target;
    setform((prev) => ({ ...prev, [name]: value }));
  }

  async function handelSubmit(e) {
    e.preventDefault();
    setsubmition(true);
    console.log(form);

    axios.post("http://localhost:3000/auth/login", {
      email: form.email,
      password: form.password,
    },{
        withCredentials:true
    }).then((res) => {
        console.log(res.data);
        navigate('/') 
    }).catch((err) => {
        console.log('Register failed',err);
    })

    
  }

  return (
    <div className="center-min-h-screen">
      <div className="authCard">
        <header className="authHeader">
          <h1 id="registerHeading">sign in</h1>
          <p className="authSub">Welcome back. We've missed you..</p>
        </header>
        <form className="authForm" onSubmit={handelSubmit}>
          <div className="FielGroup">
            <label>email</label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={changeHandler}
              placeholder="Enter your email here"
            />
          </div>
          <div className="FielGroup">
            <label>Password</label>
            <input
              type="text"
              name="password"
              value={form.password}
              onChange={changeHandler}
              placeholder="Enter Your password"
            />
          </div>
          <button type="submit" disabled={submition} className="RegisterBtn">
            {submition ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="authAlt">Need an account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
};

export default Login;
