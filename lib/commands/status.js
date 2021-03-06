/*
 * status.js: Titanium CLI status command
 *
 * Copyright (c) 2012, Appcelerator, Inc.  All Rights Reserved.
 * See the LICENSE file for more information.
 */

var appc = require('node-appc'),
	async = require('async');

exports.desc = __('displays session information');

exports.config = function (logger, config, cli) {
	return {
		skipBanner: true,
		noAuth: true,
		options: {
			output: {
				abbr: 'o',
				default: 'report',
				desc: __('output format'),
				values: ['report', 'json']
			}
		}
	};
};

exports.run = function (logger, config, cli) {

	async.parallel({
		auth: function (next) {
			next(null, appc.auth.status());
		},
		project: function (next) {
			// TODO: Implement project status
			next(null, {});
		}
	}, function (err, results) {
		switch(cli.argv.output) {
			case 'report':
				logger.banner();
				if (results.auth.loggedIn) {
					logger.log(__('You are currently %s', 'logged in'.cyan) + '\n');
				} else if (results.auth.expired) {
					logger.log(__('You are currently %s', 'logged out'.cyan) + '\n');
				} else {
					logger.log(__('You are currently %s. Offline support available for %s.',
						'logged out'.cyan,
						appc.time.prettyDiff(Date.now(), results.auth.offlineExpires, {
							showFullName: true,
							hideMS: true,
							colorize: true
						})) + '\n');
				}
				break;
			case 'json':
				logger.log(JSON.stringify(results.auth));
				break;
		}
	});
};