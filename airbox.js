
/**
 * OpenIoD module for connecting ILM sensor system and airbox (meta) data
 *
 * @param  {String} ##todo 
 * @return {String}
 */
 
 "use strict";

 
// var fs 		= require('fs');
// var request 	= require('request');
// var sys 		= require('sys');
 
var pg = require('pg');
var sqlConnString;

function executeSql (query, callback) {
	console.log('sql start: ');
	var client = new pg.Client(sqlConnString);
	client.connect(function(err) {
  		if(err) {
    		console.error('could not connect to postgres', err);
			callback(result, err);
			return;
  		}
  		client.query(query, function(err, result) {
    		if(err) {
      			console.error('error running query', err);
				callback(result, err);
				return;
    		}
    		//console.log('sql result: ' + result);
			callback(result.rows, err);
    		client.end();
  		});
	});
};


module.exports = {

	initDbConnection: function (options) {
		if (options.source != 'mongodb') {
			// PostgreSql
			//console.log(options);
			sqlConnString = options.param.systemParameter.databaseType + '://' + 
				options.param.systemParameter.databaseAccount + ':' + 
				options.param.systemParameter.databasePassword + '@' + 
				options.param.systemParameter.databaseServer + '/' +
				options.param.systemCode + '_' + options.param.systemParameter.databaseName;
		}
	},
	
	getData: function (featureOfInterest, param, callback) {
		if (sqlConnString == null) {
			this.initDbConnection({source:'postgresql', param: param });
		}
		
		if (featureOfInterest ==  'all') {
			this.getAirboxDataAllAirboxes(param, callback);
		}	
	},
	

	
	getAirboxDataAllAirboxes: function (param, callback) {
		var _attribute, _and;
		var _attribute 	= " airbox, airbox_type, airbox_location, airbox_location_desc, airbox_location_type, airbox_postcode, airbox_x, airbox_y, lat, lng ";
		var _from 		= " airbox a ";
		//var _where 		= " 1=1 ";
		//var _groupBy	= "  ";
		//var _orderBy	= _groupBy;
		var _orderBy = ' airbox ';
		
		var query = 'select ' + _attribute + ' from ' + _from + //' where ' + _where + ' group by ' + _groupBy + ' order by ' + 
		_orderBy + ' ;';
		
		console.log('Postgres sql start execute: ' + query);
		executeSql(query, callback);

        return;

    }	


};




