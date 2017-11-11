var express = require('express'),
    path = require('path'),
    bodyParser = require("body-parser"),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    { Client } = require('pg'),
    app = express();

const client = new Client({
    user: 'enviroeye',
    host: 'localhost',
    database: 'myFirstDB',
    password: '1234567',
    port: 5432,
})
client.connect()

app.engine('dust', cons.dust);

app.set('view engine', 'dust');
app.set('views'.__dirname + '/views');

// set public folder

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
    res.send('hello')
})

app.get('/get', function (req, res) {
    client.query('SELECT * FROM test', (err, result) => {
        console.log(err ? err.stack : result.rows)
        res.send({ names: result.rows })
    })
})

app.post('/post' , function(req,res){
    var name = req.body.name;
    const text = "INSERT INTO test(name) VALUES($1) RETURNING *";
    value = [name];

    client.query(text, value)
    .then(data => {
      console.log('successfully added: ',data.rows)
      res.send(res.rows)
    })
    .catch(e => {
        res.send(e.stack)
    })
    
})


app.listen(4000, function () {
    console.log("server started 4000")
})