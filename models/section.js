/**
 * 笔记本section类
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("section", {
        sectionID: {
            type: DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        notebookID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        freezeTableName: true,
        timestamps: false, //取消默认生成的createdAt、updatedAt字段
    },sequelize.sync());
}