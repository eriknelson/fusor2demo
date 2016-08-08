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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

const tasks = {};
app.post('/tasks', (req, res) => {
  console.log(req.body);
  console.log('executing task name: ', req.body.task.name);
  executeNewTask(req.body.task).then(task => {
    console.log('finished executing task!', task);
    tasks[task.id] = task;
    res.send({task})
  });
});

////////////////////////////////////////////////////////////
// socket.io
////////////////////////////////////////////////////////////
//let counter = 1;
io.on('connection', socket => {
  console.log('user connected!');
  socket.on('disconnect', () => console.log('user disconnected'));
  //const interval = setInterval(() => socket.emit('message', {
    //foo: counter++
  //}), 1000);
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
      console.log('uuid task id -> ', id);
      res(merge(task, {id}));
    });
  });
}
