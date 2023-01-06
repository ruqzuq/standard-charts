import parserBabel from 'prettier/parser-babel';
import prettier from 'prettier/standalone';
import React, { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor/lib/editor';
import { createUseStyles } from '../../theming/createUseStyles';
import { Output } from './Output';
import { ToolBar } from './ToolBar';

const useStyles = createUseStyles(({ theme }) => ({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#1e1e1e',
    overflow: 'hidden',
  },
  editor: {
    width: '100%',
    height: 'calc(100% - 40px)',
    display: 'flex',
    flexDirection: 'row',
  },
}));

export function Editor(props) {
  const { selectedChart, setSelectedChart } = props;

  const [input, setInput] = useState(
    prettier.format(JSON.stringify(selectedChart), {
      parser: 'json',
      plugins: [parserBabel],
    })
  );
  const [output, setOutput] = useState(selectedChart);

  useEffect(() => {
    try {
      const tempOutput = JSON.parse(input);
      setOutput(tempOutput);
    } catch (_) {
      /**
       * Error wrong json
       */
    }
  }, [input]);

  const { classes } = useStyles();

  return (
    <div style={classes.container}>
      <ToolBar setSelectedChart={setSelectedChart} />
      <div style={classes.editor}>
        <MonacoEditor
          width="50%"
          height="100%"
          language="json"
          theme="vs-dark"
          value={input}
          onChange={(newValue) => {
            setInput(newValue);
          }}
        />
        <Output input={output} />
      </div>
    </div>
  );
}
