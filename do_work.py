#!/usr/bin/env python
from __future__ import division
from random import randint

import sys
import time
import socket
import pika
import json

RABBIT_CX_STR = "localhost"
TASK_Q = "{0}.task".format(socket.gethostname())

cx = pika.BlockingConnection(pika.ConnectionParameters(RABBIT_CX_STR))
channel = cx.channel()
channel.queue_declare(queue=TASK_Q)

def gen_tick_count():
    return randint(100, 101)

def gen_tick_period():
    return randint(100, 200) / 1000

def tick(task_id, progress):
    channel.basic_publish(
        exchange='', # Default exchange
        routing_key=TASK_Q,
        body=json.dumps({"task_id": task_id, "progress": round(progress,2)})
    )
    print "Ticked {0}".format(progress)

def main():
    if len(sys.argv) < 2:
        print "ERROR: worker must be invoked with a task id as first arg"
        sys.exit(1)

    task_id = sys.argv[1]
    print "============================================================"
    print "Executing task [ {0} ]".format(task_id)
    print "============================================================"

    total_tick_count = gen_tick_count()
    tick_period = gen_tick_period()
    print "total_tick_count -> {0}".format(total_tick_count)
    print "tick_period -> {0}".format(tick_period)

    tick_count = 0
    while tick_count is not total_tick_count:
        progress = tick_count / total_tick_count
        tick(task_id, progress)
        tick_count += 1
        time.sleep(tick_period)

    tick(task_id, 1)
    cx.close()

if __name__ == "__main__":
    main()
