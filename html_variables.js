const feedback = require('./feedback.json').list;
const furniture = require('./furniture.json').furniture;
const interiors = require('./interiors.json').interiors;
module.exports = {
  imagesBaseUrl: '/images',
  interiors,
  feedback,
  furniture,
};
