const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const verify_token = require('../authentication/verifytoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

/* for file uploads */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });



/* signup user */
router.post('/create/user',async(req,res)=>{
    try {
        const { name, email, mobile, gender, password } = req.body;
        const email_exist = await Users.findOne({email:email});
        if(email_exist){
            return res.status(400).json({ email: 'Email already registered' });
        }
        const mobile_exist = await Users.findOne({mobile:mobile});
        if(mobile_exist){
            return res.status(400).json({ mobile: 'Mobile number already registered' });
        }
        const hashpassword = await bcrypt.hash(password,10);
        const newuser = new Users({name, email, mobile, gender, password:hashpassword});
        await newuser.save();
        res.status(201).json({ success: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

/* login user */

router.post('/login/user',async(req, res)=>{
    try {
        const { email, password } = req.body;
        const email_exist = await Users.findOne({email:email});
        if(!email_exist){
            return res.status(404).json({ email: 'Email not registered' });
        }
        const verify_password = await bcrypt.compare(password, email_exist.password);
        if(!verify_password){
            return res.status(401).json({ password: 'Incorrect password' });
        }
        const user_tologin = await Users.findOne({email:email});
        const token = await jwt.sign({id:user_tologin._id.toString()}, process.env.SECRET_KEY);
        res.status(200).json({ success: token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


/* get userdata */
router.get('/get/user/data', verify_token, async(req, res)=>{
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ success: user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


/* profile data */
router.get('/profile/data/:id', verify_token, async(req,res)=>{
    try {
        const user = req.user;
        const { id } = req.params;
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userdata = await Users.findById(id).populate('blocked');
        if (!userdata) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ success: userdata });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})


/* change password */

router.post('/change/password', async(req, res)=>{
    try {
        const { email, password } = req.body;
        const email_exist = await Users.findOne({email:email});
        if(!email_exist){
            return res.status(404).json({ email: 'Email not registered' });
        }
        const hashpassword = await bcrypt.hash(password,10);
        email_exist.password = hashpassword;
        await email_exist.save();
        res.status(200).json({ success: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

/* search users to chat */

router.post('/search/user',verify_token, async(req, res)=>{
    try {
        const user = req.user;
        const mobile = req.body.mobile;
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const usertosearch = await Users.findOne({mobile: mobile});
        if(!usertosearch){
            return res.status(404).json({ mobile: 'User not found' });
        }
        if(user._id.toString() === usertosearch._id.toString()){
            return res.status(400).json({ mobile: 'Cannot send a message to your own account' });
        }
         if(user.blocked.includes(usertosearch._id)){
            return res.status(400).json({mobile: 'you have blocked user'})
         }
         if(usertosearch.blocked.includes(user._id)){
            return res.status(400).json({mobile: 'user blocked you'})
         }
        res.status(200).json({ success: usertosearch });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})


/* profile update */
router.post('/update/profile', verify_token , upload.single('file'),async(req, res)=>{
    try {
        const user = req.user;
        const { name, email, mobile, gender } = req.body;
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (email && email !== user.email) {
            const email_exist = await Users.findOne({ email });
            if (email_exist) {
                return res.status(400).json({ email: 'Email already registered' });
            }
        }

        if (mobile && mobile !== user.mobile) {
            const mobile_exist = await Users.findOne({ mobile });
            if (mobile_exist) {
                return res.status(400).json({ mobile: 'Mobile number already registered' });
            }
        }
        if (user.image && req.file) {
            const oldImagePath = path.join(__dirname, '..', 'uploads', user.image);

            try {
                await fs.access(oldImagePath); 
                await fs.unlink(oldImagePath); 
            } catch (unlinkErr) {
                return res.status(500).json({ error: 'Error deleting old image' });
            }
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.mobile = mobile || user.mobile;
        user.gender = gender || user.gender;
        if(req.file){
            user.image = req.file.filename
        }
        await user.save();
        res.status(200).json({ success: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})


/* block user */
router.post('/block/user/:id', verify_token, async (req, res) => {
    try {
      const verifiedUser = req.user;
      const { id } = req.params;
      if (!verifiedUser) {
        return res.status(404).json({ error: 'User not found' });
    }

      const userToBlock = await Users.findById(id);
      if (!userToBlock) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (verifiedUser._id.toString() === id) {
        return res.status(400).json({ message: 'You cannot block yourself' });
      }
      if (verifiedUser.blocked.includes(id)) {
        return res.status(400).json({ message: 'User is already blocked' });
      }
      verifiedUser.blocked.push(id);
      await verifiedUser.save();
      res.status(200).json({ success: 'User blocked successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /* unblock user */
  router.post('/unblock/user/:id', verify_token, async (req, res) => {
    try {
      const verifiedUser = req.user;
      const { id } = req.params;
      if (!verifiedUser) {
        return res.status(404).json({ error: 'User not found' });
    }
  
      const userToUnblock = await Users.findById(id);
      if (!userToUnblock) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (verifiedUser._id.toString() === id) {
        return res.status(400).json({ message: 'You cannot unblock yourself' });
      }
  
      if (!verifiedUser.blocked.includes(id)) {
        return res.status(400).json({ message: 'User is not blocked' });
      }
  
      verifiedUser.blocked = verifiedUser.blocked.filter(blockedId => blockedId.toString() !== id);
      await verifiedUser.save();
      res.status(200).json({ success: 'User unblocked successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });




module.exports = router;