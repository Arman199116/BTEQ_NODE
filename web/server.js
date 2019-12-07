var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var fs = require('fs');
var open = require('open');
var exec_cmd = require('./exec_cmd');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended : false}));

var cmd_file = 'cmd.txt';
const port = 3000;

app.get('/', (req, res) => {
    res.render('bteq', {data : ""});
});

app.post('/', (req, res) => {
    var {'logon' : log, 'set-width' : wid, 'select' : sel} = req.body;
    var logon = undefined;
    var set = undefined;
    var select = undefined;

    if (!!log.trim()) {
        logon = log.match(/^\.[a-zA-Z0-9_$]/g);
    }
    if (!!wid.trim()) {
        set = wid.match(/^\.[a-zA-Z0-9_$]/g);
    }
    if (!!sel.trim()) {
        select = sel.match(/^select/gi);
    }
    if (logon === null || set === null || select === null) {
        res.render('bteq', {data : "Incorrect input value"});
    } else {
        fs.writeFile(cmd_file, `${log}\n${wid}\n${sel}`, async function(err) {
            if (err) throw err;
            await exec_cmd(cmd_file);
            fs.readFile('out.bteq', 'utf8', function(err, data) {
                if (err) throw err;
                res.render('bteq', {data});
            });
        });
    }
});

app.listen(port, function() {
    console.log("BTEQ app listening at http://127.0.0.1:%s", port);
    open(`http://127.0.0.1:${port}`);
});