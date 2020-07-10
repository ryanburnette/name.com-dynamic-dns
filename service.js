'use strict';

var cron = require('node-cron');
var update = require('./app');
// default schedule is every 5m to match 300s ttl
var schedule = process.env.SCHEDULE || '*/5 * * * *';

cron.schedule(schedule, function () {
  update();
});
