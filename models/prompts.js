import { DataTypes } from '@sequelize/core';

export default (sequelize) => {
    const Prompt = sequelize.define( 'Prompt', {
        _id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        query: {
            type: DataTypes.STRING,
            allowNull: false
        },
        session_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    })

    return Prompt;
};