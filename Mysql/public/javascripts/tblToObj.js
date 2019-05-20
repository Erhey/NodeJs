// console.log("Salut la company")
const mongo = require("mongodb").MongoClient

	const url = "mongodb://localhost:27017"

function connectMongo() {
  return new Promise((resolve, reject) => {
	mongo.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) {
        reject(err)
      }
      else {
        resolve(db)
      }
    })
  })
}
function insertMongo(db) {
  return new Promise((resolve, reject) => {
    let dbo = db.db("crud_node_test")
    let myobj = { name: "Bobby", address: "Highway 37" };
    dbo.collection("Users").insertOne(myobj, function(err, res) {
      if (err){
        reject(err)
      } else {
      	console.log("test")
        resolve("1 document inserted")
        db.close()
      }
    })
  })
}

async function doWork(){
	let db = await connectMongo()
	console.log("connection Mondo success")
	let insertStatus = await insertMongo(db)
	console.log("insert Success")
}

doWork()

// String.prototype.reverse = function () {
// 	return this.split('').reverse().join('');
// };
// var tblToObj = function() {
// 	this.formatSqlTablesString = function(tablesString){
// 		var regCommentIgnore = /\/\*[\s\S]*?\*\/|([^\\:]|^)--.*$/gm;
// 		var regTableQuoteFormator = /\"/g;
// 		var regTableSpaceFormator = /[\t\n\r\s]+/g;
// 		tablesString = tablesString.replace(regCommentIgnore,"");
// 		tablesString = tablesString.replace(/\\\"/g, "aA\\2bE").replace(/\\\'/g, "aA\\2bF");
// 		tablesString = this.toSingleQuote(tablesString);
// 		tablesString = this.replaceIfNotUnderSingleQuote(tablesString, "\`","");
// 		tablesString = tablesString.replace(regTableSpaceFormator, " ");
// 		tablesString = tablesString.replace(/aA\\2bE/g, "\"	").replace(/aA\\2bF/g, "\\\'");
// 		return tablesString.trim();
// 	};
	
	
// 	this.separateTable = function(tablesString){
// 		tablesString = this.replaceIfNotUnderSingleQuote(tablesString, ";", "\n");
// 		return tablesString.split("\n");
// 	}; 
// 	this.tableToObj = function(separatedTablesArray){
// 		var regTableReader = /^create\s*table\s*(if\s*not\s*exists\s*)?([\w\$_]*)\s*\(\s*(.*)\).*$/i;
		
// 		var regCheck1 = /^\s?check\s?(\(.*)\s?\)/i;
// 		var regCheck2 = /^\s?constraint\s[\w\$_]*\scheck\s?(\(.*)\s?\)/i;
// 		var regCheck3 = /^\s?(primary\skey\s?(\(.*))\s?\)/i;
// 		var regCheck4 = /^\s?constraint\s[\w\$_]*\s(primary\skey\s?(\(.*))\s?\)/i;
// 		var regCheck5 = /^\s?(foreign\skey\s?(\(.*))\s?\)/i;
// 		var regCheck6 = /^\s?constraint\s[\w\$_]*\s(foreign\skey\s?(\(.*))\s?\)/i;
// 		var tableContent = [];
		
// 		var escapedStr = "";
		
// 		var tableObj = [];
// 		var columnsStr = "";
// 		var columnsArr = [];
// 		for(j = 0; j < separatedTablesArray.length; j++){
// 			tableContent = separatedTablesArray[j].trim().match(regTableReader);
// 			if(tableContent != null){
				
