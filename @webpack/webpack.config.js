const path = require('path');
const ImportPlugin = require('./dist');

const projectPath = path.resolve(__dirname, '__project');
const outPath = path.resolve(__dirname, '__out');

const config = {
  mode: 'development',
  entry: path.resolve(projectPath, 'index.ts'),
  output: {
    path: outPath,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: 'ts-loader',
        include: projectPath,
      },
    ],
  },
  externals: [
    {
      react: 'React',
      'react-dom': 'ReactDOM',
      antd: 'antd',
    },
  ],
  plugins: [new ImportPlugin()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
};

exports.default = config;
