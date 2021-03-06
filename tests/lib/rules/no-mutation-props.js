/**
 * @fileoverview Prevent mutation of this.props
 * @author Ian Schmitz
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-mutation-props');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var errorMessage = 'A component must never modify its own props.';
var ruleTester = new RuleTester();
ruleTester.run('no-mutation-props', rule, {

  valid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    var obj = {props: {}};',
      '    obj.props.name = "foo";',
      '    return <div>Hello {obj.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = "foo";',
      'module.exports = {};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello {',
      '  getFoo() {',
      '    this.props.foo = \'bar\'',
      '    return this.props.foo;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    const {list} = this.thing;',
      '    list.push(1);',
      '    this.thing.list.push(1);',
      '    this.thing.foo.list.push(1);',
      '    const foo = [];',
      '    foo.push(1);',
      '    return <div/>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '   const {foo} = this.thing',
      '   delete foo.bar;',
      '   delete this.thing.foo',
      '   const bar = {a: 1};',
      '   delete bar.a;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '   const foo = {}',
      '   Object.defineProperty(foo, "bar");',
      '   Object.defineProperty(this.foo, "bar");',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '   const {foo} = this.props',
      '   Object.assign({}, foo, {bar: 1});',
      '   Object.assign(this.foo, {foo: 1});',
      '   Object.assign({}, this.props, {foo: 1});',
      '   Object.assign({}, this.props.foo, {foo: 1});',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    this.props.foo = "bar"',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: errorMessage
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    this.props.person.name= "bar"',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: errorMessage
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    this.props.person.name.first = "bar"',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: errorMessage
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    this.props.person.name.first = "bar"',
      '    this.props.person.name.last = "baz"',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: errorMessage,
      line: 3,
      column: 5
    }, {
      message: errorMessage,
      line: 4,
      column: 5
    }]
  },
  {
    code: [
      'class Hello extends React.Component {',
      '  helper() {',
      '    const {foo} = this.props;',
      '    foo.bar = 1;',
      '  }',
      '  render() {',
      '    return <div/>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: errorMessage,
      line: 4,
      column: 5
    }]
  },
  {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    const {list} = this.props;',
      '    list.push(1);',
      '    list.pop();',
      '    list.shift();',
      '    list.unshift(1);',
      '    this.props.foo.push(1);',
      '    this.props.foo.pop();',
      '    this.props.foo.shift();',
      '    this.props.foo.unshift(1);',
      '    this.props.foo.list.push(1);',
      '    this.props.foo.list.pop();',
      '    this.props.foo.list.shift();',
      '    this.props.foo.list.unshift(1);',
      '    return <div/>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: errorMessage,
      line: 4,
      column: 5
    }, {
      message: errorMessage,
      line: 5,
      column: 5
    }, {
      message: errorMessage,
      line: 6,
      column: 5
    }, {
      message: errorMessage,
      line: 7,
      column: 5
    }, {
      message: errorMessage,
      line: 8,
      column: 5
    }, {
      message: errorMessage,
      line: 9,
      column: 5
    }, {
      message: errorMessage,
      line: 10,
      column: 5
    }, {
      message: errorMessage,
      line: 11,
      column: 5
    }, {
      message: errorMessage,
      line: 12,
      column: 5
    }, {
      message: errorMessage,
      line: 13,
      column: 5
    }, {
      message: errorMessage,
      line: 14,
      column: 5
    }, {
      message: errorMessage,
      line: 15,
      column: 5
    }]
  },
  {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    const {foo} = this.props;',
      '    delete foo.bar;',
      '    const [bar] = this.props.thing;',
      '    delete bar.baz;',
      '    const baz = this.props.baz',
      '    delete baz.a;',
      '    delete this.props.foo;',
      '    delete this.props.foo.bar;',
      '    return <div/>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: errorMessage,
      line: 4,
      column: 5
    }, {
      message: errorMessage,
      line: 6,
      column: 5
    }, {
      message: errorMessage,
      line: 8,
      column: 5
    }, {
      message: errorMessage,
      line: 9,
      column: 5
    }, {
      message: errorMessage,
      line: 10,
      column: 5
    }]
  },
  {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    const {foo} = this.props;',
      '    Object.defineProperty(foo, "bar");',
      '    const [bar] = this.props.thing',
      '    Object.defineProperty(bar, "baz");',
      '    const baz = this.props.baz',
      '    Object.defineProperty(baz, "thing");',
      '    Object.defineProperty(this.props, "foo");',
      '    Object.defineProperty(this.props.foo, "foo");',
      '    return <div/>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: errorMessage,
      line: 4,
      column: 5
    }, {
      message: errorMessage,
      line: 6,
      column: 5
    }, {
      message: errorMessage,
      line: 8,
      column: 5
    }, {
      message: errorMessage,
      line: 9,
      column: 5
    }, {
      message: errorMessage,
      line: 10,
      column: 5
    }]
  },
  {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    const {foo} = this.props;',
      '    Object.assign(foo, {bar: 1});',
      '    const [bar] = this.props.thing;',
      '    Object.assign(bar, {baz: 1});',
      '    const baz = this.props.baz;',
      '    Object.assign(baz, {bat: 1});',
      '    Object.assign(this.props, {foo: 1});',
      '    Object.assign(this.props.baz, {foo: 1});',
      '    return <div/>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: errorMessage,
      line: 4,
      column: 5
    }, {
      message: errorMessage,
      line: 6,
      column: 5
    }, {
      message: errorMessage,
      line: 8,
      column: 5
    }, {
      message: errorMessage,
      line: 9,
      column: 5
    }, {
      message: errorMessage,
      line: 10,
      column: 5
    }]
  }
    /**
     * Would be nice to prevent this too
    , {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    var that = this;',
        '    that.props.person.name.first = "bar"',
        '    return <div>Hello</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: errorMessage
      }]
    }*/
  ]
});
