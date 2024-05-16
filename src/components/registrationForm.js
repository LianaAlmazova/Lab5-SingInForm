// src/RegistrationForm.js
import React, { useState } from "react";
import "./registrationForm.css";
import "./tooltip.css";
import icon_v from "../images/icon_v.png";
import icon_x from "../images/icon_x.png";
import pass from "../images/pass.svg";
import passClose from "../images/passClose.svg";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePasswordInput = (e) => setPassword(e.target.value);

  const valid = (v_icon, inv_icon) => {
    let valid_icon = document.getElementById(v_icon);
    valid_icon.style.visibility = "visible";

    let invalid_icon = document.getElementById(inv_icon);
    invalid_icon.style.visibility = "hidden";
  };

  const invalid = (v_icon, inv_icon) => {
    let valid_icon = document.getElementById(v_icon);
    valid_icon.style.visibility = "hidden";

    let invalid_icon = document.getElementById(inv_icon);
    invalid_icon.style.visibility = "visible";
  };

  const notDisplay = (v_icon, inv_icon) => {
    let valid_icon = document.getElementById(v_icon);
    valid_icon.style.visibility = "hidden";
    let invalid_icon = document.getElementById(inv_icon);
    invalid_icon.style.visibility = "hidden";
  };

  let tooltipDisplay = document.getElementById("tooltip_container");

  const tooltipBlur = (event) => {
    notDisplay("pass_tick_len", "pass_cross_len");
    notDisplay("pass_tick_up", "pass_cross_up");
    notDisplay("pass_tick_num", "pass_cross_num");
    notDisplay("pass_tick_space", "pass_cross_space");
    if (tooltipDisplay) {
      tooltipDisplay.style.visibility = "hidden";
    }
  };

  const handleInput = (e) => {
    if (tooltipDisplay) {
      tooltipDisplay.style.visibility = "visible";
    }
    let pass = e.target.value;

    if (pass.length >= 8) {
      valid("pass_tick_len", "pass_cross_len");
    } else {
      invalid("pass_tick_len", "pass_cross_len");
    }

    const up = /[A-Z]/g;
    if (up.test(pass)) {
      valid("pass_tick_up", "pass_cross_up");
    } else {
      invalid("pass_tick_up", "pass_cross_up");
    }

    const num = /[0-9]/g;
    if (num.test(pass)) {
      valid("pass_tick_num", "pass_cross_num");
    } else {
      invalid("pass_tick_num", "pass_cross_num");
    }

    const space = /[ ]/g;
    if (!space.test(pass)) {
      valid("pass_tick_space", "pass_cross_space");
    } else {
      invalid("pass_tick_space", "pass_cross_space");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    setMessage(data.message);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="registration-form">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Логин:</label>
          <input type="text" value={username} onChange={handleUserInput} />
        </div>
        <div className={`form-control ${password && "tooltipOn"}`}>
          <label>Пароль:</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordInput}
              onInput={handleInput}
              onBlur={tooltipBlur}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <img className="iconPass" src={pass} />
              ) : (
                <img className="iconPass" src={passClose} />
              )}
            </button>
          </div>
          <div id="tooltip_container" className="tooltip">
            <div className="tooltiptext">
              <div className="tooltip_row">
                <div className="icon_container">
                  <img
                    src={icon_v}
                    alt="icon tick"
                    id="pass_tick_len"
                    className="icon icon_tick"
                  />
                  <img
                    src={icon_x}
                    alt="icon cross"
                    id="pass_cross_len"
                    className="icon icon_cross"
                  />
                </div>
                <p>не менее 8 символов</p>
              </div>
              <div className="tooltip_row">
                <div className="icon_container">
                  <img
                    src={icon_v}
                    alt="icon tick"
                    id="pass_tick_up"
                    className="icon icon_tick"
                  />
                  <img
                    src={icon_x}
                    alt="icon cross"
                    id="pass_cross_up"
                    className="icon icon_cross"
                  />
                </div>
                <p>заглавные буквы</p>
              </div>
              <div className="tooltip_row">
                <div className="icon_container">
                  <img
                    src={icon_v}
                    alt="icon tick"
                    id="pass_tick_num"
                    className="icon icon_tick icon_ticknum"
                  />
                  <img
                    src={icon_x}
                    alt="icon cross"
                    id="pass_cross_num"
                    className="icon icon_cross"
                  />
                </div>
                <p>минимум 1 цифра</p>
              </div>
              <div className="tooltip_row">
                <div className="icon_container">
                  <img
                    src={icon_v}
                    alt="icon tick"
                    id="pass_tick_space"
                    className="icon icon_tick"
                  />
                  <img
                    src={icon_x}
                    alt="icon cross"
                    id="pass_cross_space"
                    className="icon icon_cross"
                  />
                </div>
                <p>нельзя использовать пробел</p>
              </div>
            </div>
          </div>
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegistrationForm;
