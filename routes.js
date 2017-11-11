const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const connectionString = 'postgresql://enviroeye:1234567@localhost.server.com:5432/myFirstDB';

const client = new Client({
    user: 'enviroeye',
    host: 'localhost',
    database: 'myFirstDB',
    password: '1234567',
    port: 5432,
})
client.connect();

router.get('/api/getAllUsers', function (req, res, next) {


    client.query('SELECT * FROM test', (err, result) => {
        console.log(err ? err.stack : result.rows)
        res.send({ names: result.rows })
    })
})

router.post('/api/add', function (req, res, next) {

    let name = req.body.name;
    const text = "INSERT INTO test(name) VALUES($1) RETURNING *";
    value = [name];
    client.query(text, value)
        .then(data => {
            console.log('successfully added: ', data.rows)
            res.send(res.rows)
        })
        .catch(e => {
            res.send(e.stack)
        })
})

router.post('/api/user/:id', function (req, res, next) {
    let id = req.params.id;
    console.log()
    const text = "SELECT * FROM test WHERE id = $1";
    const value = [id]

    client.query(text, value)
        .then((data) => {
            res.send({ data: data.rows })
        })
        .catch(err => {
            res.send({ err })
        })
})

router.delete('/api/delete/:id', function (req, res, next) {
    let id = req.params.id;
    const text = "DELETE FROM test WHERE id = $1";
    const value = [id]

    client.query(text, value)
        .then((data) => {
            res.send("successfully delete user with id " + id + "")
        })
        .catch(err => {
            res.send({ err })
        })
})

router.post('/api/edit/:id', function (req, res) {
    let id = req.params.id;
    let name = req.body.name;
    const text = "UPDATE test SET name=$1 WHERE id=$2";
    const value = [name, id];

    client.query(text, value)
        .then((data) => {
            res.send(data.rows)
        })
        .catch(err => {
            res.send({ err })
        })

})


module.exports = router