import initUserModel from './users.js';
import initSessionModel from './session.js';
import initPromptModel from './prompts.js';
import initResponseModel from './response.js';

function initModels(sequelize) {
  const models = {
    User: initUserModel(sequelize),
    Session: initSessionModel(sequelize),
    Prompt: initPromptModel(sequelize),
    Response: initResponseModel(sequelize)
  };

  // Model relationships,:
  models.User.hasMany(models.Session, {
    foreignKey: {
      name: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
  models.Session.belongsTo(models.User, {
    foreignKey: {
      name: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
  models.Session.hasMany(models.Prompt, {
    as: 'Prompts',
    foreignKey: {
      name: 'session_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
  models.Prompt.belongsTo(models.Session, {
    as: 'Session',
    foreignKey: {
      name: 'session_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
  models.User.hasMany(models.Prompt, {
    as: 'Prompts',
    foreignKey: {
      name: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
  models.Prompt.belongsTo(models.User, {
    as: 'User',
    foreignKey: {
      name: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
  models.Prompt.hasOne(models.Response, {
    as: 'Response',
    foreignKey: {
      name: 'prompt_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
  models.Response.belongsTo(models.Prompt, {
    as: 'Prompt',
    foreignKey: {
      name: 'prompt_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  return models;
}

export default initModels;