const os = require('os');
const cluster = require('cluster');
const config = require('config');
const server = require('./server');
const log = require('./src/logger');
const {version, name, description} = require('./package');


const port = config.get('port');
const cpus = os.cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        log.info(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
        log.info('Starting a new worker');
        cluster.fork();
    });
} else {
    server.get('/', (req, res) => {
        res.json({
            status: `${name} is up and running.`,
            description,
            version,
        });
    });

    server.listen(port, () => {
        log.info(`${name} is running on port ${port}`);
    });
}
