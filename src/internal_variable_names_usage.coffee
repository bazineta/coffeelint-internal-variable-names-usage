module.exports = class InternalVariableNamesUsage
  rule:
    name: 'internal_variable_names_usage'
    description: '''
      This rule prohibits usage of compiler's internal variable names.
      BC in CoffeeScript 1.9.0.
      '''
    level: 'warn'
    message: 'Don\'t use compiler\'s internal variable names'

  lintAST: (ast, astApi) ->
    ast.traverseChildren false, (child) =>
      if @isCode child
        @handleCode child, astApi
        return yes
      return
    return

  handleCode: (node, astApi) =>
    instanceVariables = []
    for param in node.params
      param.traverseChildren false, (child) =>
        if @isInstanceParameter child
          instanceVariables.push child.properties[0].name.value
          return yes
        return
    node.body.traverseChildren false, (child) =>
      if @isLocalVariableNamedAfterInstanceVariable child, instanceVariables
        @errors.push astApi.createError
          context: "Used '#{child.base.value}' insteadof '@#{child.base.value}'"
          lineNumber: child.locationData.first_line + 1
        return yes
      else if @isCode child
        @handleCode child, astApi
        return yes
      return
    return

  isCode: (node) ->
    node.constructor.name is 'Code'

  isInstanceParameter: (node) ->
    node.constructor.name is 'Value' and node.base.value is 'this' and node.properties[0]?.constructor.name is 'Access'

  isLocalVariableNamedAfterInstanceVariable: (node, instanceVariables) ->
    node.constructor.name is 'Value' and node.base.value in instanceVariables
