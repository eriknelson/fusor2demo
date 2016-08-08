import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col } from 'react-bootstrap';
import faker from 'faker';

import { taskActions } from '../actions';

import '../styles/tasks.scss';

const workBatch = 1;

class TasksDemo extends Component {
  constructor(props) {
    super(props);
    this.startWork = this.startWork.bind(this);
  }
  startWork() {
    for(let i = 0; i < workBatch; ++i) {
      this.props.createTask({name: faker.hacker.noun()});
    }
  }
  render() {
    const {tasks} = this.props;
    const taskContent = tasks.size > 0 ? () => {
      return (
        <div className="active-work">
          <ul>
            {tasks.toIndexedSeq().map((task) => {
              return <li key={task.id}>{task.id} -> {task.name}</li>
            })}
          </ul>
        </div>
      );
    } : () => {
      return (
        <div className="pending-work">
          <h3>No tasks outstanding</h3>
        </div>
      );
    };

    return (
      <div className="tasks-demo">
        <Row>
          <Col className="top-task-bar" xs={12}>
            <Button bsStyle="primary" bsSize="large" onClick={this.startWork}>
              Spawn Work
            </Button>
          </Col>
        </Row>
        {taskContent()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {tasks: state.tasks};
};

const mapDispatchToProps = (dispatch) => {
  return {
    createTask: (task) => {
      return dispatch(taskActions.create(task));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TasksDemo);
