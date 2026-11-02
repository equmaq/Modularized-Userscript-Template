export default {
  key: 'exampleStyleEnabled',
  type: 'style',
  title: 'Example Style Module',
  description: 'Adds a reusable highlight class as a styling example.',
  enabledByDefault: false,
  run({ document }) {
    const style = document.createElement('style');
    style.textContent = '.example-module-highlight { outline: 2px solid currentColor; }';
    document.head.append(style);
  },
};
