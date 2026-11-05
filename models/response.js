import { DataTypes } from '@sequelize/core';

export default (sequelize) => {
    const Response = sequelize.define( 'Response', {
        _id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        result: {
            type: DataTypes.JSON,
            allowNull: false
        },
        prompt_id: {
            type: DataTypes.UUID,
            allowNull: false,
        }
    })

    return Response;
};