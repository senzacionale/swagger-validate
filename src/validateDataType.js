'use strict';

var validate = require('./index');
var hooksHelper = require('./hooks');

function validateDataType(candidate, dataType, models, dataPath, hooks){
  // console.log('** ', dataPath);
  models = models || {};
  hooks = hooks || {};

  var matchingHooks = hooksHelper.matchingHooks(hooks, dataPath)
  hooksHelper.runHooks(matchingHooks, 'beforeValidate', candidate, dataType, models, dataPath);
  // afterValidate is a bit trickier, need to change all the returns to save to a var and return at the end

  var type = dataType.type || dataType.dataType || dataType.$ref;

  switch(type){
    case 'integer':
      return validate.primitive.integer(candidate, dataType);
    case 'number':
      return validate.primitive.number(candidate, dataType);
    case 'string':
      return validate.primitive.string(candidate, dataType);
    case 'boolean':
      return validate.primitive.boolean(candidate);
    case 'array':
      return validate.array(candidate, dataType, models, dataPath, hooks);
    case 'void':
      return validate.primitive.void(candidate);
    case 'File':
      return validate.primitive.file();
    case 'object':
      if (dataType.properties) {
        return validate.model(candidate, dataType, models, dataPath, hooks);
      }
      // intentionally fall through to default here so explicit `type: object`
      // with $ref would be validated as well
    default:
      // Assumed to be object
      var model = models[type];
      if (model) {
        return validate.model(candidate, model, models, dataPath, hooks);
      } else {
        hooksHelper.runHooks(matchingHooks, 'unvalidated', candidate, dataType, models, dataPath);
      }
  }
}
module.exports = validateDataType;
