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
  Routest.situations.push(sitch);
  return sitch
}

Routest.start = function(situations){
  var pass_deferred = q.defer()
    , sitch;
  pass_deferred.resolve();
  situations = (situations || Routest.situations);
  if(situations.length>0){
    sitch = situations.shift();

    return sitch.checkOnFixtures()
      .then(function(){
        return sitch.eatAndRun();
      })
      .then(function(){
        return Routest.start(situations);
      })
  }else{
    console.log("that's all folks");
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
  , not: function(){
      return Routest.expect(original, true);
    }
  } 
}

Routest.run = function(config){
  console.log("running");
  config = (config||{});
  config = _.extend(Routest.config.conditions, config);
  var response = config
    , db = 'frank'
    ;
  //setup.route = mangleRoute(setup.route, setup.conditions);
  // make api call based on Routest.config
  // return a promise with the api call response
  // and a hook to mess with the database

    try{
      return {
        then: function(func){
          return configen.route
            .then(function(route){
              route.post(Routest.config.route, {body: config.body})
                  .then(function(responseObj){
                    console.log(responseObj);
                    func.call(this, response, db);
                  })
            });
        }
      }
    }catch(err){
      console.log(err.stack);
    }

}

function message(original, item, result, opposite, verb){
  result = (opposite&&!result||result)
    ;

  verb = (verb||'be');
  
  original = mungeItemForMessage(original);
  item = mungeItemForMessage(item);
  if(opposite){
    msg = 'expected '+item+' not to '+verb+' '+original;
  }else{
    msg = 'expected '+item+' to '+verb+' '+original;
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

