// eslint-disable-next-line import/no-extraneous-dependencies
import types from '@babel/types';

interface Path {
  node: types.ImportDeclaration;
  replaceWith: (exp: types.Node) => void;
  remove: () => void;
}

interface State {
  opts?: {
    externals?: Record<string, string>;
  }
}

/**
 * import * as React from 'react'; // already assigned by UMD
 * import ReactDOM from 'react-dom'; // already assigned by UMD
 * import { Button, Input as In } from 'antd';
 * import Drawer from 'antd/Drawer';
 *
 * >>>>>> tansfer to >>>>>>>
 *
 * var Button = antd.Button,
 *     In = antd.Input;
 * var Drawer = antd.Drawer;
 */
function transformImportUmd({ types: t }: { types: typeof types }) {
  return {
    name: 'transform-import-umd',
    visitor: {
      ImportDeclaration: (path: Path, state: State) => {
        const variableDeclarators = getVariableDeclarators(path, t, state.opts?.externals ?? {});
        if (variableDeclarators.length === 0) {
          path.remove();
        } else {
          path.replaceWith(t.variableDeclaration(
            'const',
            variableDeclarators
          ));
        }
      }
    },
  };
}

function getVariableDeclarators(
  path: Path,
  t: typeof types,
  externals: Record<string, string>,
): types.VariableDeclarator[] {
  const variableDeclarators: types.VariableDeclarator[] = [];
  path.node.specifiers.forEach((specifier: types.ImportDeclaration['specifiers'][number]) => {
    if (t.isImportDefaultSpecifier(specifier) || t.isImportNamespaceSpecifier(specifier)) {
      if (isExpectedImport(specifier.local.name, path.node.source.value, externals)) {
        variableDeclarators.push(t.variableDeclarator(
          specifier.local,
          transferSourcePath(path.node.source.value, t, externals),
        ));
      }
    } else {
      variableDeclarators.push(t.variableDeclarator(
        specifier.local,
        t.memberExpression(
          transferSourcePath(path.node.source.value, t, externals),
          specifier.imported
        )
      ));
    }
  });
  return variableDeclarators;
}

/**
 * 'a/b/c' => a["b"]["c"]
 *
 * @param sourcePath source path like 'a/b/c'
 * @param t babel's types
 * @param externals externals' option setting
 */
function transferSourcePath(
  sourcePath: string,
  t: typeof types,
  externals: Record<string, string>,
) {
  const sourceLib = Object
    .keys(externals)
    .find(externalLib => sourcePath.startsWith(externalLib));
  const path = sourceLib ? sourcePath.replace(sourceLib, externals[sourceLib]) : sourcePath;

  const [libName, ...properties] = path.split('/');
  return properties.reduce<types.Identifier | types.MemberExpression>(
    (object, property: string) => t.memberExpression(object, t.stringLiteral(property), true),
    t.identifier(libName),
  );
}

/**
 * Skip import statement likes "import React from 'react'", because they should be imported in UMD
 *
 * @param local
 * @param sourcePath
 * @param externals
 */
function isExpectedImport(local: string, sourcePath: string, externals: Record<string, string>) {
  const isUmdExternal = externals[sourcePath] === local;
  const isRelativeModule = sourcePath.startsWith('.');
  return !(isUmdExternal || isRelativeModule);
}

export default transformImportUmd;
