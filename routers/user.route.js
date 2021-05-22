const express = require('express');
const router = express.Router();

const {
    addNewUser,
    userLogin,
    userResetPassword,
    checkAndGetUser,
    getUserProfile,
} = require('../controllers/user.controller');


router.route('/')
    .post(addNewUser)

router.route('/login')
    .post(userLogin)

router.param('userId', checkAndGetUser);

router.route('/:userId')
    .get(getUserProfile)

router.route('/resetpassword')
    .post(userResetPassword)

module.exports = router;