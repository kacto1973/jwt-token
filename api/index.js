const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const SECRET_KEY = "clave_secreta_y_segura";
const users = [{ id: 1, username: "admin", password: "123" }];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const payload = { id: user.id, username: user.username };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 1000 * 60 * 60,
  });

  res.json({ message: "Login exitoso, cookie establecida" });
});

module.exports = app;
