import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Auth.css";

const Register = () => {
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

    await axios.post("https://chat-gpt-clone-epy3.onrender.com/auth/register", {
      email: form.email,
      fullname: {
        firstname: form.firstname,
        lastname: form.lastname,
      },
      password: form.password,
    },{
        withCredentials:true
    }).then((res) => {
        console.log(res.data);
        navigate('/login') 
    }).catch((err) => {
        console.log('Register failed',err);
    })

    
  }

  return (
    <div className="center-min-h-screen">
      <div className="authCard">
        <header className="authHeader">
          <h1 id="registerHeading">Create account</h1>
          <p className="authSub">Join us and start exploring.</p>
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
          <div className="Grid">
            <div className="FielGroup">
              <label>FirstName</label>
              <input
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={changeHandler}
                placeholder="Enter Name"
              />
            </div>
            <div className="FielGroup">
              <label>LastName</label>
              <input
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={changeHandler}
                placeholder="Enter Name"
              />
            </div>
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
            {submition ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="authAlt">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};

export default Register;
