const router = require("express").Router();

const feedsRoutes = require("./feeds");
const usersRoutes = require("./users");
const aiRoutes = require("./ai");
const logsRoutes = require("./logs");
const pdfsRoutes = require("./pdfs");
const uploadsRoutes = require("./uploads");
const auth = require("../middleware/auth");

router.use("/users", usersRoutes);
router.use("/feeds", feedsRoutes);
router.use("/ai", auth, aiRoutes);
router.use("/logs", auth, logsRoutes);
router.use("/pdfs", auth, pdfsRoutes);
router.use("/uploads", auth, uploadsRoutes);

module.exports = router;
