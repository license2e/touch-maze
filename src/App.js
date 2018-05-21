import React, { Component } from 'react';
import { Layer, Stage } from 'react-konva';
import Grid from './components/Grid';
import GridPoints from './components/GridPoints';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: {
        width: 1060,
        height: 680,
        grid: 20,
        axisLabelCount: 5,
      },
    };
  }

  render() {
    const {
      stage,
    } = this.state;
    return (
      <div className="App">
        <Stage width={stage.width} height={stage.height}>
          <Layer>
            <Grid stage={stage} />
            <GridPoints stage={stage} />
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default App;
