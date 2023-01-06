import React from 'react';
import StandardCharts from '../../../package/src';
import { createUseStyles } from '../../theming/createUseStyles';

const useStyles = createUseStyles(({ theme }) => ({
  container: {
    width: '50%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '80%',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
}));

export function Output(props) {
  const { input } = props;

  const { classes } = useStyles();

  return (
    <div style={classes.container}>
      <div style={classes.innerContainer}>
        <img
          src={`data:image/svg+xml;utf8,${StandardCharts(input)}`}
          style={{
            width: '100%',
            //backgroundColor: '#669988',
          }}
        />
      </div>
    </div>
  );
}
