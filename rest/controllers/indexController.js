const trackingApi = require("../models/TrackingApi")


exports.index = function (req, res) {
  res.send('test')
};

exports.multiconnectionsAt = (req, res) => {
  if(!req.body.timestamp) {
    res.send("please define timestamp")
  }
  else {
    trackingApi.getMultiConnectionAtTime(req.body.timestamp, result => {
      res.send(result)
    })
  }
}
exports.multiconnectionsRange = (req, res) => {
  if(!req.body.from) {
    res.send("please define from")
  }
  if(!req.body.to) {
    res.send("please define to")
  }
  else {
    trackingApi.getMultiConnectionRange(req.body.from, req.body.to, 10, result => {
      res.send(result)
    })
  }
}
exports.dangerousRequest = (req, res) => {
  trackingApi.getDangerousRequests(req.body.from, result => {
    res.send(result)
  })
}

