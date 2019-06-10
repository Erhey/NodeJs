Pour lancer l'application ajouter un middleware au server :
const tracker = require("./track/tracker")
app.use("/", (req, res, next) => tracker.track(req, res, next))



Attention ! Il faut le placer juste avant les routeurs !