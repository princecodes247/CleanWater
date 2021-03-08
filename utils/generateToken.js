const jwt = require("jsonwebtoken");

const generateToken = (res, email) => {
  let link = "dddd";
  const expiration = 60 * 60 * 24 * 3;
  const token = jwt.sign({ link, email }, process.env.SECRET_KEY, {
    expiresIn: 60 * 60 * 24 * 4,
  });
  console.log(token);
  console.log({ status: "Logged In", token });
  res.cookie("token", token, {
    expires: new Date(Date.now() + expiration),
    secure: false, // set to true if your using https
    httpOnly: true,
  });
};
module.exports = generateToken;
