const express = require("express");
const router = express.Router();

const userController = require('../controller/UserController');
const { authMiddleware } = require("../authMiddleware/authMiddleware");

router.post("/create", userController.createUser);
router.post ("/login", userController.loginUser);
router.get ("/get-user",authMiddleware, userController.getUser);
router.post('/refreshToken', userController.refreshToken);
router.put('/update/:id', userController.updateUser)

module.exports = router;