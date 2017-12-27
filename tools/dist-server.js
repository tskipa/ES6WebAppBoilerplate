const express = require('express');
const path = require('path');
const compression = require('compression');
const open = require('open');

/*eslint-disable no-console */

const port = 3000;
const app = express();

app.use(compression());
app.use(express.static('build'));

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});
