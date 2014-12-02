var Routest = {}
  , _          = require('underscore')
  , colors     = require('colors')
  , httpromise = require('httpromise')
  , configen   = require('configen')
  , confoo     = require('confoo').find
  ;

Routest.setup = function(file, setup){
  var config = confoo(file)
    .then(function(file){
      configen = configen.generate(file);
      configen.register(new httpromise());
      return Routest.configen = configen._.then(function(api){
        Routest.api = api;
        return Routest;
      });

      return configen._
    });

  config.run = function(options){
    return config.then(function(c){
      var method = (setup.method||'get').toLowerCase();
      
      return Routest.api[method](setup.path, options);
    }); 
  }
  return config
}

Routest.expect = function (original, opposite){
  var result
    ;
  return {
    toEqual: function(item){
      result = (item == original);
      return message(original, item, result, opposite);
    }
  , toBe: function(item){
      result = (item === original);
      return message(original, item, result, opposite);
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

function message(original, item, result, opposite){
  result = (opposite&&!result||result)
    ;
  
  original = mungeItemForMessage(original);
  item = mungeItemForMessage(item);
  if(opposite){
    msg = 'expected '+original+' not to be '+item+', '+(result?'and it was not':'but it was');
  }else{
    msg = 'expected '+original+' '+(result?'and':'but')+' got '+ item;
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

