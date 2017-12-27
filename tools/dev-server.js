const express = require('express');
const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');

const config = require('../webpack.config');

/* eslint-disable no-console */

console.log(chalk.bold.cyan('Starting express server in dev mode...'));

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, config));

app.use(require('webpack-hot-middleware')(compiler, config));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../src/index.html'));
});

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.log(chalk.bold.green(`Listening at http://localhost:${port}/`));
});