// 				tableObj[j] = {};
// 				tableObj[j].tableName = tableContent[2];
// 				tableObj[j].columns = [];
// 				columnsStr = tableContent[3];
// 				columnsArr = this.splitColumns(columnsStr);
// 					for(v = 0; v < columnsArr.length; v++){
// 					if(columnsArr[v].search(regCheck1) != -1 || 
// 						columnsArr[v].search(regCheck2) != -1 || 
// 						columnsArr[v].search(regCheck3) != -1 || 
// 						columnsArr[v].search(regCheck4) != -1 || 
// 						columnsArr[v].search(regCheck5) != -1 || 
// 						columnsArr[v].search(regCheck6) != -1){
// 							var constraint = this.getConstraintOutColDef(columnsArr[v]);
// 							var constraintColName = this.getColNameFromConstraint(tableObj[j],constraint);
// 							for (n = 0; n < tableObj[j].columns.length; n++) {
// 								if (constraintColName.indexOf(tableObj[j].columns[n].colName) >= 0){
// 									tableObj[j].columns[n].constraint.push(constraint);
// 								}
// 							}
// 					} else {
// 						tableObj[j].columns[v] = {};
// 						tableObj[j].columns[v].colName = "";
// 						tableObj[j].columns[v].type = "";
// 						tableObj[j].columns[v].constraint = [];
// 						tableObj[j].columns[v].colName = this.getColumnName(columnsArr[v]);
// 						tableObj[j].columns[v].type = this.getColumnType(columnsArr[v]);
// 						tableObj[j].columns[v].constraint = [];
// 						tableObj[j].columns[v].constraint = this.getConstraintOnColDef(columnsArr[v]);
// 					}
// 				}
// 			} 
// 			else if (separatedTablesArray[j] != ""){
// 				escapedStr += "BLOCK [" + j + "]--------------------------------------------------------------------------------------\n\n" + separatedTablesArray[j] + "\n\n\n--------------------------------------------------------------------------------------\n\n";
// 			} else {
// 				// ignore empty strings
// 			}
// 		}
// 		return tableObj;
// 	};
// 	this.splitColumns = function(columnsStr){
// 		var regexDot = /,/g;
// 		var result;
// 		var indices = [];
// 		var retArr = [];
// 		var quoteCount = 0;
// 		var openBracketCount = 0;
// 		var closeBracketCount = 0;
// 		while (result = regexDot.exec(columnsStr)) {
// 		    indices.push(result.index);
// 		}
// 		var strToCheck = "";
// 		for(k = 0; k < indices.length; k++){
// 			strToCheck = columnsStr.substring(indices[k]);
			
// 			if(strToCheck.search(/\'/g) != -1){
// 				if(strToCheck.search(/\\\'/g) != -1){
// 					quoteCount = strToCheck.match(/\'/g).length - strToCheck.match(/\\\'/g).length;
// 				} else {
// 					quoteCount = strToCheck.match(/\'/g).length;
// 				}
// 			}else{
// 				quoteCount = 0;
// 			}	
// 			if(quoteCount % 2 == 1){
// 				indices.splice(k, 1);
// 				k--;
// 			} else {
// 				strToCheck = strToCheck.reverse().replace(/(\'(?![\\])([\s\S]*?)\'(?![\\]))/g, '').reverse();
// 				if(strToCheck.search(/\(/g) != -1){
// 				openBracketCount = strToCheck.match(/\(/g).length;
// 				}else{
// 					openBracketCount = 0;
// 				}
// 				if(strToCheck.search(/\)/g) != -1){
// 				closeBracketCount = strToCheck.match(/\)/g).length;
// 				}else{
// 					closeBracketCount = 0;
// 				}
// 				if(closeBracketCount > openBracketCount){
// 					indices.splice(k, 1);
// 					k--;
// 				}
// 			}
// 		}
// 		retArr.push(columnsStr.substring(0,indices[0]));
// 		for(k = 1; k < indices.length; k++) {
// 			retArr.push(columnsStr.substring(indices[k - 1] + 1,indices[k]));
// 		}
// 		retArr.push(columnsStr.substring(indices[indices.length - 1] + 1));
// 		return retArr;
// 	};
	
		
// 	this.getColumnName = function(columnDefinition){
// 		columnDefinition = columnDefinition.trim();
// 		var regColName = /^([\w\$_]*)/;
// 		return columnDefinition.match(regColName)[1];
// 	};
// 	this.getConstraintOnColDef = function (columnDefinition){
// 		var constraintArr = [];
// 		// Check if CHECK or Constraint is on line 
// 		//var regCheckConstraint = /(constraint|check)(?=([^\']*\'[^\']*\')*[^\']*$)/i;
// 		if(columnDefinition != this.replaceIfNotUnderSingleQuote(columnDefinition,"check","")){
// 			alert("Please do not define your constraints on columns Name. NotGoodFormatError was found close to : \n\n\n" + columnDefinition);
// 			return;
// 		} else {
// 			// Check On line REGEX
// 			var regCheckPK = /primary\skey/i;
// 			var regCheckFK = /foreign\skey/i;
// 			var regCheckNotNull = /not\snull/i;
// 			var regCheckNull = /null/i;
// 			var regCheckUnsigned = /unsigned/i;
// 			var regCheckAutoIncr = /auto_increment/i;
// 			var regCheckUnique = /unique/i;
// 			var regCheckDefault = /(default\s*(([\'\`](.*)[\'\`])|[\d\.\%]+))/i;
// 			var regCheckDefaultErrCheck = /default/i;
			
