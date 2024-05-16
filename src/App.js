import "./App.css";
import { useState } from "react";
import RegistrationForm from "./components/registrationForm.js";
import LoginForm from "./components/loginForm.js";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      <div className="App">
        <div className="container">
          <button className="loginRegBut" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Зарегистрироваться" : "Войти"}
          </button>
          {isLogin ? <LoginForm /> : <RegistrationForm />}
        </div>
      </div>
    </div>
  );
}

export default App;
