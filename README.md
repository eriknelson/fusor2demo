# Fusor 2 Demo

React+Redux websocket driven client

Node/RabbitMQ/Python backend

### Requirements

Node > 4.4.x

`npm install` to pull node deps

`npm start` launches express dev_srv, also handles webpack builds + HMR

--

python2 + pika

`sudo pip install pika`

Expects RabbitMQ broker running on localhost

`sudo systemctl status rabbitmq-server`

If it's not running...

`sudo systemctl start rabbitmq-server`
