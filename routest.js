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

Routest.start = function(promise){
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
              return Routest.start(sitch.promise);
            })
            .catch(function(err){
              console.log(err);
            })
  }else{
    promise.then(function(){
      //console.log("that's all folks");
      // whole file report could go here
    })
  }
}

Routest.expect = function (item, opposite){
  var result
    ;
  return {
    toEqual: function(original){
      result = (item == original);
      return message(original, item, result, opposite);
    }
  , toBe: function(original){
      result = (item === original);
      return message(original, item, result, opposite);
    }
  , toBeIn: function(original){
      original = original.map(JSON.stringify);
      result = original.indexOf(JSON.stringify(item)) > -1;
      original = original.map(JSON.parse);
      return message(original, item, result, opposite, 'be in');
    }
  , toContain: function(original){
      item = item.map(JSON.stringify);
      result = item.indexOf(JSON.stringify(original)) > -1;
      item = item.map(JSON.parse);
      return message(original, item, result, opposite, 'contain');
    }
  , toBeGreaterThan: function(original){
      result = (item > original);
      return message(original, item, result, opposite, 'be greater than');
    }
  , toBeTruthy: function(original){
      result = item;
      return message(original, item, result, opposite, 'be truthy', true);
    }
  , toBeFalsy: function(original){
      result = !item;
      return message(original, item, result, opposite, 'be falsy', true);
    }
  , not: function(){
      return Routest.expect(item, true);
    }
  } 
}


function message(original, item, result, opposite, verb, no_original){
  result = (opposite&&!result||result)
    ;

  verb = (verb||'be');
  
  original = mungeItemForMessage(original);
  item = mungeItemForMessage(item);
  if(opposite){
    msg = 'expected '+item+' not to '+verb+' '+(no_original?'':original)
  }else{
    msg = 'expected '+item+' to '+verb+' '+(no_original?'':original)
  }
  console.log();
  console.log(msg[result?'green':'red']);
  return {
    because: function(msg){
      var modifier = result?'succeeded: ':'failed: ';
      msg = modifier+msg
      msg = msg[result?'green':'red'];
      console.log(msg);
    }
  }
}

function mungeItemForMessage(item){
  if(typeof item == 'object'){
    item = JSON.stringify(item);
  }
  return "'"+item+"'"
}



module.exports = Routest;

