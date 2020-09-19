import webpack from 'webpack';
import path from 'path';

const websitePath = path.resolve(__dirname, 'website');
const projectPath = path.resolve(__dirname, 'project');

const babelrc = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
  ],
};

const config: webpack.Configuration = {
  mode: 'production',
  entry: path.resolve(projectPath, 'entry.tsx'),
  output: {
    path: websitePath,
    filename: 'preview.[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelrc,
          },
        ],
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
    /^(antd|react|react\-dom)(\/[a-z0-9]*)*$/i,
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
};

export default config;
