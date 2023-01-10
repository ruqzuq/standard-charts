import React from 'react';
import StandardCharts from '../../../package/src';
import { createUseStyles } from '../../theming/createUseStyles';
import { Button } from '../Button';

const useStyles = createUseStyles(({ theme }) => ({
  button: {
    //backgroundColor: theme.debug(),
    width: '150px',
    height: '107px',
    float: 'left',
  },
}));

export function Example(props) {
  const { example, onClick } = props;

  const { classes } = useStyles();

  return (
    <Button
      width="150px"
      height="100px"
      style={classes.button}
      onClick={onClick}
    >
      <img
        src={`data:image/svg+xml;utf8,${StandardCharts(example)}`}
        style={{
          width: '100%',
          //backgroundColor: '#669988',
        }}
      />
    </Button>
  );
}
