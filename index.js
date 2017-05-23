const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const exec = require('child-process-promise').exec;
const stream = require('stream');
const app = express();

require('dotenv').config({silent: true});

const app_port = process.env.PORT || 8081;
const api_key = process.env.MAILGUN_API_KEY;

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/incoming', (req, res) => {
  const msgUrl = req.body['message-url'];

  return request.get({
    url: msgUrl,
    headers: {
      'Accept': 'message/rfc2822'
    }
  })
    .auth('api', api_key)
    .then(msg => JSON.parse(msg))
    .then(msg => {
      res.status(200).send();
      return pipeToCommand(
        msg['body-mime'],
        "rails r 'Channel::Driver::MailStdin.new(trusted: true)'",
        { cwd: process.env.ZAMMAD_DIR }
      );
    })
    .catch(err => {
      res.status(200).send();
      console.error(err);
    });
});

const pipeToCommand = function(input, cmd, opts) {
  opts = opts || {};
  const promise = exec(cmd, opts);

  const stdinStream = new stream.Readable();
  stdinStream.push(input);
  stdinStream.push(null);
  stdinStream.pipe(promise.childProcess.stdin);

  return promise;
}

const server = app.listen(app_port, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Mailgun hook listening at http://%s:%s", host, port);
});
