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
  .before(function(){
    return test_env.fixtures()
                   .then(function(connection){
                     db = connection
                   });
  })
  

  // each time a fixture is created, add a promise to an array
  //
  // do not start a situation until that array has all promises resolved
  //
  // the array goes in routest. stop situations before they start with promises
test_env
  .run()
  .test(function(response){
    var body = JSON.parse(response.body);
      ;
    return db.query("SELECT * FROM users")
      .then(function(result){
        expect(body.length).toBe(result.length);
        body.forEach(function(user){
          expect(user).toBeIn(result);
        })
      })
  })
  .after(function(test){
    return test_env.fixtures();
  })

test_env
  .run()
  .test(function(response){
    var body = JSON.parse(response.body);
      ;
    return db.query("SELECT * FROM users")
      .then(function(result){
        expect(body.length).toBe(result.length);
        body.forEach(function(user){
          expect(user).toBeIn(result);
        })
      })
  })

Routest.start();
