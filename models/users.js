import { DataTypes } from '@sequelize/core';

export default (sequelize) => {
    const User = sequelize.define( 'User', {
        // Model attributes are defined here
        _id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
        },
        lastSession: {
            type: DataTypes.TIME,
        }
    })

    return User;
};

// `sequelize.define` also returns the model
//console.log(User === sequelize.models.User); // true