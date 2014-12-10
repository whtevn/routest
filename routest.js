var Routest = {}
  , _          = require('underscore')
  , colors     = require('colors')
  , httpromise = require('httpromise')
  , configen   = require('configen')
  , confoo     = require('confoo').find
  , migrit     = require('migrit')
  , q          = require('Q')
  ;

Routest.end = function(){
  migrit.sql.connection.end();
}

Routest.fixtures = function(name, database){
  name     = name || 'default';
  database = database || 'testing';

  Routest.fixture_setup = migrit.config
    .then(function(config){
      var additive  = false
        , keepalive = true
        ;

      return migrit.importer(config, database, name, additive, keepalive);
    })
    .then(function(){
      return migrit.sql
    })
    .catch(function(err){
      console.log(err);
      console.log(err.stack);
    });

  return {
    query: function(sql){
      return migrit.config
        .then(function(config){
          return migrit.sql.query(sql);
        })
        .catch(function(err){
          console.log(err);
        })
        ;
    }
  }
}

Routest.setup = function(file, setup){
  var deferred = q.defer();
  deferred.resolve();
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
    return q.all([(Routest.fixture_setup||deferred.promise), config]).then(
      function(c){
        c = c[1]
        var method = (setup.method||'get').toLowerCase();
        
        return Routest.api[method](setup.path, options);
      }
    ); 
  }
  return config
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

