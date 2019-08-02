
// const connection = require("link_mysql_util")
const validator = require("validator")
exports.get = (req, res) => {
    res.send("test")
    if(req.query === undefined){
        // badrequest
    }
    // Ecrire a la main l'id de l'utilisateur ici :
    tracker.saveAllJourney()
    res.send("journeySaved")
}
exports.post = (req, res) => {
    
    // Ecrire a la main l'id de l'utilisateur ici :
    tracker.saveAllJourney()
    res.send("journeySaved")
}
exports.delete = (req, res) => {
    
    // Ecrire a la main l'id de l'utilisateur ici :
    tracker.saveAllJourney()
    res.send("journeySaved")
}
exports.put = (req, res) => {
    
    // Ecrire a la main l'id de l'utilisateur ici :
    tracker.saveAllJourney()
    res.send("journeySaved")
}

