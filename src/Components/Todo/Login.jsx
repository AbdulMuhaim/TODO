import { Button } from "antd";
import backgroundImage from "../../../public/Data_security_05.jpg";
import { GoogleOutlined } from "@ant-design/icons";
import logo from "../../../public/Screenshot 2024-03-22 174558.png";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import Home from "./Home";

function Login() {

  const [value, setValue] = useState("");

  const handleClick = () => {
      signInWithPopup(auth, provider).then((data) => {
      setValue(data.user.email);
      localStorage.setItem("email", data.user.email);
    });
  };

  useEffect(()=>{
    setValue(localStorage.getItem('email'))
  },[])

  return ( 
  <>
   { value ? <Home/> : <div className="md:w-full md:h-full h-auto w-auto flex flex-wrap p-10">
      <div className="md:w-1/2 w-full h-1/2 flex items-center justify-center flex-col">
        <div className="fixed md:top-14 top-9 left-9 md:left-14 md:w-[4vw] md:h-[4vh] w-[8vw] h-[8vh]">
          <img src={logo} alt="no img" />
        </div>
        <h1 className="text-4xl font-bold font-sans text-black">Login</h1>
        <div className="md:w-[35vw] w-[65vw] pt-7">
          <p className="text-lg font-medium opacity-65 hover:opacity-50">
            Start organizing your tasks and managing your day effectively with
            our Todo List application. Log in to access your tasks from
            anywhere, stay productive, and achieve your goals. Let's make every
            day a success together!
          </p>
        </div>
        <br />
        <br />

        <Button
          className="md:w-[20vw] w-[55vw] h-[7vh] bg-black rounded-2xl border mt-5 text-white flex justify-center items-center text-lg"
          icon={<GoogleOutlined />}
          onClick={handleClick}
        >
          Sign in using&nbsp;
          <span style={{ color: "#4285F4" }}>G</span>
          <span style={{ color: "#EA4335" }}>o</span>
          <span style={{ color: "#FBBC05" }}>o</span>
          <span style={{ color: "#4285F4" }}>g</span>
          <span style={{ color: "#34A853" }}>l</span>
          <span style={{ color: "#EA4335" }}>e</span>
        </Button>
      </div>

      <div
        className="md:w-1/2 w-full h-[100vh] overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "centre"
        }}
      ><br />
      </div>
    </div> }
    </>
  );
}

export default Login;
