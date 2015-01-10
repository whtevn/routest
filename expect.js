var _      = require('underscore')
  , colors = require('colors')
  ;

function Expectation(description, value, not){
  this.original = determineValueOf(description, value);
  this.oppositeDay = false;

  if(!not){
    this.not = this.nor = this.neither = new Expectation(description, value, this);
    this.not.oppositeDay = true; 
    this.to = this.be = this.and = this.but = this;
  }else{
    this.nor = this.neither = this;
    this.not = this.to = this.be = this.and = this.but = not;
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

Expectation.prototype.beLike = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to be like";
  return this.execute(function(original, testValue){
    return _.matches(original)(testValue);
  })
}
Expectation.prototype.toPass = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to pass";
  return this.execute(value)
}

Expectation.prototype.contain = function(description, value){
}
Expectation.prototype.containLike = function(description, value){
}
Expectation.prototype.haveSet = function(){
}
Expectation.prototype.unique = function(){
}

// expect(ray).atLeast.one().to.haveSet('batch_id')
Expectation.prototype.each = function(){
  return this.n(this.original.value.langth);
}

Expectation.prototype.one = function(){
  return this.n(1);
}

Expectation.prototype.n = function(num){
  var batch = []
    , _this = this
    ;
  this.original.value.forEach(function(item){
    var item = run(_this.runner)(item);
    batch.push(item);
  });
  this.batch = batch;
  return this;
}

Expectation.prototype.execute = function(testResult){
  if(this.batch){
    this.batch.forEach(function(item, i){
      console.log("BATCH "+i, item.result);
    })
  }else{
    this.result  = testResult(this.original.value, this.testValue.value);
  }
  this.message = message( this.original
                        , this.testValue
                        , this.result
                        , this.verb
                        , this.oppositeDay
                        , this.silenceOriginal
                        );
  console.log(this.message);
  return this;
}

Expectation.prototype.because = function(explanation){
  this.explanation = explanation;
}


function message(original, testValue, result, verb, oppositeDay, silenceOriginal){
  var announceOppositeDay='';
  if(oppositeDay){
    result = !result;
    announceOppositeDay='not ';
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
