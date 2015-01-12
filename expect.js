var _      = require('underscore')
  , colors = require('colors')
  ;

function Expectation(description, value, not){
  this.original = determineValueOf(description, value);

  if(!not){
    this.not = this.nor = this.neither = new Expectation(description, value, this);
    this.to = this.be = this.and = this.but = this;
    this.not.oppositeDay = true; 
  }else{
    this.not = this.to = this.be = this.and = this.but = not;
    this.oppositeDay = false;
    this.nor = this.neither = this;
  }

  this.testValue  = {};
}

Expectation.prototype.toBe = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to be"
  return this.execute(function(original, testValue){
    return testValue === original;
  });
}

Expectation.prototype.greaterThan = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to be greater than";
  return this.execute(function(original, testValue){
    return original > testValue
  });
}

Expectation.prototype.lessThan = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to be less than";
  return this.execute(function(original, testValue){
    return original < testValue;
  });
}

Expectation.prototype.foundIn = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to be in";

  return this.execute(function(original, testValue){
    var haystack 
      , needle  
      ;
    haystack = testValue.map(JSON.stringify);
    needle   = JSON.stringify(original);
    return this.execute(haystack.indexOf(needle) > -1);
  });
}

Expectation.prototype.exist = function(description){
  this.silenceOriginal = true;
  this.testValue.description = description;
  this.verb = "to exist";
  return this.execute(function(original, testValue){
    return original;
  });
}

Expectation.prototype.empty = function(description){
  this.silenceOriginal = true;
  this.testValue.description = description;
  this.verb = "to be empty";
  return this.execute(function(original, testValue){
    return original.length === 0;
  })
}

Expectation.prototype.match = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to match";
  return this.execute(function(original, testValue){
    return original.match(testValue);
  })
}

Expectation.prototype.equal = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to equal";
  return this.execute(function(original, testValue){
    return testValue == original;
  })
}

Expectation.prototype.length = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to be length";
  return this.execute(function(original, testValue){
    return original.length == testValue;
  });
}

Expectation.prototype.like = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to be like";
  return this.execute(function(original, testValue){
    return _.matches(testValue)(original);
  })
}
Expectation.prototype.toPass = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to pass";
  return this.execute(value)
}

Expectation.prototype.haveSet = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to have set";
  return this.execute(function(original, testValue){
    return original[testValue]
  })
}

Expectation.prototype.unique = function(){
}

// expect(ray).atLeast.one().to.haveSet('batch_id')
Expectation.prototype.each = function(){
  return this.n(this.original.value.length);
}

Expectation.prototype.one = function(){
  return this.n(1);
}

Expectation.prototype.none = function(){
  return this.n(0);
}

Expectation.prototype.n = function(num){
  var batch = []
    , runner = {
        add: function(item){
          this.store.push(item);
          return item
        },
        store: []
      }
    ;

  this.original.value.forEach(function(item){
    run(runner)(item);
  });
  runner.magicNumber = num;
  this.batch = this.not.batch = runner;
  return this;
}

Expectation.prototype.execute = function(testResult){
  var _this = this;
  if(this.batch){
    this.result = _.reject(this.batch.store, function(item, i){
      var result = testResult(item.original.value, _this.testValue.value);
      return !result;
    })
  }else{
    this.result  = testResult(this.original.value, this.testValue.value);
  }
  this.message = message( this.original
                        , this.testValue
                        , this.result
                        , this.verb
                        , this.oppositeDay
                        , this.batch
                        , this.silenceOriginal
                        );
  console.log(this.message);
  return this.oppositeDay?this.not:this
}

Expectation.prototype.because = function(explanation){
  this.explanation = explanation;
}

function message(original, testValue, result, verb, oppositeDay, batch, silenceOriginal){
  var announceOppositeDay='';

  if(oppositeDay){
    announceOppositeDay='not ';
    if(batch){
      result = ((batch.store.length - result.length) === batch.magicNumber);
    }else{
      result = !result;
    }
  }else{
    if(batch){
      result = (result.length === batch.magicNumber);
    }
  }

  msg = "expected "+(original.description||JSON.stringify(original.value))+" "+announceOppositeDay+verb;
  
  if(!silenceOriginal){
  msg +=" "+((result && testValue.description)||JSON.stringify(testValue.value));
  }

  if(!result){
    msg += " but got "+JSON.stringify(original.value);
  }
  msg = msg[result?'green':'red'];
  return msg
}

function determineValueOf(description, value){
  var result
    ;

  if(value === undefined){
    value = description;
    description = undefined; 
  }

  return {
    value: value
  , description: description
  }
}

function run(runner){
  return function(description, value){
    var expectation = new Expectation(description, value);
    expectation.runner = runner;
    return runner.add(expectation);
  }
}

module.exports = run;
