import { transformSync, TransformOptions } from "@babel/core";
import transferImportUmd from "../src";

const options: TransformOptions = {
  filename: 'index.js',
  plugins: [
    [
      transferImportUmd,
      {
        externals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'antd/lib': 'antd',
          '@scope/my-lib': 'MyLib',
        },
      },
    ],
  ],
};

test("import Button from 'antd/button", () => {
  const result = transformSync("import Button from 'antd/button';", options);
  expect(result?.code).toBe('const Button = antd["button"];');
});

test("import React from 'react';", () => {
  const result = transformSync("import React from 'react';", options);
  expect(result?.code).toBe('');
});

test("import React2 from 'react';", () => {
  const result = transformSync("import React2 from 'react';", options);
  expect(result?.code).toBe('const React2 = React;');
});

test("import * as React from 'react';", () => {
  const result = transformSync("import * as React from 'react';", options);
  expect(result?.code).toBe('');
});

test("import * as Antd from 'antd';", () => {
  const result = transformSync("import * as Antd from 'antd';", options);
  expect(result?.code).toBe('const Antd = antd;');
});

test("import { useState } from 'react';", () => {
  const result = transformSync("import React, { useState } from 'react';", options);
  expect(result?.code).toBe('const useState = React.useState;');
});

test("import { useState as useState2 } from 'react';", () => {
  const result = transformSync("import React, { useState as useState2 } from 'react';", options);
  expect(result?.code).toBe('const useState2 = React.useState;');
});

test("import Button from 'antd/lib/button';", () => {
  const result = transformSync("import Button from 'antd/lib/button';", options);
  expect(result?.code).toBe('const Button = antd["button"];');
});

test("import someFunction from '@scope/my-lib';", () => {
  const result = transformSync("import someFunction from '@scope/my-lib/someFunction';", options);
  expect(result?.code).toBe('const someFunction = MyLib["someFunction"];');
});
