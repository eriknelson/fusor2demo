import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import { taskActions } from '../actions';

import '../styles/tasks.scss';

class TasksDemo extends Component {
  constructor(props) {
    super(props);

    // Callback bindings
    this.startWork = this.startWork.bind(this);
  }
  startWork() {
    // TOOD: create X tasks (action creator), and start listening
    console.log('starting work clicked');
  }
  render() {
    return (
      <div className="tasks-demo">
        <div className="pending-work">
          <h3>No tasks outstanding</h3>
          <Button bsStyle="primary" bsSize="large" onClick={this.startWork}>
            Start Work
          </Button>
        </div>
      </div>
    );
  }
}

export default TasksDemo;

//const mapStateToProps = (state) => {
//};

//const mapDispatchToProp= (dispatch) => {
//};

//export default connect(mapStateToProps, mapDispatchToProps)(TasksDemo);
