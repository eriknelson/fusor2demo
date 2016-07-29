import * as React from 'react';
import { Grid, Jumbotron, Row, Col } from 'react-bootstrap';
import TasksDemo from '../../tasks/components/TasksDemo';

class Layout extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <Grid>
          <Row>
            <Col xs={12}>
              <h2 className="header">Fusor 2 Demo</h2>
              <Jumbotron>
                <TasksDemo/>
              </Jumbotron>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Layout;
