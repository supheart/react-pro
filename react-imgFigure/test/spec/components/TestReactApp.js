'use strict';

describe('TestReactApp', () => {
  let React = require('react/addons');
  let TestReactApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    TestReactApp = require('components/TestReactApp.js');
    component = React.createElement(TestReactApp);
  });

  it('should create a new instance of TestReactApp', () => {
    expect(component).toBeDefined();
  });
});
