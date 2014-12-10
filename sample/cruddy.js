var migrit     = require('migrit')
  , uuid       = require('node-uuid')
  , _          = require('underscore')
  ;

function model(name, env){
  this.name  = name;
  this.env   = env;
}

model.prototype.get = function(item){
  var where = ""
    , sql
    ;
  if(item){
    where = " WHERE "; 
    where = where + _.map(item, function(val, key){
      return key+" = '"+val+"'"
    }).join(" AND ");
  }
  sql = "SELECT * FROM "+this.name+where
  return this.sql(sql)
}

model.prototype.push = function(item){
  item.id = uuid.v4();
  var _this  = this
    , sql    = "INSERT INTO "+this.name
    , values = _.values(item)
                .map(function(i){
                  return("'"+i+"'");
                }).join(",");
    ;
  sql = sql+"("+_.keys(item).join(",")+")VALUES("+values+")";
  return this.sql(sql)
             .then(function(){
               return _this.get({id: item.id});
             })
}

model.prototype.put = function(id, item){
  delete item.id
  var _this = this
    , sql = "UPDATE "+this.name+" SET "
    , values = _.map(item, function(val, key){
                return(key+" = '"+val+"'");
              }).join(",")
    ;

  return this.sql(sql+values+" WHERE id = '"+id+"'")
    .then(function(){
      return _this.get({id: id});
    })
}

model.prototype.delete = function(id){
  return this.sql("DELETE FROM "+this.name+" WHERE id = '"+id+"'");
}

model.prototype.sql = function(sql){
  var env = this.env;
  return migrit.config
    .then(function(conf){
      migrit.sql.connect(conf, env);
      return migrit.sql.query(sql);
    })
}

module.exports = model;
