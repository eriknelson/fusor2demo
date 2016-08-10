const path = require('path');

////////////////////////////////////////////////////////////
// Third-party helper libs
////////////////////////////////////////////////////////////
const uuid = require('uuid4');
const merge = require('merge');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const webpack = require('webpack');
const config = require('./config/webpack.dev');
const compiler = webpack(config);

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

////////////////////////////////////////////////////////////
// socket.io
////////////////////////////////////////////////////////////
io.on('connection', socket => {
  console.log('user connected!');
  socket.on('disconnect', () => console.log('user disconnected'));
});
////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

const tasks = {};
app.post('/tasks', (req, res) => {
  console.log(req.body);
  executeNewTask(req.body.task).then(task => {
    const newTaskId = task.id;
    const tickToComplete = genTickToComplete();
    const tickPeriod = genTickPeriod();

    task.progress = 0;
    newTask = {
      task: task,
      ticks: 0
    };

    res.send({task})

    const tickf = () => {
      const taskRecord = tasks[newTaskId];

      if(taskRecord.ticks == tickToComplete) {
        clearInterval(taskRecord.interval);
        taskRecord.task.progress = 1;
        io.emit(taskChannel(taskRecord.task), {task: taskRecord.task});
        delete tasks[newTaskId].interval;
        return;
      }

      const task = taskRecord.task;
      task.progress = (taskRecord.ticks++ / tickToComplete).toPrecision(2);
      io.emit(taskChannel(task), {task});
    };

    newTask['interval'] = setInterval(tickf, tickPeriod);
    tasks[newTaskId] = newTask;
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

function executeNewTask(task) {
  return new Promise((res, rej) => {
    uuid((err, id) => {
      res(merge(task, {id}));
    });
  });
}

function genTickToComplete() {
  return rand(7, 15);
}

function genTickPeriod() {
  return rand(500, 2000);
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function taskChannel(task) {
  return `/task/${task.id}`;
}

