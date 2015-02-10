(function() {
  var InternalVariableNamesUsage,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = InternalVariableNamesUsage = (function() {
    function InternalVariableNamesUsage() {
      this.handleCode = __bind(this.handleCode, this);
    }

    InternalVariableNamesUsage.prototype.rule = {
      name: 'internal_variable_names_usage',
      description: 'This rule prohibits usage of compiler\'s internal variable names.\nBC in CoffeeScript 1.9.0.',
      level: 'warn',
      message: 'Don\'t use compiler\'s internal variable names'
    };

    InternalVariableNamesUsage.prototype.lintAST = function(ast, astApi) {
      ast.traverseChildren(false, (function(_this) {
        return function(child) {
          if (_this.isCode(child)) {
            _this.handleCode(child, astApi);
            return true;
          }
        };
      })(this));
    };

    InternalVariableNamesUsage.prototype.handleCode = function(node, astApi) {
      var instanceVariables, param, _i, _len, _ref;
      instanceVariables = [];
      _ref = node.params;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        param.traverseChildren(false, (function(_this) {
          return function(child) {
            if (_this.isInstanceParameter(child)) {
              instanceVariables.push(child.properties[0].name.value);
              return true;
            }
          };
        })(this));
      }
      node.body.traverseChildren(false, (function(_this) {
        return function(child) {
          if (_this.isLocalVariableNamedAfterInstanceVariable(child, instanceVariables)) {
            _this.errors.push(astApi.createError({
              context: "Used '" + child.base.value + "' insteadof '@" + child.base.value + "'",
              lineNumber: child.locationData.first_line + 1
            }));
            return true;
          } else if (_this.isCode(child)) {
            _this.handleCode(child, astApi);
            return true;
          }
        };
      })(this));
    };

    InternalVariableNamesUsage.prototype.isCode = function(node) {
      return node.constructor.name === 'Code';
    };

    InternalVariableNamesUsage.prototype.isInstanceParameter = function(node) {
      var _ref;
      return node.constructor.name === 'Value' && node.base.value === 'this' && ((_ref = node.properties[0]) != null ? _ref.constructor.name : void 0) === 'Access';
    };

    InternalVariableNamesUsage.prototype.isLocalVariableNamedAfterInstanceVariable = function(node, instanceVariables) {
      var _ref;
      return node.constructor.name === 'Value' && (_ref = node.base.value, __indexOf.call(instanceVariables, _ref) >= 0);
    };

    return InternalVariableNamesUsage;

  })();

}).call(this);
