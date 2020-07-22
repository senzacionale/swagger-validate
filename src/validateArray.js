'use strict';

var errorTypes = require('./errorTypes'),
  validate = require('./index');

var hooksHelper = require('./hooks');

function duplicates(candidate) {
  var dupeCheck = [];
  return candidate.filter(function(value){
    var signature;
    if(items.$ref){
      signature = JSON.stringify(value);
    } else {
      signature = value;
    }
    if(dupeCheck.indexOf(signature) !== -1){
      return true;
    } else {
      dupeCheck.push(signature);
      return false;
    }
  });
}

function validateArray(candidate, dataType, models, dataPath, hooks){
  if(!Array.isArray(candidate)){
    return new errorTypes.NotAnArrayError(candidate, typeof candidate);
  }

  var items = dataType.items;

  if (dataType.minItems) {
    if (candidate.length < dataType.minItems) {
      return new errorTypes.ArrayHasTooFewItemsError(candidate.length, dataType.minItems)
    }
  }

  if (dataType.maxItems) {
    if (candidate.length > dataType.maxItems) {
      return new errorTypes.ArrayHasTooManyItemsError(candidate.length, dataType.maxItems)
    }
  }

  if(dataType.uniqueItems){
    var dupes = duplicates(candidate);
    if(dupes.length) {
      return new errorTypes.DuplicateInSetError(candidate, dupes);
    }
  }

  var errors;

  if(items.$ref){
    var model = models[items.$ref];
    errors = candidate.filter(function(value, index){
      var itemPath = dataPath + '[' + index.toString() + ']';
      var matchingHooks = hooksHelper.matchingHooks(hooks, itemPath);
      hooksHelper.runHooks(matchingHooks, 'beforeValidate', value, model, models, itemPath);
      return validate.model(value, model, models, itemPath);
    });
  } else {
    errors = candidate.filter(function(value){
      return validate.dataType(value, items, models);
    });
  }

  if(errors.length){
    return new errorTypes.ErrorsInArrayElementsError(errors);
  }
}
module.exports = validateArray;
