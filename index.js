
/**
 * OpenIoD module for connecting ILM sensor system 
 *
 * @param  {String} ##todo 
 * @return {String}
 */
 
 "use strict";

 
var fs 		= require('fs');
var request = require('request');
var sys 	= require('sys');
//var cassandra = require('../../openiod-cassandra');
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
var openIodConnector_ILM_CsvHistory			= require('OpenIoD-Connector-ILM/observation-csv-history');	
var openIodConnector_ILM_MongoAggregation	= require('OpenIoD-Connector-ILM/observation-aggregation');	
var openIodConnector_ILM_Airbox				= require('OpenIoD-Connector-ILM/airbox');	
	 
var localModelFolders 	= [];
var models 				= {};

var csvHistoryUrl = 'http://82.201.127.232:8080/csv/';
var airboxCsvFileName = '25_cal.csv';
var tmpFolder;


module.exports = {


	loadAllModels: function(folder) {
	
		var context = this;
		var modelLocalPath = __dirname+'/model/';
		var localModelIndex = -1;
		localModelFolders=[]; // reset localModels array
		fs.readdir(modelLocalPath, function (err, files) {
			if (err) { console.log("Local model folder not found: " + modelLocalPath);
			} else {
				localModelFolders 	= files;
  				console.log("Local models: " + localModelFolders.toString());
				
				for (var i=0;i<localModelFolders.length;i++) {
					if (localModelFolders[i] == 'README.md' ) {
						continue;
					}
					context.loadModel(localModelFolders[i]);
				}
			}
		});
	},

	loadModel: function(modelFolderName) {
	
		var modelFolderLocalPath = __dirname+'/model/'+modelFolderName;
		
		var sweDataRecordJson = fs.readFileSync(modelFolderLocalPath+'/datarecord.json');
		models[modelFolderName] = {};
		var model = models[modelFolderName];
		console.log('model: ' +  modelFolderName);
		//console.log('  data: ' + sweDataRecordJson);
		var _sweDataRecord = JSON.parse(sweDataRecordJson);
		model.sweDataRecord = _sweDataRecord.sweDataRecord;
	},

	getModel: function(modelName) {	
		return models[modelName];		
	},
	
	getModels: function() {	
		return models;		
	},

	getFeatureOfInterest: function (featureOfInterest, param, callback) {
		//openIodConnector_ILM_CsvHistory.getFeatureOfInterest(featureOfInterest, param, function() {
			console.log('End of getFeatureOfInterest');
 			callback();
		//} );
	},

	getObservationHistory: function (featureOfInterest, param, callback) {
		openIodConnector_ILM_CsvHistory.reqCsvHistory(featureOfInterest, param, function() {
			console.log('End of getObservationHistory');
 			callback();
		} );
	},
	
	getData: function (featureOfInterest, param, callback) {
		openIodConnector_ILM_MongoAggregation.getData(featureOfInterest, param, callback);
	},

	getAireasAqi: function (param, callback) {
		openIodConnector_ILM_Airbox.getAireasAqi(param, callback);
	},

	getAireasHistQ: function (param, callback) {
		openIodConnector_ILM_MongoAggregation.getAireasHistQ(param, callback);
	},

	getAirboxData: function (featureOfInterest, param, callback) {
		openIodConnector_ILM_Airbox.getData(featureOfInterest, param, callback);
	},

	getAireasEcnHistoryData: function (featureOfInterest, param, callback) {
		openIodConnector_ILM_Airbox.getData(featureOfInterest, param, callback);
	},

	getCbsBuurtFromPoint: function (param, callback) {
		openIodConnector_ILM_Airbox.getCbsBuurtFromPoint(param, callback);
	},

	getCbsBuurtNearestAirboxes: function (param, callback) {
		openIodConnector_ILM_Airbox.getCbsBuurtNearestAirboxes(param, callback);
	},

	getCbsBuurtProjectEHVAirport: function (param, callback) {
		openIodConnector_ILM_Airbox.getCbsBuurtProjectEHVAirport(param, callback);
	},

	merge: function (featureOfInterest, param, callback) {
		openIodConnector_ILM_MongoAggregation.merge(featureOfInterest, param, callback);
	},

	getProjectAirportData: function (param, callback) {
		openIodConnector_ILM_Airbox.getProjectAirportData(param, callback);
	}


};




