var httpromise = require('httpromise');
var confoo = require('confoo').find;
var configen = require('configen');
var extend = require('underscore').extend;

function createApi(file, name, methods){
  var route = function() {};
  route._definition = confoo(file)
    .then(function(file){
      conf = configen.generate(file);
      conf.register(new httpromise());
      return conf._
    })
  for(method in methods){
    route = assign_as_method(route, method, methods[method]);
  }
  return route;
}

function assign_as_method(obj, name, route){
  obj[name] = function(opts){
    var execute = obj._definition.then(function(api){
      return api[route.method.toLowerCase()](route.path, opts)
    })
    var result = {
      response: function(){
        return execute.then(function(result){
          console.log(result);
        })
      },
      code: function(){
        return execute.then(function(result){
          console.log(result);
        })
      },
      duration: function(){
        return execute.then(function(result){
          console.log(result);
        })
      },
      result: function(){
        return execute.then(function(result){
          console.log(result);
        })
      },
    }

    result.refresh = function(opt2){
      extend(opts,  opt2 || {});
      return obj[name](opts)
    }
    return result
  }
  return obj
}

var route = function(api, methods){
  this.api = api;
  this.methods = methods;
}

route.prototype.execute = function(method, opts){
  var _this = this;
  return function(){
    console.log(method);
    _this.api[method].call(opts)
  }
}

module.exports = createApi
