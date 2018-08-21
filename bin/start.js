#!/usr/bin/env node
const os = require('os');
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

const commandLineArgs = require('command-line-args');

const Utils = require(path.resolve(__dirname, '../libs/Utils.js'));
const optionDefinitions = [
  { name: 'configPath', alias: 'c', type: String },
  { name: 'version', alias: 'v', type: Boolean },
  { name: 'start', alias: 's', type: Boolean },
  { name: 'from', alias: 'f', type: Number },
  { name: 'only', alias: 'o', type: Number },
  { name: 'list', alias: 'l', type: Boolean },
  { name: 'kill', alias: 'k', type: Number },
  { name: 'pause', alias: 'p', type: Number }
];

const argv = commandLineArgs(optionDefinitions);
const command = path.resolve(__dirname, 'start.js');
const cfg = argv.configPath ? argv.configPath : path.resolve(__dirname, '../config.toml');

Utils.readConfig({ configPath: cfg })
.then((config) => {
  const { packageInfo, homeFolder } = config;
  const systemHome = path.resolve(os.homedir(), packageInfo.name);
  const PIDHome = path.resolve(systemHome, 'PIDs');
  return Utils.initialFolder({ homeFolder: systemHome })
  .then(() => Utils.initialFolder({ homeFolder: PIDHome }))
  .then(() => config);
})
.then((config) => {
  const { packageInfo, homeFolder } = config;
  console.log(`\x1b[1m\x1b[32m${packageInfo.name.toUpperCase()}\x1b[0m\x1b[21m v${packageInfo.version}`);
  if(argv.version) {
  } else if(argv.list) {
    Utils.listProcess();
  } else if(argv.kill > -1) {
    Utils.killProcess({ PID: argv.kill })
    .then(() => Utils.listProcess());
  } else if(argv.pause > -1) {
    Utils.killProcess({ PID: argv.pause, pause: true })
    .then(() => Utils.listProcess());
  } else if(!argv.start) {
    const commandArgv = process.argv.slice(2);
    commandArgv.push('-s');

    Utils.initialFolder(config)
    .then((folder) => {
      const outLog = path.resolve(folder, 'out.log');
      const out = fs.openSync(outLog, 'a');
      const err = fs.openSync(outLog, 'a');
      spawn(command, commandArgv, {
        stdio: [ 'ignore', out, err ],
        detached: true
      }).unref();

      setTimeout(() => {
        Utils.listProcess({ packageInfo });
      }, 1000);
    });
  } else if(!!argv.start) {
    Utils.initialAll(argv)
    .then((options) => Utils.initialBots(options))
    .then((Bots) => Utils.startBots({ Bots }))
    .catch((e) => { console.trace(e); })
    //.then((Bots) => Utils.close({ Bots }));
  }
})

