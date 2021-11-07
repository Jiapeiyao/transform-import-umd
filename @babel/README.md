This plugin tranforms es6 modules importing to umd module accessing.

# Usage

```
npm install --save-dev babel-plugin-transform-import-umd
```

## Options

Add the plugin with options to babel configuration, e.g. in `.babelrc.js`

```JavaScript
{
    plugins: [
        ['transform-import-umd', options],
    ],
}
```

Note: `externals` is required, or nothing will be transform.

# Example

With babel setting below,

```JavaScript
{
    plugins: [
        [
            'transform-import-umd',
            {
                externals: {
                    'react': 'React',
                    'react-dom': 'ReactDOM',
                    'antd/lib': 'antd',
                    '@scope/my-lib': 'MyLib.default',
                },
            },
        ],
    ],
}
```

### In

```JavaScript
import { useState, useEffect as useEffect2 } from 'react';
import * as ReactDOM2 from 'react-dom';
import { Button } from 'antd/lib';
import Lib from '@scope/my-lib';
```

### Out

```JavaScript
const useState = React['useState'];
const useEffect2 = React['useEffect'];
const ReactDOM2 = ReactDOM;
const Button = antd['Button'];
const Lib = MyLib.default;
```