// 			if(columnDefinition.search(regCheckPK) != -1) {
// 				constraintArr.push("primary key");
// 			}
// 			if(columnDefinition.search(regCheckFK) != -1) {
// 				constraintArr.push("foreign key");
// 			}
// 			if(columnDefinition.search(regCheckNotNull) != -1) {
// 				constraintArr.push("not null");
// 			}
// 			else if(columnDefinition.search(regCheckNull) != -1) {
// 				constraintArr.push("null");
// 			}
// 			if(columnDefinition.search(regCheckUnsigned) != -1) {
// 				constraintArr.push("unsigned");
// 			}
// 			if(columnDefinition.search(regCheckAutoIncr) != -1) {
// 				constraintArr.push("auto_increment");
// 			}
// 			if(columnDefinition.search(regCheckUnique) != -1) {
// 				constraintArr.push("unique");
// 			}
// 			if(columnDefinition.search(regCheckDefault) != -1) {
// 				constraintArr.push(columnDefinition.match(regCheckDefault)[1]);
// 			} else if (columnDefinition.search(regCheckDefaultErrCheck) != -1){
// 				alert("Find the default key word but could not get the value on line : \n\n\n" + columnDefinition + "\n\n\nPlease Check your syntax. Numbers could be written withou quote. However String should be between quote to simplify parsing.");
// 			}
// 		}
// 		return constraintArr;
// 	};
// 	this.getColNameFromConstraint = function(currTable, constraint){
// 		var regexStr = "";
// 		var regexFlg = "gi";
// 		regexStr = "\\b(";
// 		for(i = 0; i < currTable.columns.length; i++){
// 			regexStr += currTable.columns[i].colName + "|";
// 		}
// 		regexStr = regexStr.substring(0, regexStr.length - 1); 
// 		regexStr += ")\\b";
// 		var colRegex = new RegExp(regexStr,regexFlg);
// 		return constraint.match(colRegex);
// 	};
// 	this.getConstraintOutColDef = function (constraintDefinition){
		
// 		// Check Out Line regex
// 		var regCheck1 = /^\s*check\s*(\(.*\))\s*$/i;
// 		var regCheck2 = /^\s*constraint\s[\w\$_]*\scheck\s*(\(.*\))\s*$/i;
// 		var regCheck3 = /^\s*(primary\skey\s*\(.*\))\s*/i;
// 		var regCheck4 = /^\s*constraint\s[\w\$_]*\s(primary\skey\s*\(.*\))\s*/i;
// 		var regCheck5 = /^\s*(foreign\skey\s*\(.*\))\s*/i;
// 		var regCheck6 = /^\s*constraint\s[\w\$_]*\s(foreign\skey\s*\(.*\))\s*/i;
		
// 		if(constraintDefinition.search(regCheck1) != -1){
// 			return constraintDefinition.match(regCheck1)[1];
// 	 	} 
	 	
// 	 	else if (constraintDefinition.search(regCheck2) != -1) {
// 			return constraintDefinition.match(regCheck2)[1];
// 	 	} 
	 	
// 	 	else if (constraintDefinition.search(regCheck3) != -1) {
// 			return "primary key";
// 	 	} 
	 	
// 	 	else if (constraintDefinition.search(regCheck4) != -1) {
// 			return "primary key";
// 	 	} 
	 	
// 	 	else if (constraintDefinition.search(regCheck5) != -1) {
// 			return "foreign key";
// 	 	} 
	 	
// 	 	else if (constraintDefinition.search(regCheck6) != -1) {
// 			return "foreign key";
// 	 	} 
	 	
// 	 	else {
// 	 		alert("Error while getting constraint. Error close to : \n\n\n" + constraintDefinition);	
// 	 		return;
// 	 	}
// 		return "toto";
// 	};
// 	this.getColumnType = function (columnDefinition){
// 		columnDefinition = columnDefinition.trim();
// 		var type = columnDefinition.match(/^[\w\$_]*\s([\w\$_\(\)\,]*)/)[1];
		
// 		if (type.match(/^(int|tinyint|smallint|mediumint|bigint|float|double|decimal|date|datetime|timestamp|time|year|char|varchar|blob|text|tinyblob|tinytext|mediumblob|mediumtext|longblob|longtext)/i)) {
// 		    return type;
// 		} else {
// 			alert("The current columns type isn't formattable by this convertor. Column Defition : \n\n\n" + columnDefinition);
// 			return;
// 		}		
// 	};
// 	this.replaceIfNotUnderSingleQuote = function(strToModify, patFrom, patTo){
// 		var result;
// 		var indices = [];
// 		var quoteCount = 0;
// 		var patFromLength = patFrom.length;
// 		var regPatFrom = new RegExp(patFrom,"ig");
// 		while (result = regPatFrom.exec(strToModify)) {
// 		    indices.push(result.index);
// 		}
// 		var strToCheck = "";
// 		var modifiedStr = "";
// 		modifiedStr = strToModify.substring(0, indices[0]);
// 		for(k = 0; k < indices.length; k++){
// 			strToCheck = strToModify.substring(indices[k]);
			
