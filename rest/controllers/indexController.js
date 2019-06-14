const trackingApi = require("../models/TrackingApi")
const tracker = require("../track/tracker")


exports.index = function (req, res) {
  tracker.saveJourney(req)
  res.send("journeySaved")
};

exports.multiconnectionsAt = (req, res) => {
  if(!req.body.timestamp) {
    res.send("please define timestamp")
  }
  else {
    trackingApi.getMultiConnectionAtTime(req.body.timestamp, result => {
      responseObj = {}
      responseObj.nbrConnection = result
      res.send(responseObj)
    })
  }
}
exports.multiconnectionsRange = (req, res) => {
  if(!req.body.from) {
    res.send("please define from")
  }
  else if(!req.body.to) {
    res.send("please define to")
  }
  else if(!req.body.precision) {
    trackingApi.getMultiConnectionRange(req.body.from, req.body.to, 10, result => {
      res.send(result)
    })
  }
  else {
    trackingApi.getMultiConnectionRange(req.body.from, req.body.to, req.body.precision, result => {
      responseObj = {}
      responseObj.nbrConnection = result
      res.send(responseObj)
    })
  }
}
exports.dangerousRequest = (req, res) => {
  console.log("est")
  trackingApi.getDangerousRequests(req.body.from, result => {
    res.send(result)
  })
}

exports.visitedPages = (req, res) => {
  if(!req.body.from) {
    res.send("please define from")
  }
  else if(!req.body.to) {
    res.send("please define to")
  }
  let visitedPagesList
  trackingApi.getPagesVisitedList(req.body.from, req.body.to, result => {
      visitedPagesList = result
      res.send(visitedPagesList)
  })
}

exports.pagesInfo = (req, res) => {
  if(!req.body.from) {
    res.send("please define from")
  }
  else if(!req.body.to) {
    res.send("please define to")
  }
  let pagesInfo
  trackingApi.getPagesInfo(req.body.from, req.body.to, result => {
      pagesInfo = result
      res.send(pagesInfo)
  })
}
