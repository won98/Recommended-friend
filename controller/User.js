const { Users, sequelize, Userinfo } = require("../models");
const jwt = require("../utils/jwt");
const { createRefreshToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
require("dotenv").config();
const secretKey = "" + process.env.ACCESS_KEY;

module.exports = {
  Signup: async (req, res) => {
    try {
      let { name, email, id, passwd } = req.body;
      const hash = await bcrypt.hash(passwd, 10);
      const beforeId = shortid.generate();
      let token = jwt.createToken({
        user_id: id,
        id: beforeId,
      });
      let rtoken = jwt.createRefreshToken({
        id: beforeId,
      });
      const tx = await sequelize.transaction();
      const rows = await Users.create(
        {
          name: name,
          email: email,
          id: id,
          passwd: hash,
          refreshtoken: rtoken,
        },
        {
          transaction: tx,
        }
      );

      const info_create = await Userinfo.create(
        {
          id: id,
          follower_count: 0,
          following_count: 0,
        }
        // {
        //   transaction: tx,
        // }
      );
      console.log(beforeId);

      if (!info_create) {
        await tx.rollback();
        throw {
          code: 7,
        };
      }
      await tx.commit();
      return res.status(200).json({
        result: "success",
        resuelt: rows,
        xauth: token,
        rxauth: rtoken,
      });
    } catch (err) {
      console.log(err);
    }
  },
  Login: async (req, res) => {
    try {
      const { id, passwd } = req.body;
      let token;
      let rtoken;
      const rows = await Users.findOne({
        where: { id: id },
      });
      const compare = await bcrypt.compare(passwd, rows.passwd);

      if (compare == true) {
        //const token = createToken(Users.id);
        token = jwt.createToken({
          user_id: rows.id,
          id: rows.id,
        });
        rtoken = createRefreshToken({ id: rows.id });
        await Users.update(
          {
            refreshtoken: rtoken,
          },
          {
            where: {
              id: rows.id,
            },
          }
        );
        return res.status(200).json({ token: token, rtoken: rtoken });
      } else throw { code: 9 };
    } catch (err) {
      console.log(err);
    }
  },
  IssueToken: async (req, res) => {
    try {
      let { rxauth } = req.headers;
      const issueId = jwt.verifyRefreshToken(rxauth);
      const isTrue = await Users.findOne({
        where: {
          id: issueId.user_id,
          refreshtoken: rxauth,
        },
      });
      console.log(issueId);
      // console.log(isTrue);
      //console.log("rxauth=", rxauth);
      // if (!isTrue) {
      //   res.status(200).json({ result: "failed" });
      // } else {
      //   let token = jwt.createToken({
      //     id: isTrue.id,
      //   });
      //   return res.status(200).json({
      //     xauth: token,
      //   });
      // }
      if (isTrue) {
        let token = jwt.createToken({
          id: isTrue.id,
        });
        return res.status(200).json({ xauth: token });
      } else {
        res.status(200).json({ result: "failed" });
      }
    } catch (err) {
      console.log(err);
    }
  },

  List: async (req, res) => {
    try {
      const rows = await Users.findAll();
      if (rows) return res.status(200).json({ result: rows });
      else throw console.log(error);
    } catch (err) {
      console.log(err);
    }
  },
  Checkemail: async (req, res) => {
    try {
      const data = await Users.findOne({ where: { email: req.body.email } });
      if (data) {
        // 반환 데이터가 있다면 이미 존재하는 이메일
        res.status(400).json({
          result: false,
          message: "이미 존재하는 이메일입니다.",
        });
        if (rows) return res.status(200).json({ result: rows });
      } else {
        res.send(200);
      }
    } catch (err) {
      console.log(err);
    }
  },
  Checkid: async (req, res) => {
    try {
      const data = await Users.findOne({ where: { id: req.body.id } });
      if (data) {
        // 반환 데이터가 있다면 이미 존재하는 이메일
        res.status(400).json({
          result: false,
          message: "이미 존재하는 아이디입니다.",
        });
        if (rows) return res.status(200).json({ result: rows });
      } else {
        res.send(200);
      }
    } catch (err) {
      console.log(err);
    }
  },
  TokenCh: async (req, res) => {
    try {
      let auth = req.get("x_auth");
      console.log(auth);
      const token = authorization(" ", " ")[1];
      jwt.verify(token, secretKey, (err, encode) => {
        if (err) console.error(err);
        else {
          console.log(encode);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
