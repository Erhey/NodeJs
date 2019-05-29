const mongoose = require("mongoose")
const dao = require("../models/Dao/Dao")
const colors = require("colors")
const connectionSchema = require("../Schema/ConnectionSchema")

exports.userMng = (req, res) => { res.render('userMng') }
