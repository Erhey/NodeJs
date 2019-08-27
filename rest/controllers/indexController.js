
const trackingApi = require('../models/TrackingApi')('CRUD-MYSQL')
const graphApi = require('../models/GraphApi')('CRUD-MYSQL')

exports.multiconnectionsAt = (req, res) => {
  if(!req.body.timestamp) {
    res.send('please define timestamp')
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
    res.send('please define from')
  }
  else if(!req.body.to) {
    res.send('please define to')
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
    res.send('please define from when should we search (parameter : from)')
  }
  else if(!req.body.to) {
    res.send('please define until when shoule we search (parameter : to)')
  }
  let pagesInfo
  trackingApi.getPagesInfo(req.body.from, req.body.to, '', result => {
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
  console.log("test")
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
exports.getUserUUIDList = (req,res) => {
  console.log(req.body)
  trackingApi.getUserUUIDList(req.body, uuid_list => {
    res.send(uuid_list)
  })
}