// 			if(strToCheck.search(/\'/g) != -1){
// 				if(strToCheck.search(/\\\'/g) != -1){
// 					quoteCount = strToCheck.match(/\'/g).length - strToCheck.match(/\\\'/g).length;
// 				} else {
// 					quoteCount = strToCheck.match(/\'/g).length;
// 				}
// 			}else{
// 				quoteCount = 0;
// 			}
// 			if(quoteCount % 2 == 0){
// 				if(k + 1  < indices.length) {
// 					modifiedStr +=  patTo + strToModify.substring(indices[k] + patFromLength, indices[k + 1]);
// 				} else {
// 					modifiedStr += patTo + strToModify.substring(indices[k] + patFromLength);
// 				}
// 			}else {
// 				if(k + 1  < indices.length) {
// 					modifiedStr +=  strToModify.substring(indices[k], indices[k + 1]);
// 				} else {
// 					modifiedStr += strToModify.substring(indices[k]);
// 				}
// 			}
// 		}
// 		return modifiedStr;
// 	};
// 	this.replaceIfUnderSingleQuote = function(strToModify, patFrom, patTo){
// 		var result;
// 		var indices = [];
// 		var quoteCount = 0;
// 		var patFromLength = patFrom.length;
// 		var regPatFrom = new RegExp(patFrom,"ig");
// 		while (result = regPatFrom.exec(strToModify)) {
// 		    indices.push(result.index);
// 		}
// 		var strToCheck = "";
// 		var modifiedStr = "";
// 		modifiedStr = strToModify.substring(0, indices[0]);
// 		for(k = 0; k < indices.length; k++){
// 			strToCheck = strToModify.substring(indices[k]);
			
// 			if(strToCheck.search(/\'/g) != -1){
// 				if(strToCheck.search(/\\\'/g) != -1){
// 					quoteCount = strToCheck.match(/\'/g).length - strToCheck.match(/\\\'/g).length;
// 				} else {
// 					quoteCount = strToCheck.match(/\'/g).length;
// 				}
// 			}else{
// 				quoteCount = 0;
// 			}
// 			if(quoteCount % 2 == 1){
// 				if(k + 1  < indices.length) {
// 					modifiedStr +=  patTo + strToModify.substring(indices[k] + patFromLength, indices[k + 1]);
// 				} else {
// 					modifiedStr += patTo + strToModify.substring(indices[k] + patFromLength);
// 				}
// 			}else {
// 				if(k + 1  < indices.length) {
// 					modifiedStr +=  strToModify.substring(indices[k], indices[k + 1]);
// 				} else {
// 					modifiedStr += strToModify.substring(indices[k]);
// 				}
// 			}
// 		}
// 		return modifiedStr;
// 	};
// 	this.firstSingleQuoteIndex = function(str){
// 		var res = /\'/.exec(str);
// 		if(res == null){return str.length;}
//  		else {return res.index;}
// 	};
// 	this.firstDoubleQuoteIndex = function(str){
// 		var res = /\"/.exec(str);
// 		if(res == null){return str.length;}
//  		else {return res.index;}
// 	};
// 	this.toSingleQuote = function(str){
		
// 		var indexSingleQuote = 0;
// 		var indexDoubleQuote = 0;
// 		var retStr = "";
		
// 		while(str != ""){
// 			indexSingleQuote = this.firstSingleQuoteIndex(str);
// 			indexDoubleQuote = this.firstDoubleQuoteIndex(str);
			
// 			if(indexDoubleQuote < indexSingleQuote){
// 				retStr += str.substring(0, indexDoubleQuote + 1).replace("\"", "'");
// 				str = str.substring(indexDoubleQuote + 1);
// 				indexDoubleQuote = this.firstDoubleQuoteIndex(str);
// 				retStr += str.substring(0, indexDoubleQuote + 1).replace("\"", "'").replace("'", "\\'");
// 				str = str.substring(indexDoubleQuote + 1);
// 			} else {
// 				retStr += str.substring(0, indexSingleQuote + 1);
// 				str = str.substring(indexSingleQuote + 1);
// 				indexSingleQuote = this.firstSingleQuoteIndex(str);
// 				retStr += str.substring(0, indexSingleQuote + 1);
// 				str = str.substring(indexSingleQuote + 1);
// 			}
// 		}
// 		return retStr;
// 	};
		
// };