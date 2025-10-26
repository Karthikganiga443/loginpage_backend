const userdata = require("../Models/create_users");
const bcrypt = require("bcrypt");
const nodemailer=require("nodemailer");

//for new user account creation
const createUser = async (req, res) => {
  try {
    const { Password, ConfirmPassword, ...otherFields } = req.body;
    const PasswordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%&])(?=.*\d)[A-Za-z\d@$!%&]{8,}$/;
    if(PasswordPattern.test(Password)){
        if (Password !== ConfirmPassword) {
      return res.status(400).json({
        issuccess: false,
        message: "Passwords do not match"
      });
    }
    }else{
        return res.status(400).json({
            issuccess:false,
            message:"Password must be 8+ chars, include a letter, number & special character"
        })
    }
    

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = new userdata({
      ...otherFields,
      Password: hashedPassword
    });

    await user.save();

    res.status(200).json({
      issuccess: true,
      message: "Account created successfully"
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        issuccess: false,
        message: "User already exists"
      });
    }

    res.status(500).json({
      issuccess: false,
      message: error.message
    });
  }
};

//existing user login

const login_user = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const get_user = await userdata.findOne({ Email });
    if (!get_user) {
      return res.status(404).json({
        issuccess: false,
        message: "User doesn't exist"
      });
    }

    const verify_password = await bcrypt.compare(Password, get_user.Password);
    if (!verify_password) {
      return res.status(401).json({
        issuccess: false,
        message: "Invalid password"
      });
    }

    res.status(200).json({
      issuccess: true,
      message: "Login successful",
      user: {
        id: get_user._id,
        Email: get_user.Email
      }
    });
  } catch (error) {
    res.status(500).json({
      issuccess: false,
      message: error.message
    });
  }
};

//incase user wants to change password->send_otp->verify_otp->reset_password

const optStore={};

const Send_otp=async(req,res)=>{
    const {Email}=req.body;
     try{
        const userEmail= await userdata.findOne({Email});
        if (!userEmail) {
         return res.status(404).json({
        issuccess: false,
        message: "User doesn't exist"
      });
    }
    const otp=Math.floor(100000+Math.random()*900000);
    const Expirytime=Date.now()+5*60*1000;
    optStore[Email]={otp,Expirytime};

    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"karthikganiga461@gmail.com", 
            pass: "vqig waxy okyj qhbx"
        }
    });
    const mailOptions=({
        from:"karthikganiga461@gmail.com",
        to:Email,
        subject:"Password Reset OTP",
        text:`Your OTP for Password Reset is: ${otp}. It is valid for 5 mins`
    });
    await transporter.sendMail(mailOptions);

    res.status(200).json({
        issuccess:true,
        message:"OTP sent Successfully"
    })


    }
    catch(error){
         res.status(500).json({ issuccess: false, message: error.message });
    }

}

const Verify_otp=async(req,res)=>{
    const {Email,OTP} = req.body;
    const record=optStore[Email];
    if(!record){
        return res.status(400).json({
            issuccess:false,
            message:"NO OTP Requested"
        })
    }
    if(Date.now()>record.Expirytime){
        delete optStore[Email];
        return res.status(400).json({
            issuccess:false,
            message:"OTP has expired"
        })
    }
    if(parseInt(OTP)!== record.otp){
        return res.status(400).json({
            issuccess:false,
            message:"Invalid OTP"
        })
    }
    delete optStore[Email];
    res.status(200).json({
        issuccess:true,
        message:"OTP verified, Proceed to Reset Password"
    })
}

const reset_password=async(req,res)=>{
    const {Email, Password, ConfirmPassword} = req.body;
    if (!Email || !Password || !ConfirmPassword) {
    return res.status(400).json({
      issuccess: false,
      message: "Email, Password, and ConfirmPassword are required"
    });
  }
   const PasswordPattern=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(PasswordPattern.test(Password)){
        if (Password !== ConfirmPassword) {
      return res.status(400).json({
        issuccess: false,
        message: "Passwords do not match"
      });
    }
    }else{
        return res.status(400).json({
            issuccess:false,
            message:"Password must be 8+ chars, include a letter, number & special character"
        })
    }
    

    const hashedPassword = await bcrypt.hash(Password, 10);
    try{
        await userdata.findOneAndUpdate({Email}, {Password:hashedPassword});
        res.status(200).json({
      issuccess: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    res.status(500).json({ issuccess: false, message: error.message });
  }

}

//if user wants to delete account

const delete_Account = async (req, res) => {
  const {Email, Password} = req.body;

  try {
    // Find the user by email
    const user = await userdata.findOne({Email});
    if (!user) {
      return res.status(404).json({
        issuccess: false,
        message: "User not found!"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({
        issuccess: false,
        message: "Invalid Password"
      });
    }

    // Delete user
    await userdata.findOneAndDelete({ Email });
    res.status(200).json({
      issuccess: true,
      message: "Account is deleted Successfully"
    });

  } catch (error) {
    res.status(500).json({
      issuccess: false,
      message: error.message
    });
  }
};


module.exports = { createUser, login_user,Send_otp, Verify_otp,reset_password, delete_Account};
