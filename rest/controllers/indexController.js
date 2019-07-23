
const tracker = require("link_tracker")("CRUD-MYSQL", "abc")
const trackingApi = require("../models/TrackingApi")("CRUD-MYSQL")
const graphApi = require("../models/GraphApi")("CRUD-MYSQL")


exports.index = function (req, res) {
  // Ecrire a la main l'id de l'utilisateur ici :
  tracker.saveAllJourney()
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
  let visitedPagesList
  graphApi.getPagesVisitedList(result => {
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
  trackingApi.getPagesInfo(req.body.from, req.body.to, "", result => {
      pagesInfo = result
      res.send(pagesInfo)
  })
}

exports.getGraph = (req, res) => {
  graphApi.getGraphInfoGrouped(result => {
    res.send(result)
  })
}
exports.getGraphFormat = (req, res) => {
  graphApi.getGraphFormat(result => {
    res.send(result)
  })
}
exports.getLiveInfo = (req, res) => {
  graphApi.getLiveInfo(result => {
    res.send(result)
  })
}
exports.updateExcel = (req, res) => {
  graphApi.getGraphInfoGrouped(graph => {
    graphApi.updateExcel(graph, result => {
      res.send(result)
    })
})
}