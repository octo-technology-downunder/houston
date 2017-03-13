"use strict";

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const Alexa = require('alexa-sdk');
const https = require('https');
const http = require('http');
const confirmation_codes = ['kangaroo', 'koala', 'shark', 'spider', 'wallaby', 'platypus', 'crocodile', 'whale']

const handlers = {
  'LaunchRequest': function () {
    this.emit(':ask', "Hello, Ready to deploy");
  },

  'Deploy': function () {
    console.log(this.event.request.intent);
    console.log(this.event.request.intent.slots);
    let application = this.event.request.intent.slots.application.value.toLowerCase();
    let environment = this.event.request.intent.slots.environment.value.toLowerCase();
    var codes_array_size = confirmation_codes.length;
    var code_index = Math.floor(Math.random() * codes_array_size);
    var confirmation_code = confirmation_codes[code_index];
    var post_data = JSON.stringify({"text":application + ' code:\n' + confirmation_code,"move_message":"false"});
    var post_options = {
      host: '797a65777a.dataplicity.io',
      port: '443',
      path: '/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    dynamodb.putItem({ "TableName": "houston", "Item" : { "code": {"S": "" + confirmation_code }, "application": {"S": application }, "environment": {"S": environment }}}, (err, data) => {
      if (err) {
        console.log(err);
        this.emit(':tell', "Error when saving confirmation code");
      } else {
        console.log(data);
      }
    });
    var post_request = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
        this.emit(':tell', "Please confirm " + application + " deployment to " + environment);
      }.bind(this));
    }.bind(this));
    console.log(post_data);
    post_request.write(post_data);
    post_request.end();
  },
  
  'Confirm': function () {
    console.log(this.event.request.intent);
    console.log(this.event.request.intent.slots);
    let confirmation_code = this.event.request.intent.slots.code.value.toLowerCase();
    let application;
    let environment;
    dynamodb.getItem({ "TableName": "houston", "Key" : { "code": {"S": "" + confirmation_code }  } }, (err, data) => {
      if (err) {
        console.log(err);
        this.emit(':tell', "Could not retrieve confirmation code");
      } else {
        application = data.Item.application.S;
        environment = data.Item.environment.S;
        console.log("application: " + application);
        console.log("environment: " + environment);
        if (environment === undefined || application === undefined) {
          this.emit(':tell', "Could not retrieve confirmation code");
          return ;
        }
        let post_data = JSON.stringify({"text": application + " deployed\nto " + environment + " :heart:" ,"move_message":"false"});
        let post_options = {
          host: '797a65777a.dataplicity.io',
          port: '443',
          path: '/messages',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        http.get('http://ec2-13-55-186-2.ap-southeast-2.compute.amazonaws.com/job/Deploying%20application/buildWithParameters?token=EFA_EST_MEC_TROP_STYLE&APPLICATION=' + application + '&ENVIRONMENT=' + environment, (error) => {
          console.log(error)
          dynamodb.deleteItem({ "TableName": "houston", "Key" : { "code": {"S": "" + confirmation_code }  } }, (err, data) => {
            console.log(error)
            let post_request = https.request(post_options, function(res) {
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
                this.emit(':tell', "Successfully deployed " + application + " to " + environment);
              }.bind(this));
            }.bind(this));
            console.log(post_data);
            post_request.write(post_data);
            post_request.end();
          });
        });
      }
    });
  },
  'Unhandled': function () {
    this.emit(':ask', "I didn't understand. Can you repeat?");
  }
}

exports.handler = (event, context) => {
  console.log(event);
  console.log("Houston");
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};