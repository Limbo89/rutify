function check(req, res){
    let session = req.session;
    return session.user.name ? { auth: true } : { auth: false }
}
module.exports = check;