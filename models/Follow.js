const shortid = require("shortid");

module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    "Follow",
    {
      id: {
        type: DataTypes.STRING(11),
        primaryKey: true,
        allowNull: true,
      },
      following: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
      follower: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false, // createAt, updateAt 활성화
      paranoid: false, // deleteAt 옵션
    }
  );
  Follow.beforeCreate((Follow, options) => {
    const pri_id = shortid.generate();
    idok = shortid.isValid(pri_id);
    if (!idok) {
      pri_id = pri_id + Math.random().toString(36).substring(2, 4);
    }
    return (Follow.id = pri_id);
  });

  return Follow;
};
