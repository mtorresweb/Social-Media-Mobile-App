module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Handle path aliases
      ['module-resolver', {
        root: ['.'],
        alias: {
          '@': '.',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }],
    ],
  };
};