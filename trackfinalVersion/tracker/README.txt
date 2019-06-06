Pour faire fonctionner le tracking sous votre application suivre les consignes suivante :

Ajouter en haut de votre server la ligne suivante :

const tracker = require("./tracker/tracker")

ET ajouter juste avant les routers la ligne suivante :
app.use("/", (req, res, next) => tracker.track(req, res, next))
