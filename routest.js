var Routest = {}
  , _          = require('underscore')
  , colors     = require('colors')
  , httpromise = require('httpromise')
  , configen   = require('configen')
  , confoo     = require('confoo').find
  , q          = require('Q')
  , situation  = require('./situation')
  ;

Routest.situations = [];

Routest.setup = function(file, setup){
  var sitch
    , config
    , deferred = q.defer()
    ;
  particulars = confoo(file)
    .then(function(file){
      conf = configen.generate(file);
      conf.register(new httpromise());
      return Routest.configen = conf._.then(function(api){
        Routest.api = api;
        return Routest;
      });

      return configen._;
    });
  sitch = new situation(setup, particulars, deferred); 
  Routest.situations.push({
    promise: deferred.promise
  , deferred: deferred
  , situation: sitch
  });
  return sitch
}

Routest.run = function(promise){
  var sitch = Routest.situations.shift()
    , deferred = q.defer()
    ;
  if(!promise){
    promise = deferred.promise;
    deferred.resolve();
  }

  if(sitch){
    return promise
            .then(function(){
              return sitch.situation.eatAndRun()
                .then(function(){
                  sitch.deferred.resolve();
                })
            })
            .then(function(){
              return Routest.run(sitch.promise);
            })
  }else{
    promise.then(function(){
      //console.log("that's all folks");
      // whole file report could go here
    })
  }
}

Routest.expect = function (description, item){
  if(!item){
    item = description;
    description = undefined;
  }

  var result
    , new_item = {
        item: item
      , description: description
      }
    ;
  return {
    toEqual: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      result = (item == original);
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result);
    }
  , toBe: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      result = (item === original);
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result);
    }
  , lengthToBe: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      result = (item.length == original);
      new_item.item = item.length
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result, 'length to be');
    }
  , toBeIn: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      original = original.map(JSON.stringify);
      result = original.indexOf(JSON.stringify(item)) > -1;
      original = original.map(JSON.parse);
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result, 'be in');
    }
  , toContainLike: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      item.forEach(function(i, key){
        result = result||_.matches(original)(i);
      })
      new_item.item = item;
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result, 'contain');
    }
  , toEachHaveSet: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      item.forEach(function(i){
        result = result||i[original];
      });
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result, 'to each have the key');
    }
  , toHaveSet: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      result = item[original];
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result, 'contain');
    }
  , toContain: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      item = item.map(JSON.stringify);
      result = item.indexOf(JSON.stringify(original)) > -1;
      new_item.item = item.map(JSON.parse);
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result, 'contain');
    }
  , toBeGreaterThan: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      result = (item > original);
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result, 'be greater than');
    }
  , toHaveNoDups: function(){
      result = _.uniq(item).length == item.length
      var orig = {
        item: null
      , description: null
      }
      return message(new_item, orig, result, 'be duplicate free', true);
    }
  , toBeTruthy: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      result = item;
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result, 'be set', true);
    }
  , toBeFalsy: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      result = !item;
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result, 'be unset', true);
    }
  , toBeEmpty: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      result = item.length==0;
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result, 'be empty', true);
    }
  , toBeLike: function(description, original){
      if(!original){
        original = description;
        description = undefined;
      }
      result = _.matches(original)(item);
      var orig = {
        item: original
      , description: description
      }
      return message(new_item, orig, result, 'be like');
    }
  , not: function(){
      return Routest.expectOpposite(description, item);
    }
  } 
}

Routest.expectOpposite = function(description, item){
  Routest.oppositeDay = !Routest.oppositeDay;
  return Routest.expect(description, item)
}


function message(new_item, original, result, verb, no_original){
  result = (Routest.oppositeDay&&!result||result);
  item = new_item.item;
  var description = new_item.description||item;

  verb = (verb||'be');
  
  var orig = mungeItemForMessage(original.item)
    , err_msg = '';
  item = mungeItemForMessage(item);

  if(Routest.oppositeDay){
    msg = 'expected '+(description||item)+' not to '+verb+' '+(no_original?'':((result && original.description)||orig))
  }else{
    msg = 'expected '+(description||item)+' to '+verb+' '+(no_original?'':((result && original.description)||orig))
  }
  if(!result && description){
    msg = msg+' but got '+item;
  }
  console.log();
  console.log(msg[result?'green':'red']);
  if(Routest.oppositeDay){
    Routest.expectOpposite();
  }
  return {
    because: function(msg){
      if(result){
        msg = 'because '+msg
        console.log(msg.green);
      }
    }
  }
}

function mungeItemForMessage(item){
  if(typeof item == 'object'){
    item = JSON.stringify(item);
  }
  if(typeof item != 'number'){
    item = "'"+item+"'";
  }
  return item;
}



module.exports = Routest;

