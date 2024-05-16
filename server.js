// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, "users.json");

const saveUser = (user) => {
  let users = [];
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    users = JSON.parse(data);
  }
  users.push(user);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

const findUser = (username, password) => {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    const users = JSON.parse(data);
    return users.find(
      (user) => user.username === username && user.password === password
    );
  }
  return null;
};

const isUsernameTaken = (username) => {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    const users = JSON.parse(data);
    return users.some((user) => user.username === username);
  }
  return false;
};

const isPasswordValid = (password) => {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasUpperCase = /[A-Z]/;
  const hasNoSpace = /^\S*$/;

  if (password.length < minLength) {
    return {
      valid: false,
      message: "Пароль должен содержать не менее 8 символов.",
    };
  }
  if (!hasNumber.test(password)) {
    return {
      valid: false,
      message: "Пароль должен содержать хотя бы одну цифру.",
    };
  }
  if (!hasUpperCase.test(password)) {
    return {
      valid: false,
      message: "Пароль должен содержать хотя бы одну заглавную букву.",
    };
  }
  if (!hasNoSpace.test(password)) {
    return { valid: false, message: "Пароль не должен содержать пробелов." };
  }
  return { valid: true };
};

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (isUsernameTaken(username)) {
      res
        .status(400)
        .json({ message: "Такой логин уже есть в базе, придумайте другой." });
    } else {
      const passwordCheck = isPasswordValid(password);
      console.log("passwordCheck", passwordCheck);
      if (!passwordCheck.valid) {
        res.status(400).json({ message: passwordCheck.message });
      } else {
        saveUser({ username, password });
        res.json({ message: "Вы успешно зарегистрированы!" });
      }
    }
  } else {
    res.status(400).json({ message: "Все поля должны быть заполнены!" });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const user = findUser(username, password);
    if (user) {
      res.json({ message: "Вы вошли в аккаунт!" });
    } else {
      res.status(400).json({ message: "Неверный логин или пароль." });
    }
  } else {
    res.status(400).json({ message: "Все поля должны быть заполнены!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
