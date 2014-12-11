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

Routest.start()
  .then(function(){
    db.connection.end();
  });
