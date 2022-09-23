const { sequelize, QueryTypes } = require("../models");
const jwt = require("../utils/jwt");
const redis = require("ioredis");
const client = redis.createClient("127.0.0.1", 6379);
const set = (key, value) => {
  client.set(key, JSON.stringify(value));
};

module.exports = {
  Recommend: async (req, res) => {
    try {
      const tx = await sequelize.transaction();
      const { xauth } = req.body;
      const decoded = jwt.verifyToken(xauth);
      console.log(decoded);
      let data = [decoded.id, decoded.id, decoded.user_id];
      const query = `select *, userinfo.id, if(f2.following = ?, true,false)"idfollow" from users inner join
       follow f1 on users.id = f1.follower inner join 
       userinfo on users.id=userinfo.id left outer join follow f2 on f1.follower =  f2.follower and
        f2.following = ? where f1.following = ? order by f1.following `;
      let friend = await sequelize.query(
        query,
        {
          replacements: data,
          type: QueryTypes.SELECT,
        },
        {
          tx,
        }
      );
      let nameScore = {};

      for (let i = 0; i < friend.length; i++) {
        let list = [friend[i].name, friend[i].name, friend[i].name];
        const query2 = `select *, userinfo.id, if(f2.following = ?, true,false)"idfollow" from users inner join
       follow f1 on users.id = f1.follower inner join 
       userinfo on users.id=userinfo.id left outer join follow f2 on f1.follower =  f2.follower and
        f2.following = ? where f1.following = ? order by f1.following `;
        let friendlist = await sequelize.query(query2, {
          replacements: list,
          type: QueryTypes.SELECT,
        });
        console.log("---------------------------------------");
        console.log(friendlist);
        for (let f = 0; f < friendlist.length; f++) {
          //nameScore[friend[i].name]++;
          if (nameScore[friendlist[f].name] == undefined) {
            nameScore[friendlist[f].name] = 1;
            continue;
          }
          nameScore[friendlist[f].name]++;
        }
        console.log(nameScore);
      }
      recommendList = [];
      Object.keys(nameScore).forEach((element) => {
        console.log(element, nameScore[element]);
        if (nameScore[element] >= 2) {
          recommendList.push({ name: element });
        }
      });
      const list = recommendList;
      const jsonlist = JSON.stringify(list);
      console.log(jsonlist);
      //client.lpush("name", jsonlist);
      console.log(recommendList);
      client.set("name", jsonlist, (err, reply) => {
        console.log(err);
        //res.send(reply);
      });
      console.log(decoded);
      console.log(jsonlist);
      // const rlist = client.get("name");
      // console.log(rlist);
      // console.log("----------");
      console.log(recommendList);
      await tx.commit();
      return res.status(200).json({
        result: "success",
        resule: recommendList,
      });
    } catch (err) {
      console.log(err);
    }
  },
  List: async (req, res) => {
    const rlist = await client.get("name");
    console.log(rlist);
    return res.status(200).json({
      result: "success",
      resule: rlist,
    });
  },
};
