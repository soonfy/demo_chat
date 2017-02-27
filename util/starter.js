/**
 *  starter
 */

const cluster = require('cluster');
const cpus = require('os').cpus().length;

cluster.setupMaster({
  exec: './bin/www',
})

if (cluster.isMaster) {
  console.log(`[master] ${process.pid} is running.`);
  for (let i = 0; i < cpus; i += 1){
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`[worker] ${worker.process.pid} is died.`);
  })
} else {
  console.log(`[worker] ${process.pid} is running.`);
}