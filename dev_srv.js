const path = require('path');
const os = require('os');
const uuid = require('uuid4');
const merge = require('merge');
require('shelljs/global');

const amqp = require('amqplib');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const webpack = require('webpack');
const config = require('./config/webpack.dev');
const compiler = webpack(config);

const bodyParser = require('body-parser');

const tasks = {};

app.use(bodyParser.json());

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

function initSocketIo(done) {
  console.log('initting socket io');
  io.on('connection', socket => {
    console.log('user connected!');
    socket.on('disconnect', () => console.log('user disconnected'));
  });
  done(null, io);
}

function initRabbit(done) {
  console.log('initting rabbit');
  const cxStr = 'amqp://localhost';
  amqp.connect(cxStr).then(cx => {
    cx.createChannel().then(channel => {
      done(null, {
        cx: cx,
        channel: channel
      })
    })
  }).catch(err => (function(){throw err})());
}

function main(err, deps) {
  const io = deps.io;
  const rabbitChannel = deps.rabbit.channel;

  // Subscribe to task messages off rabbit
  const taskQ = `${os.hostname()}.task`;
  rabbitChannel.assertQueue(taskQ, { durable: false });
  rabbitChannel.consume(taskQ, rawMsg => {
    const msg = JSON.parse(rawMsg.content.toString());
    const task_id = msg.task_id;
    const task = tasks[task_id];
    if(task) {
      task.progress = msg.progress;
      io.emit(taskChannel(), {task});
    }
  }, { noAck: true });

  app.post('/tasks', (req, res) => {
    executeNewTask(req.body.task).then(task => {
      tasks[task.id] = task
      res.send({task})
    });
  });

  const port = process.env.PORT || 3000;
  http.listen(port, 'localhost', err => {
    if(err) {
      console.log(err);
      return;
    }

    console.log(`Listening at http://localhost:${port}`);
  });
}

function executeNewTask(task) {
  return new Promise((res, rej) => {
    uuid((err, id) => {
      const do_work = path.join(__dirname, `do_work.py ${id}`);
      exec(do_work, { async:true });
      res(merge(task, {id}));
    });
  });
}

function taskChannel() {
  return `/task`;
}

const a = require('async');
a.parallel({
  rabbit: initRabbit,
  io: initSocketIo
}, main);
