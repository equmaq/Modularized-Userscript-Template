export default {
  key: 'exampleFunctionEnabled',
  type: 'function',
  title: 'Example Function Module',
  description: 'Marks the page when this example function module is enabled.',
  enabledByDefault: false,
  run({ document }) {
    document.documentElement.dataset.exampleFunctionModule = 'enabled';
  },
};
