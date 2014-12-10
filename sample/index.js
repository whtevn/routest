var env        = (process.argv[2]||'local')
  , express    = require('express')
  , bodyParser = require('body-parser')
  , app        = express()
  , cruddy     = require('./cruddy')
  , userModel  = new cruddy('users', env)
  , orderModel = new cruddy('orders', env)
  ;


app.use(bodyParser.json());

app.get('/users', function (req, response) {
  userModel.get()
    .then(function(result){
      response.send(result);
    })
    .catch(function(err){
      console.log(err);
      console.log(err.stack);
    });
})

app.post('/users', function(req, response){
  userModel.push(req.body)
    .then(function(result){
      response.send(result.shift());
    })
})

app.put('/users/:id', function(req, response){
  userModel.put(req.params.id, req.body)
    .then(function(result){
      response.send(result);
    })
})

app.delete('/users/:id', function(req, response){
  userModel.delete(req.params.id)
    .then(function(result){
      response.send({success: true});
    })
    .catch(function(err){
      console.log(err);
    })
})


app.get('/orders', function (req, res) {
  orderModel.get()
    .then(function(result){
      response.send(result);
    })
})

app.post('/orders', function(req, res){
  orderModel.push(req.body)
    .then(function(result){
      response.send(result);
    })
})

var port = env=='local'?3000:3300;
var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
  console.log('Env:', env);

});
