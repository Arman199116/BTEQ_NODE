const util = require('util');
const exec = util.promisify(require('child_process').exec);
var fs = require('fs');

var bteq_path = `./bteq_dir/psql -m 1 < ${__dirname}/`;
var out_file = ` > ${__dirname}/out.bteq`;

module.exports = async (cmd_file) => {
    try {
        const {stdout, stderr} = await exec(`${bteq_path}${cmd_file}${out_file}`);
        console.log('stdout:', stdout);
        try {
            fs.unlinkSync(cmd_file);
        } catch(err) {
            console.error(err);
        }
    } catch (err) {
        console.error(err);
    };
};