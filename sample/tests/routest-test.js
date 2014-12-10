var Routest = require('../../routest')
  , expect  = Routest.expect
  , test_env
  , db
  ;

test_env = Routest
  .setup('sample-app.json'
  , {
      path: "users"
    , method: "GET"
    }
  )
  
db = test_env.fixtures()

test_env
  .run()
  .then(function(response){
    var body = JSON.parse(response.body);
      ;
    return test_env.query("SELECT * FROM users")
      .then(function(result){
        expect(body.length).toBe(result.length);
        body.forEach(function(user){
          expect(user).toBeIn(result);
        })
      })
  })
  .then(function(){
    return test_env.fixtures();
  })
  .catch(function(err){
    console.log(err.stack);
  })
  
test_env
  .run()
  .then(function(response){
    var body = JSON.parse(response.body);
      ;
    return test_env.query("SELECT * FROM users")
      .then(function(result){
        expect(body.length).toBe(result.length);
        body.forEach(function(user){
          expect(user).toBeIn(result);
        })
      })
  })
  .then(function(){
    return test_env.fixtures();
  })

test_env
  .run()
  .then(function(response){
    var body = JSON.parse(response.body);
      ;
    return test_env.query("SELECT * FROM users")
      .then(function(result){
        expect(body.length).toBe(result.length);
        body.forEach(function(user){
          expect(user).toBeIn(result);
        })
      })
  })

Routest.start();
