import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col } from 'react-bootstrap';
import faker from 'faker';
import Progress from 'react-progressbar';

import { taskActions } from '../actions';

import '../styles/tasks.scss';

const workBatch = 10;

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
        <div className="active-work clearfix">
          <ul>
            {tasks.toIndexedSeq().map((task) => {
              let liClassName = 'task-progress clearfix';
              if(task.progress === 1) {
                liClassName += " progress-complete";
              }

              return (
                <li key={task.id} className={liClassName}>
                  <Progress completed={displayPercentage(task.progress)} />
                  <span className="progress-percentage">{`${displayPercentage(task.progress)}%`}</span>
                  <span className="task-name">{task.name}</span>
                </li>
              )
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

function displayPercentage(progress) {
  return Math.round(progress * 100);
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksDemo);
