import React from 'react';
import StandardCharts from '../../../package/src';
import { createUseStyles } from '../../theming/createUseStyles';
import { Button } from '../Button';

const useStyles = createUseStyles(({ theme }) => ({
  button: {
    //backgroundColor: theme.debug(),
    width: '150px',
    height: '100px',
    padding: '4px',
    float: 'left',
  },
}));

export function Example(props) {
  const { example, onClick } = props;

  const { classes } = useStyles();

  const charts = Array.isArray(example)
    ? StandardCharts(example)
    : [StandardCharts(example)];

  return (
    <Button
      width="150px"
      height="100px"
      style={classes.button}
      onClick={onClick}
    >
      {charts.map((chart, index) => (
        <img
          key={chart.slice(0, 30)}
          src={`data:image/svg+xml;utf8,${chart}`}
          style={
            {
              //backgroundColor: '#669988',
            }
          }
        />
      ))}
    </Button>
  );
}
