var q          = require('Q')
  , migrit     = require('migrit')
  ;
function situation(setup, config, deferred){
  this.run_tank = [];
  this.config   = config;
  this.setup    = setup;
  this.deferred = deferred;
}

situation.prototype.query = function(sql){
    return migrit.config
      .then(function(config){
        return migrit.sql.query(sql);
      })
      ;
  }

situation.prototype.fixtures = function(name, database){
  name     = name || 'default';
  database = database || 'testing';
  var deferred = q.defer()
    , _this    = this
    ;

  if(this.fixture_promise && this.fixture_promise.then){
    this.fixture_promise.then(function(){
      delete _this.fixture_promise;
    })
  }

  this.fixture_promise = (this.fixture_promise || [])
  this.fixture_promise.push(deferred.promise);


  return migrit.config
    .then(function(config){
      var additive  = false
        , keepalive = true
        ;

      return migrit.importer(config, database, name, additive, keepalive);
    })
    .then(function(){
      deferred.resolve();
      return migrit.sql
    })
    .catch(function(err){
      console.log(err);
      console.log(err.stack);
    });

}

situation.prototype.before = function(func){
  var deferred = q.defer()
    , _this    = this
    ;
  this.run_tank.push({
    promise: deferred.promise
  , method:  function(res){
     return _this.config.then(function(conf){
       return func(res||conf);
     })
     .then(function(res){
       deferred.resolve(res);
     }); 
    }
  });
  return this;
}

situation.prototype.test = situation.prototype.after = situation.prototype.before;

situation.prototype.run = function(options){
  var deferred = q.defer()
    , _this    = this
    ;
  this.run_tank.push({
    promise: deferred.promise
  , method: function(){
     return _this.config.then(function(config){
      var method = (_this.setup.method||'get').toLowerCase();
      
      return config.api[method](_this.setup.path, options)
        .then(function(result){
          deferred.resolve(result);
          return(result);
        })
      }); 
    }
  });
  return this;
}

situation.prototype.eatAndRun = function(promise){
  var run   = (this.run_tank&&this.run_tank.shift())
    , _this = this
    , deferred = q.defer()
    ;

  if(!promise){
    promise = deferred.promise;
    deferred.resolve();
  }
  if(run){
    return promise.then(function(res){
              return run.method(res);
            })
            .then(function(){
              return _this.eatAndRun(run.promise);
            })
            .catch(function(err){
              console.log(err.message||err);
              console.log(err.stack);
            })
  }else{
    return promise.then(function(){
      console.log("done eating");
    })
  }
}

module.exports = situation;
