import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Group, Circle, Line } from 'react-konva';

class GridPoints extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: this.props.stage,
      centerX: Math.floor(this.props.stage.width / 2),
      centerY: Math.floor(this.props.stage.height / 2),
      hover: {x: null, y: null},
      selected: null,
      tempPolygon: [],
      tracker: {},
      polygons: this.props.polygons,
    };
  }

  handleClick(key, selected) {
    let tempPolygon = Object.assign([], this.state.tempPolygon);
    let tracker = Object.assign({}, this.state.tracker);
    const polygons = Object.assign([], this.state.polygons);

    // push to polygons if the last point matches the first
    if (
      tempPolygon[0]
      && selected.x === tempPolygon[0][0]
      && selected.y === tempPolygon[0][1]
    ) {
      // check that there are more than 2 points in a polygon before closing
      if (tempPolygon.length > 2) {
        const newPolygon = [];
        tempPolygon.forEach((pos) => {
          const x = (pos[0] - this.state.centerX) / this.state.stage.grid;
          const y = (pos[1] - this.state.centerY) / this.state.stage.grid;
          newPolygon.push([x,y]);
        });
        polygons.push(newPolygon);
        tempPolygon = [];
        tracker = {};
      } else {
        return;
      }
    } else if ({}.hasOwnProperty.call(tracker, key) === false) {
      tracker[key] = true;
      tempPolygon.push([selected.x, selected.y]);
    }

    this.setState({
      tempPolygon,
      polygons,
      tracker,
    });
  }

  handleMouseOver(key) {
    this.setState({
      hover: key,
    });
  }

  drawPointLine(x1, y1, x2, y2, s, postfix = '') {
    const key = `line-${x1}-${y1}-${x2}-${y2}`;
    return (
      <Line
        key={`${key}${postfix}`}
        points={[x1,y1,x2,y2]}
        stroke={s}
        strokeWidth={2}
      />
    )
  }

  drawGridPointCircle(x, y, r, f, postfix = '') {
    const {
      hover,
    } = this.state;
    const key = `point-${x}-${y}`;
    let fill = f;
    if (hover.x === x && hover.y === y && f === 'transparent') {
      fill = 'rgba(255,255,255,.1)';
    }
    return (
      <Circle
        key={`${key}${postfix}`}
        x={x}
        y={y}
        fill={fill}
        radius={r}
        onClick={() => {
          this.handleClick(key, {x,y});
          document.body.style.cursor = 'default';
        }}
        onMouseOver={() => {
          this.handleMouseOver({x,y});
          document.body.style.cursor = 'pointer';
        }}
      />
    )
  }

  getGridLocation(coord) {
    const {
      stage,
    } = this.state;
    if (coord < 0) {
      return coord * stage.grid;
    }
    return coord * stage.grid;
  }

  drawGridPoints() {
    const {
      stage,
      selected,
      tempPolygon,
      polygons,
      centerX,
      centerY,
    } = this.state;
    const points = [];
    const gridX = Math.ceil(centerX / stage.grid);
    const gridY = Math.ceil(centerY / stage.grid);

    for(let i = 0; i < gridX; i++) {
      const offsetX = (i * stage.grid);
      const xPositive = centerX + offsetX;
      const xNegative = centerX - offsetX;

      for(let j = 0; j < gridY; j++) {
        const offsetY = (j * stage.grid);
        const yPositive = centerY - offsetY;
        const yNegative = centerY + offsetY;

        // quadrant 1
        points.push(this.drawGridPointCircle(xPositive, yPositive, 10, 'transparent'));
        if (xPositive !== xNegative) {
          // quadrant 2
          points.push(this.drawGridPointCircle(xNegative, yPositive, 10, 'transparent'));
        }
        if (yPositive !== yNegative) {
          // quadrant 3
          points.push(this.drawGridPointCircle(xNegative, yNegative, 10, 'transparent'));
        }
        if (xPositive !== xNegative && yPositive !== yNegative) {
          // quadrant 4
          points.push(this.drawGridPointCircle(xPositive, yNegative, 10, 'transparent'));
        }
      }
    }

    if (polygons.length > 0) {
      polygons.forEach((polyPoints, pIdx) => {
        const polyPointsLength = polyPoints.length;
        polyPoints.forEach((pos, idx) => {
          const x = (centerX + (pos[0] * stage.grid));
          const y = (centerY + (pos[1] * stage.grid));
          points.push(this.drawGridPointCircle(x, y, 6, 'rgba(52,249,167,1)', `p-${pIdx}`));
          if (idx > 0) {
            const x1 = (centerX + (polyPoints[idx-1][0] * stage.grid));
            const y1 = (centerY + (polyPoints[idx-1][1] * stage.grid));
            points.push(this.drawPointLine(x1, y1, x, y, 'rgba(52,249,167,1)', `p-${pIdx}`));
          }
          if(idx === polyPointsLength - 1) {
            const x1 = (centerX + (polyPoints[0][0] * stage.grid));
            const y1 = (centerY + (polyPoints[0][1] * stage.grid));
            points.push(this.drawPointLine(x1, y1, x, y, 'rgba(52,249,167,1)', `p-${pIdx}`));
          }
        });
      });
    }

    if (tempPolygon.length > 0) {
      tempPolygon.forEach((pos, idx) => {
        const x = pos[0];
        const y = pos[1];
        points.push(this.drawGridPointCircle(x, y, 6, 'rgba(138,218,253,1)', 'tp'));
        if (idx > 0) {
          const x1 = tempPolygon[idx-1][0];
          const y1 = tempPolygon[idx-1][1];
          points.push(this.drawPointLine(x1, y1, x, y, 'rgba(138,218,253,1)'));
        }
      });
    }

    if (selected) {
      points.push(this.drawGridPointCircle(selected.x, selected.y, 6, 'rgba(138,218,253,1)', 's'));
    }

    return points;
  }

  render() {
    return (
      <Group
        x={0}
        y={0}
        onMouseOut={() => {
          this.setState({
            hover: {x:null, y:null},
          });
          document.body.style.cursor = 'default';
        }}
      >
        {this.drawGridPoints()}
      </Group>
    );
  }
}
GridPoints.propTypes = {
  stage: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    grid: PropTypes.number,
    axisLabelCount: PropTypes.number,
  }),
  polygons: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))),
};
GridPoints.defaultProps = {
  stage: {
    width: 960,
    height: 680,
    grid: 20,
    axisLabelCount: 5,
  },
  polygons: [],
};

export default GridPoints;
