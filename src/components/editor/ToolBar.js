import React from 'react';
import { createUseStyles } from '../../theming/createUseStyles';
import { Button } from '../Button';
import { Icon } from '../Icon';
import returnArrow from './toolbarIcons/returnArrow';

const useStyles = createUseStyles(({ theme }) => ({
  container: {
    width: '100%',
    height: '40px',
    backgroundColor: '#252526',
    display: 'flex',
    flexDirection: 'rows',
    alignItems: 'center',
    gap: '10px',
    paddingLeft: '10px',
    color: '#c5c5c5',
  },
}));

/**
 * Item color: #c5c5c5
 */
export function ToolBar(props) {
  const { setSelectedChart } = props;

  const { classes } = useStyles();

  return (
    <div style={classes.container}>
      <Button
        width="80px"
        height="30px"
        style={{ gap: '10px' }}
        onClick={() => {
          setSelectedChart('');
        }}
      >
        <Icon src={returnArrow} size="14px" />
        Return
      </Button>
    </div>
  );
}
