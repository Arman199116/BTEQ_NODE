const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

const bteq_path = `./bteq_dir/psql -m 1 < ${__dirname}/`;
const out_file = ` > ${__dirname}/out.bteq`;

module.exports = async(cmd_file) => {
    try {
        const {stdout, stderr} = await exec(`${bteq_path}${cmd_file}${out_file}`);
        console.log('stdout:', stdout);
        fs.unlinkSync(cmd_file);
    } catch(err) {
        console.error(err);
    };
};