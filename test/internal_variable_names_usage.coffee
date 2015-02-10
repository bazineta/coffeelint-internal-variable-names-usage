coffeelint = require 'coffeelint'
expect = require('chai').expect

InternalVariableNamesUsage = require '../src/internal_variable_names_usage'

coffeelint.registerRule InternalVariableNamesUsage

config =
  internal_variable_names_usage:
    level: 'error'

describe 'InternalVariableNamesUsage', ->

  describe 'valid usage', ->
    it 'should pass valid usage of local variables', ->
      result = coffeelint.lint '''
        class A
          constructor: (a) ->
            b = a
        ''', config
      expect(result).to.be.empty

    it 'should pass valid usage of instance variables', ->
      result = coffeelint.lint '''
        class A
          constructor: (@a) ->
            b = @a
        ''', config
      expect(result).to.be.empty

    xit 'should pass valid usage of mixed local and instance variables', ->
      result = coffeelint.lint '''
        class A
          constructor: (a, @a) ->
            b = @a
            b = a
        ''', config
      expect(result).to.be.empty

    xit 'should pass valid usage of locally created variable', ->
      result = coffeelint.lint '''
        class A
          constructor: (@a) ->
            a = 5
            b = a
        ''', config
      expect(result).to.be.empty

  describe 'invalid usage', ->
    it 'should warn when instance variable used under its internal name', ->
      result = coffeelint.lint '''
        class A
          constructor: (@a) ->
            b = a
        ''', config
      expect(result).to.be.ok
      expect(result[0].context).to.equal 'Used \'a\' insteadof \'@a\''

  describe 'strings', ->
    it 'should ignore usage in strings', ->
      result = coffeelint.lint '''
        class A
          constructor: (@a) ->
            b = 'a'
        ''', config
      expect(result).to.be.empty

  describe 'comments', ->
    it 'should ignore usage in comments', ->
      result = coffeelint.lint '''
        class A
          constructor: (@a) ->
            ### b = a ###
            b = 5 # a
        ''', config
      expect(result).to.be.empty
