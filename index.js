const cfenv = require('cfenv');
const dbWrapper = require('verify-pubsub');

const appEnv = cfenv.getAppEnv();
const redis = appEnv.getService('redis1').credentials;

const settings = {
  database: 'redis',
  prefix: 'app_part_denorm_rev_guard',
  host: redis.host,
  port: redis.port,
  password: redis.password
};

if (process.argv[2] === 'publish') {
  new dbWrapper(setting, (db) => {
    db.startPublish(argv.key, argv.interval);
  });
} else if (process.argv[2] === 'subscribe') {
  new dbWrapper(setting, (db) => {
    db.startPublish(argv.key, argv.interval);
  });
} else {
  console.error('Error occured - Could not parse arguments.');
}

