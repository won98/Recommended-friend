const { Follow, sequelize, QueryTypes } = require("../models");
const jwt = require("../utils/jwt");
//const recommend = require("../middleware/recommend")

module.exports = {
  FollowingUser: async (req, res) => {
    try {
      const tx = await sequelize.transaction();
      const { xauth } = req.body;
      const { following } = req.body;
      const decoded = jwt.verifyToken(xauth);
      console.log(decoded);

      const rows = await Follow.create({
        following: decoded.id,
        follower: following,
      });
      if (!rows) {
        await tx.rollback();
        throw {
          code: 1,
        };
      } else {
        const rows2 = await sequelize.query(
          `update userinfo set following_count = following_count +1 where id = ?`,
          {
            replacements: [decoded.id],
            type: QueryTypes.UPDATE,
          },
          {
            transaction: tx,
          }
        );
        if (!rows2) {
          await tx.rollback();
          throw {
            code: 1,
          };
          v;
        }
        const rows3 = await sequelize.query(
          `update userinfo set follower_count = follower_count +1 where id = ?`,
          {
            replacements: [following],
            type: QueryTypes.UPDATE,
          },
          {
            transaction: tx,
          }
        );
        if (!rows3) {
          await tx.rollback();
          throw {
            code: 1,
          };
        }
        await tx.commit();
        return res.status(200).json({
          result: "success",
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  UnFollowingUser: async (req, res) => {
    try {
      const tx = await sequelize.transaction();
      const { xauth } = req.body;
      const { following } = req.body;
      const decoded = jwt.verifyToken(xauth);
      console.log(decoded);
      const rows = await Follow.create({
        following: decoded.id,
        follower: following,
      });
      if (!rows) {
        await tx.rollback();
        throw {
          code: 1,
        };
      }
      const rows2 = await sequelize.query(
        `update userinfo set following_count = following_count -1 where id = ?`,
        {
          replacements: [decoded.id],
          type: QueryTypes.UPDATE,
        },
        {
          transaction: tx,
        }
      );
      if (!rows2) {
        await tx.rollback();
        throw {
          code: 1,
        };
        v;
      }
      const rows3 = await sequelize.query(
        `update userinfo set follower_count = follower_count -1 where id = ?`,
        {
          replacements: [following],
          type: QueryTypes.UPDATE,
        },
        {
          transaction: tx,
        }
      );
      if (!rows3) {
        await tx.rollback();
        throw {
          code: 1,
        };
      }
      await tx.commit();
      return res.status(200).json({
        result: "success",
      });
    } catch (err) {
      console.log(err);
    }
  },
  FollowerList: async (req, res) => {
    try {
      const { xauth } = req.body;
      // const { page, id } = req.query;
      // let offset = 0;
      // if (page > 1) {
      //   offset = 20 * (page - 1);
      // }
      const decoded = jwt.verifyToken(xauth);
      console.log(decoded);
      let data = [decoded.id, decoded.id, decoded.user_id];
      console.log("data:", data);
      const query = `select *, userinfo.id, if(f2.following = ?, true,false)"idfollow" from users inner join
      follow f1 on users.id = f1.following inner join 
      userinfo on users.id=userinfo.id left outer join follow f2 on f1.following =  f2.follower and f2.following = ? where f1.follower = ? order by f1.follower  `;
      const rows = await sequelize.query(query, {
        replacements: data,
        type: QueryTypes.SELECT,
      });
      if (rows) res.status(200).json(rows);
      else
        throw {
          code: 1,
        };
    } catch (err) {
      console.log(err);
    }
  },
  FollowingList: async (req, res) => {
    try {
      const { xauth } = req.body;
      // const { page, id } = req.query;
      // let offset = 0;
      // if (page > 1) {
      //   offset = 20 * (page - 1);
      // }
      const decoded = jwt.verifyToken(xauth);
      console.log(decoded);
      let data = [decoded.id, decoded.id, decoded.user_id];
      console.log("data:", data);
      const query = `select *, userinfo.id, if(f2.following = ?, true,false)"idfollow" from users inner join
      follow f1 on users.id = f1.follower inner join 
      userinfo on users.id=userinfo.id left outer join follow f2 on f1.follower =  f2.follower and
       f2.following = ? where f1.following = ? order by f1.following  `;
      const rows = await sequelize.query(query, {
        replacements: data,
        type: QueryTypes.SELECT,
      });
      if (rows) res.status(200).json(rows);
      else
        throw {
          code: 1,
        };
    } catch (err) {
      console.log(err);
    }
  },
  //   Recommend: async (req, res) => {
  //     const list =
  //   },
};
