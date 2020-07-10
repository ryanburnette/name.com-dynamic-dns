'use strict';

var cron = require('node-cron');
var update = require('./app');
var schedule = process.env.SCHEDULE || '*/15 * * * *'; // default every 15 minutes

cron.schedule(schedule, function () {
  update();
});
