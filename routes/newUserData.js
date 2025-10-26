const express=require("express");
const { createUser, login_user, Send_otp, Verify_otp, reset_password, delete_Account } = require("../controllers/UserControl");
const router=express.Router();

router.post("/create/account",createUser);
router.post("/existing/user/login",login_user);
router.post("/changePassword/sendotp",Send_otp);
router.post("/changePassword/verifyotp",Verify_otp);
router.patch("/changePassword/resetpassword",reset_password);
router.delete("/delete/account",delete_Account);
module.exports  = router;