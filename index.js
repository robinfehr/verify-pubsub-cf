const dbWrapper = require('verify-pubsub');
const cfenv = require('cfenv');
const bunyan = require('bunyan');
const LogzioBunyanStream = require('logzio-bunyan');
const PrettyStream = require('bunyan-prettystream');

// Setup logger
const loggerOptions = {
  name: 'exivo',
  level: 'info'
};

loggerOptions.streams = [];

const token = 'iXZoaVdklLxNXdoNTXNsitiiNeQMtPIH';
const logzioStream = new LogzioBunyanStream({ token, type: 'logs', host: 'listener-eu.logz.io' });
loggerOptions.streams.push({
  type: 'raw',
  stream: logzioStream
});

const prettyStream = new PrettyStream();
prettyStream.pipe(process.stdout);
loggerOptions.streams.push({
  type: 'raw',
  stream: prettyStream
});
console.log('Logger getting initialized');
const logger = bunyan.createLogger(loggerOptions);
console.log('Logger initialized');

// Bind Services
const appEnv = cfenv.getAppEnv();
const services = appEnv.getServices();
Object.values(services).forEach(service => {
  const credentials = service.credentials;
  const subLogger = logger.child({ serviceName: service.name });
  const settings = {
    database: 'redis-setget',
    host: credentials.host,
    port: credentials.port,
    password: credentials.password,
    progress: false,
    logger: subLogger
  };
  if (process.argv[2] === 'publish') {
    subLogger.info(`Publisher for service ${service.name} is getting setup`);
    new dbWrapper(settings, (db) => {
      db.startPublish('foobar1337', 10);
    });
  } else if (process.argv[2] === 'subscribe') {
    subLogger.info(`Listener for service ${service.name} is getting setup`);
    new dbWrapper(settings, (db) => {
      db.startListen('foobar1337', 10);
    });
  } else {
    console.error('Error occured - Could not parse arguments.');
  }
});

// Start

