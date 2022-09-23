module.exports = (sequelize, DataTypes) => {
  const Userinfo = sequelize.define(
    "Userinfo",
    {
      id: {
        type: DataTypes.STRING(11),
        primaryKey: true,
        allowNull: true,
        unique: true,
      },
      follower_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      following_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
      timestamps: false, // createAt, updateAt 활성화
      paranoid: false, // deleteAt 옵션
    }
  );

  return Userinfo;
};
