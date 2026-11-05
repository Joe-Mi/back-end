import { DataTypes } from '@sequelize/core';

export default (sequelize) => {
    const Session = sequelize.define( 'Session', {

        _id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        objective: {
            type: DataTypes.STRING,
            allowNull: false
        },
        budget: {
            type: DataTypes.INTEGER
        },
        mainLocation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        }
    })

    return Session;
};