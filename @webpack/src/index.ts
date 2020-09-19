class TransformImportUmdWebpackPlugin {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler: any) {
    // Specify the event hook to attach to
    compiler.hooks.emit.tapAsync(
      'TransformImportUmdWebpackPlugin',
      (compilation: any, callback :any) => {
        console.log('This is an example plugin!');
        // console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);

        // Manipulate the build using the plugin API provided by webpack
        // compilation.addModule(/* ... */);

        callback();
      }
    );
  }
}

module.exports = TransformImportUmdWebpackPlugin;