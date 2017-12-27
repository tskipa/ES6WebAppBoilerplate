const webpack = require('webpack');
const chalk = require('chalk');
const config = require('../webpack.config');
const fs = require('fs-extra');

/* eslint-disable no-console */

process.env.NODE_ENV = 'production'; // this assures the Babel dev config (for hot reloading) doesn't apply.
fs
  .emptyDir('./build')
  .then(() => {
    console.log(
      chalk.cyan(
        'Generating minified bundle for production via Webpack. This will take a moment...',
      ),
    );
    webpack(config, (err, stats) => {
      if (err) {
        console.log(chalk.bold.red(err));
        return 1;
      }

      const jsonStats = stats.toJson();

      if (jsonStats.hasErrors) {
        return jsonStats.errors.map(error => console.log(chalk.red(error)));
      }
      if (jsonStats.hasWarnings) {
        console.log(
          chalk.bold.yellow('Webpack generated the following warnings: '),
        );
        jsonStats.warnings.map(warning => console.log(chalk.yellow(warning)));
      }
      console.log(
        chalk.green(
          "Your app has been compiled in production mode and written to /build. It's ready to roll!",
        ),
      );
      console.log(
        stats.toString({
          chunks: false,
          colors: true,
        }),
      );
      return 0;
    });

    fs.copySync(
      './assets/images/flake.png',
      './build/resources/images/flake.png',
    );
  })
  .catch(err => {
    console.error(err);
  });
