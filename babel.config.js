module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@types': './src/types',
            '@services': './src/services',
          },
        },
      ],
    ],
  };
}; 