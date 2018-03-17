(function() {
  var InternalVariableNamesUsage,
    indexOf = [].indexOf;

  module.exports = InternalVariableNamesUsage = (function() {
    class InternalVariableNamesUsage {
      constructor() {
        this.handleCode = this.handleCode.bind(this);
      }

      lintAST(ast, astApi) {
        ast.traverseChildren(false, (child) => {
          if (this.isCode(child)) {
            this.handleCode(child, astApi);
            return true;
          }
        });
      }

      handleCode(node, astApi) {
        var i, instanceVariables, len, param, ref;
        instanceVariables = [];
        ref = node.params;
        for (i = 0, len = ref.length; i < len; i++) {
          param = ref[i];
          param.traverseChildren(false, (child) => {
            if (this.isInstanceParameter(child)) {
              instanceVariables.push(child.properties[0].name.value);
              return true;
            }
          });
        }
        node.body.traverseChildren(false, (child) => {
          if (this.isLocalVariableNamedAfterInstanceVariable(child, instanceVariables)) {
            this.errors.push(astApi.createError({
              context: `Used '${child.base.value}' insteadof '@${child.base.value}'`,
              lineNumber: child.locationData.first_line + 1
            }));
            return true;
          } else if (this.isCode(child)) {
            this.handleCode(child, astApi);
            return true;
          }
        });
      }

      isCode(node) {
        return node.constructor.name === 'Code';
      }

      isInstanceParameter(node) {
        var ref;
        return node.constructor.name === 'Value' && node.base.value === 'this' && ((ref = node.properties[0]) != null ? ref.constructor.name : void 0) === 'Access';
      }

      isLocalVariableNamedAfterInstanceVariable(node, instanceVariables) {
        var ref;
        return node.constructor.name === 'Value' && (ref = node.base.value, indexOf.call(instanceVariables, ref) >= 0);
      }

    };

    InternalVariableNamesUsage.prototype.rule = {
      name: 'internal_variable_names_usage',
      description: 'This rule prohibits usage of compiler\'s internal variable names.\nBC in CoffeeScript 1.9.0.',
      level: 'warn',
      message: 'Don\'t use compiler\'s internal variable names'
    };

    return InternalVariableNamesUsage;

  }).call(this);

}).call(this);
