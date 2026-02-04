module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [], // Remova o 'react-native-reanimated/plugin' daqui
  };
};