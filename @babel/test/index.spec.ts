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
          antd: 'antd',
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

test("import React, { useState } from 'react';", () => {
  const result = transformSync("import React, { useState } from 'react';", options);
  expect(result?.code).toBe('const useState = React.useState;');
});
