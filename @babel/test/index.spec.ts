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