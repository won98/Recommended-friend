const express = require("express");
//const { createToken, creatRefreshToken } = require("../utils/jwt");
const { FollowController: controller } = require("../controller");
const { Recommend, List } = require("../utils/recommend");
//const { checkToken } = require("../middleware/isAuth");
//const jwt = require("jsonwebtoken");
//const { authUtil } = require("../middleware/authJWT");
const router = express.Router();

router.post("/following", controller.FollowingUser);
router.post("/followerlist", controller.FollowerList);
router.post("/followinglist", controller.FollowingList);
router.post("/recommend", Recommend);
router.get("/list", List);
// router.post("/token", controller.IssueToken);
// //router.get("/profile", checkToken);
module.exports = router;
