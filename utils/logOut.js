const logOut = (res) => {
  token = "logged out"
  return res.cookie('token', token, {
    expires: new Date(Date.now() - 72000) ,
    secure: false, 
    httpOnly: false,
  }).json({message:"you have been logged out"});
};
module.exports = logOut