import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Group, Line, Text } from 'react-konva';

class Grid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: this.props.stage,
    };
  }

  drawLine(key, points, stroke) {
    return (
      <Line
        key={key}
        points={points}
        strokeWidth={1}
        stroke={stroke}
      />
    )
  }

  drawGrid() {
    const {
      stage,
    } = this.state;
    const grid = [];
    const centerX = Math.floor(stage.width / 2);
    const centerY = Math.floor(stage.height / 2);
    const gridX = Math.ceil(centerX / stage.grid);
    const gridY = Math.ceil(centerY / stage.grid);

    // x axis
    for(let i = 1; i < gridX; i++) {
      const labelCount = i % stage.axisLabelCount;
      const offset = (i * stage.grid);
      const xPositive = centerX + offset;
      const xNegative = centerX - offset;

      grid.push(this.drawLine(`x-axis-positive-${i}`, [xPositive,0,xPositive,stage.height], '#333'));
      grid.push(this.drawLine(`x-axis-negative-${i}`, [xNegative,0,xNegative,stage.height], '#333'));

      // add the x labels
      if (labelCount === 0) {
        grid.push(this.drawLine(`x-axis-positive-label-line-${i}`, [xPositive,centerY-5,xPositive,centerY+5], '#555'));
        grid.push(this.drawLine(`x-axis-negative-label-line-${i}`, [xNegative,centerY-5,xNegative,centerY+5], '#555'));
        grid.push((
          <Text
            key={`x-axis-positive-label-${i}`}
            fontSize={8}
            text={i}
            fill="#555"
            x={xPositive + 2}
            y={centerY + 3}
          />
        ));
        grid.push((
          <Text
            key={`x-axis-negative-label-${i}`}
            fontSize={8}
            text={`-${i}`}
            fill="#555"
            x={xNegative + 2}
            y={centerY + 3}
          />
        ));
      }
    }

    // y axis
    for(let i = 1; i < gridY; i++) {
      const labelCount = i % stage.axisLabelCount;
      const offset = (i * stage.grid);
      const yPositive = centerY - offset;
      const yNegative = centerY + offset;

      grid.push(this.drawLine(`y-axis-positive-${i}`, [0,yPositive,stage.width,yPositive], '#333'));
      grid.push(this.drawLine(`y-axis-negative-${i}`, [0,yNegative,stage.width,yNegative], '#333'));

      // add the y labels
      if (labelCount === 0) {
        grid.push(this.drawLine(`y-axis-positive-label-line-${i}`, [centerX-5,yPositive,centerX+5,yPositive], '#555'));
        grid.push(this.drawLine(`y-axis-negative-label-line-${i}`, [centerX-5,yNegative,centerX+5,yNegative], '#555'));
        grid.push((
          <Text
            key={`y-axis-positive-label-${i}`}
            fontSize={8}
            text={i}
            fill="#555"
            x={centerX + 3}
            y={yPositive + 2}
          />
        ));
        grid.push((
          <Text
            key={`y-axis-negative-label-${i}`}
            fontSize={8}
            text={`-${i}`}
            fill="#555"
            x={centerX + 3}
            y={yNegative + 2}
          />
        ));
      }
    }

    // center x axis
    grid.push((
      <Line
        key="x-axis-positive"
        points={[centerX,0,centerX,stage.height]}
        strokeWidth={1}
        stroke="#555"
      />
    ));

    // center y axis
    grid.push((
      <Line
        key="y-axis-positive"
        points={[0,centerY,stage.width,centerY]}
        strokeWidth={1}
        stroke="#555"
      />
    ));

    grid.push((
      <Text
        key="axis-label"
        fontSize={8}
        text="(0,0)"
        fill="#555"
        x={centerX + 2}
        y={centerY + 2}
      />
    ));

    return grid;
  }

  render() {
    return (
      <Group x={0} y={0}>{this.drawGrid()}</Group>
    );
  }
};
Grid.propTypes = {
  stage: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    grid: PropTypes.number,
    axisLabelCount: PropTypes.number,
  }),
};
Grid.defaultProps = {
  stage: {
    width: 960,
    height: 680,
    grid: 20,
    axisLabelCount: 5,
  },
};

export default Grid;
