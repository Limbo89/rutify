const session = require('express-session');
function check(req, res){
    console.log(req.session);
}
module.exports = check;