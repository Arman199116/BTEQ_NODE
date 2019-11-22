var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended : false }));

var cmd_file = 'cmd.txt';
var bteq_path = `./bteq_dir/psql -m 1 < ${__dirname}/`;
var out_file = ` > ${__dirname}/out.bteq`;

async function exec_cmd() {
    try {
        const { stdout, stderr } = await exec(`${bteq_path}${cmd_file}${out_file}`);
        console.log('stdout:', stdout);
    }catch (err) {
        console.error(err);
    };
};

async function run_cmdfile () {
    await exec_cmd();
    try {
        fs.unlinkSync(cmd_file);
    } catch(err) {
        console.error(err);
    }
};

app.get('/', (req, res) => {
    res.render('bteq', {data : ""});
});

app.post('/',  (req, res) => {

    var {'logon' : log, 'set-width' : wid, 'select' : sel} = req.body;
    fs.writeFile(cmd_file, `${log}\n${wid}\n${sel}`, async function (err) {
        if (err) throw err;
        await run_cmdfile();
        fs.readFile('out.bteq', 'utf8', function(err, data) {
            if (err) throw err;
            res.render('bteq', {data} );
        });
    });
})

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});
