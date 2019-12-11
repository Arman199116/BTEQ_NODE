const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const fs = require('fs');
const open = require('open');
const exec_cmd = require('./exec_cmd');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended : false}));

const cmd_file = 'cmd.txt';
const port = 3000;

app.get('/', (req, res) => {
    res.render('bteq', {data : ""});
});

app.post('/', (req, res) => {
    const {'logon' : log, 'set-width' : wid, 'select' : sel} = req.body;
    let logon = "";
    let set = "";
    let select = "";

    if (!!log && !!log.trim()) {
        logon = log.match(/^\.[a-zA-Z0-9_$]+/g);
    }
    if (!!wid && !!wid.trim()) {
        set = wid.match(/^\.[a-zA-Z0-9_$]+/g);
    }
    if (!!sel && !!sel.trim()) {
        select = sel.match(/^select/gi);
    }
    if (logon === null || set === null || select === null) {
        res.render('bteq', {data : "Incorrect input value"});
    } else {
        try {
            fs.writeFile(cmd_file, `${log}\n${wid}\n${sel}`, async(err) => {
                if (err) throw err;
                await exec_cmd(cmd_file);
                try {
                    fs.readFile('out.bteq', 'utf8', (err, data) => {
                        if (err) throw err;
                        res.render('bteq', {data});
                    });
                } catch(err) {
                    if (err) console.error(err);
                }
            });
        } catch(err) {
            if (err) console.error(err);
        }
    }
});

app.listen(port, () => {
    console.log("BTEQ app listening at http://127.0.0.1:%s", port);
    open(`http://127.0.0.1:${port}`);
});