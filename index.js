const dbWrapper = require('verify-pubsub');
const cfenv = require('cfenv');

const appEnv = cfenv.getAppEnv();
const redis = appEnv.getService('redis').credentials;

const settings = {
  database: 'redis',
  host: redis.host,
  port: redis.port,
  password: redis.password,
  progress: false
};

if (process.argv[2] === 'publish') {
  new dbWrapper(settings, (db) => {
    db.startPublish('foobar1337', 10);
  });
} else if (process.argv[2] === 'subscribe') {
  console.info('Subsciber is getting setup');
  new dbWrapper(settings, (db) => {
    console.log('startSubscribe');
    db.startSubscribe('foobar1337');
  });
} else {
  console.error('Error occured - Could not parse arguments.');
}

