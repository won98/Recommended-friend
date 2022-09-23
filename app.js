const express = require("express");
const app = express();
const port = 2500;
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const { sequelize } = require("./models");
const Router = require("./routes");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("OK");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cors());
app.use(compression());
app.use(helmet());

app.use("/user", Router.UserRoute);
app.use("/follow", Router.FollowRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
