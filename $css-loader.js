'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

module.exports = function(opt) {
	opt = opt || {};
	opt.maxWeightResource = opt.maxWeightResource || 10240;
	opt.maxAllWeightResource = opt.maxAllWeightResource || -1;
	opt.startWeightResource = opt.startWeightResource || 0;
	opt.isMoreImg = opt.isMoreImg || false;

	// create a stream through which each file will pass
	return through.obj(function(file, enc, callback) {
		var self = this;
		if (file.isNull()) {
			self.push(file);
			// do nothing if no contents
			return callback();
		}

		if (file.isStream()) {
			self.emit('error', new gutil.PluginError('gulp-html-loader', 'Streaming not supported'));
			return callback();
		}

		if (file.isBuffer()) {
			var content = String(file.contents);
			var ID = String(file.relative).replace("\\", "\\\\").replace(/.css$/, "").replace(/[\/|\.]/, "_");
			content = content.replace(/\'/g, "\\'");
			var output = "Container.directSet('___Css_"+ID+"', '"+content+"');";
			
			file.contents = new Buffer(output);

			return callback(null, file);
		}
	});
};