var express = require('express');
var router = express.Router();
var PythonShell = require('python-shell');

router.post('/', function(request, response, next) {
  message = request.body
  var options = {
    args: [message.text, message.move_message]
  };
  PythonShell.run('display_message.py', options, function (err, results) {
    if (err) {
      console.log(err);
    }
  });
  response.status(202).json({ message: 'sent' });   
});

module.exports = router;
