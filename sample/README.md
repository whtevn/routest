start mysql

`create database migritDemo_dev`

`create database migritDemo_test`

$ migrit up -d testing

$ node index.js testing

$ node tests/routest-test.js

$ migrit up

$ migrit import -d local

$ node index.js
