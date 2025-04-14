module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',

      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          tests: ['./tests/'],
          '@components': './src/components/*',
          '@src': './src',
          '@images': './src/assets/images/',
          '@icons': './src/assets/icons/',
          '@apis': './src/apis/',
          '@screens': './src/screens/*',
          '@helper': './src/libs/helper/',
          '@moment': './src/libs/moment/',
          '@i18n': './src/libs/localization/',
          '@config': './src/libs/config/',
          '@context': './src/libs/context/',
          '@constants': './src/libs/constants/',
          '@hooks': './src/hooks/*',
          '@redux': './src/redux/*'
        }
      }
    ],
    '@babel/plugin-proposal-export-namespace-from',
    'react-native-reanimated/plugin'
  ]
}
