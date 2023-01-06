import React, { useState } from 'react';
import { Editor } from './components/editor/Editor';
import { Overview } from './components/overview/Overview';
import { createUseStyles } from './theming/createUseStyles';

const useStyles = createUseStyles(({ theme }) => ({
  container: {
    width: '100vw',
    height: 'calc(100vh - 50px)',
    position: 'absolute',
    top: '50px',
    backgroundColor: theme.bodyBackground,
    overflow: 'hidden',
  },
}));

export function App() {
  const [selectedChart, setSelectedChart] = useState('');

  const { classes } = useStyles();

  return (
    <div style={classes.container}>
      {selectedChart ? (
        <Editor
          selectedChart={selectedChart}
          setSelectedChart={setSelectedChart}
        />
      ) : (
        <Overview setSelectedChart={setSelectedChart} />
      )}
    </div>
  );
}
