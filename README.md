[<img src="https://raw.githubusercontent.com/ruqzuq/ruqzuq/main/Standard-Charts.png" width="100%">](https://ruqzuq.com/)

[Standard-Charts](https://ruqzuq.com/standard-charts) is an open-source chart-library inspired by **IBCS** (uncertified)[1]. It empowers developers to unite modern and timeless corporate financial visualization.

## Installation

| Yarn                       | npm                           |
| -------------------------- | ----------------------------- |
| `yarn add standard-charts` | `npm install standard-charts` |

## Quick Start

This is an example with *React*. Different approaches are required for other frameworks.

```jsx
import React, { useEffect, useState } from 'react';
import { ChartStyle, ChartType, StandardCharts, VarianceType } from 'standard-charts';

export function App() {
  const [ref, setRef] = useState();

  useEffect(() => {
    StandardCharts([
      {
        type: ChartType.Scenario,
        style: ChartStyle.Column,
        width: 300,
        height: 300,
        variances: [
          {
            variance: VarianceType.Absolute,
            delta: Scenario.PY,
          },
        ],
        data: [
          { key: '2022', PY: 22, AC: 29 },
          { key: '2023', PY: 37, AC: 31 },
          { key: '2024', PY: 26, FC: 32 },
        ],
      },
    ]).then((charts) => {
      setRef(charts[0]);
    });
  }, []);

  return <img src={ref} />;
}
```

Now this simple column chart should appear:

<div align="center">
<img src="https://raw.githubusercontent.com/ruqzuq/ruqzuq/main/Example.png">
</div>

## License

The project is licensed under the _MIT License_. 

## References

[1] Hichert, R. and Faisst, J. (2022) IBCS Standards 1.2. https://www.ibcs.com/ibcs-standards-1-2/

[2] Brinton, W.C. (1914) Graphic methods for presenting facts.