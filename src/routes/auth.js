const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "JwtSecret"; 

//Route1 : Create a User using: POST "/api/auth/createUser" .No login Required

router.post(
  "/createUser",
  [
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("name", "Name must be atleast 3 characters").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
  ],
  async (req, res) => {
    let success = false;
    //If there are errors, return Bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    //Check if the user with this email already exists
    try {
      let user = await User.findOne({ email: req.body.email });
      console.log(user, "User is ");
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      // console.log("UserCreated", user)

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken, "authToken");
      success = true;
      res.json({ success,authToken }); ////In es6 res.json({authToken}) = res.json({"authToken":authToken})
    } catch (error) {
      console.log(error.message, error, "Error in Try and Catch");
      res.status(500).send("Error Occured");
    }
  }
);

//Route2 : Authenticate a User using: POST "/api/auth/login" .No login Required

router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password can't be blank").exists(),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let success = false;
      let user = await User.findOne({ email });
      if(!user) {
        return res.status(400).json({ errors: "Please try to login with right credentials"});
      }
      const comparePassword  = await bcrypt.compare(password,user.password) 
      // In Compare method we compare passoword which user entered with the password which is 
      //returned by the findone query and desctrusture the hashed password  
      
      if(!comparePassword) {
        return res.status(400).json({ errors: "Please try to login with right credentials"});
      }

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken, "authToken");
      success = true;
      res.json({ success:success,authToken });
      // console.log(res,"respponse of Login api");

    } catch (error) {
      console.log(error.message, error, "Error in Try and Catch");
      res.status(500).send("Internal Server Error");
    } 
  }
);


//Route3 : Get Loggedin User Details using: POST "/api/auth/getuser" .Login Required

router.post(
  "/getUser", fetchuser,
  async (req, res) => {
    
    try {
       console.log("req.user",req.user)
       let  userid = req.user.id; 
       const user = await User.findById(userid)
       console.log("afbvahfv",user)
       res.send(user)

    } catch (error) {
      console.log(error.message, error, "Error in Try and Catch");
      res.status(500).send("Error Occured");
    }
  }
);


module.exports = router;
