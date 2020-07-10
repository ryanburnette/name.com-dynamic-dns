'use strict';

require('dotenv').config({});

var publicIp = require('public-ip');
var axios = require('axios');

var username = process.env.USERNAME;
var password = process.env.PASSWORD;
var domain = process.env.DOMAIN;
var host = process.env.HOST;

if (process.env.LOGGING) {
  var AxiosLogger = require('axios-logger');
  axios = axios.create();
  axios.interceptors.request.use(AxiosLogger.requestLogger);
  axios.interceptors.response.use(AxiosLogger.responseLogger);
}

// axios post config
var config = {
  auth: { username, password },
  headers: {
    'Content-Type': 'application/json'
  }
};

function update() {
  var requests = [getRecords(), getIpV4(), getIpV6()];
  return Promise.all(requests).then(function ([records, v4, v6]) {
    return Promise.all([
      updateNameComRecord({
        records,
        type: 'A',
        answer: v4
      }),
      updateNameComRecord({
        records,
        type: 'AAAA',
        answer: v6
      })
    ]);
  });
}

function getRecords() {
  return axios
    .get(`https://api.name.com/v4/domains/${domain}/records`, {
      auth: { username, password }
    })
    .then(function (response) {
      return response.data.records;
    });
}

async function getIpV4() {
  return publicIp
    .v4({
      onlyHttps: true,
      timeout: 5000
    })
    .catch(function (err) {
      // console.error('v4', err);
      return false;
    });
}

async function getIpV6() {
  return publicIp
    .v6({
      onlyHttps: true,
      timeout: 5000
    })
    .catch(function (err) {
      // console.error('v6', err);
      return false;
    });
}

async function updateNameComRecord({ records, type, answer }) {
  if (!answer) {
    return false;
  }
  var arecord = records.find(function (el) {
    return el.host === host && el.type === type;
  });
  if (arecord) {
    if (arecord.answer !== answer) {
      return axios.put(
        `https://api.name.com/v4/domains/${domain}/records/${arecord.id}`,
        {
          type,
          answer
        },
        config
      );
    } else {
      return false;
    }
  } else {
    return axios.post(
      `https://api.name.com/v4/domains/${domain}/records`,
      {
        host,
        type,
        answer,
        ttl: 300 // name.com minimum 300s
      },
      config
    );
  }
}

module.exports = update;
