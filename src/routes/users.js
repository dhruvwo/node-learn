const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/send-mail", userController.sendMail);
router.post("/login", userController.login);
router.get("/", auth, userController.getAllUsers);
router.get("/users-feeds", auth, userController.usersWithFeeds);
router.get("/concat-names", auth, userController.concatNames);
router.get("/feed-counts", auth, userController.feedCounts);
router.get("/unwind-feeds", auth, userController.unwindFeeds);
router.get("/:id", auth, userController.getUserById);
router.post("/", auth, userController.createUser);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
