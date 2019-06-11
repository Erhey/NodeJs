
let express = require('express');
let router = express.Router();
let sanitizeHtml = require('sanitize-html');
 
let dirty = 'some really tacky HTML';
let clean = sanitizeHtml(dirty);

let trackingApi_controller = require("../controllers/trackingApiController")
router.get('/userJourney', trackingApi_controller.userJourney_get)
router.get('/createSuccess', trackingApi_controller.createSuccess)



// sanitized = true or character <> 

"=%^]-\|®™÷×[]³£ß«»©@{}µ«»±~¡^°`•´˜¨¤! »#$%&/()=?*~{};:_> @1234567890’ ^[]²³y<,.-"



// 流れ
//   user_id
//   Date
// numuser => カーブ par page

// pays
// page lenth
// requete avec char spec

module.exports = router;


// trackingAPI/dangerous_users
// trackingAPI/promotions?promo_id=abc&fromDate=YYYY-MM&toDate=YYYY-MM&compare=false
// trackingAPI/Multiconnection?max=false
// trackingAPI/accessTime?page=login