# coffeelint-internal-variable-names-usage

coffeelint-internal-variable-names-usage is a plugin of [coffeelint](http://www.coffeelint.org/). It checks usage of compiler's internal variable names, BC in CoffeeScript 1.9.0.

```
class A
    constructor: (@a) ->
        b = a

```

## How to Install

1. add `"coffeelint-internal-variable-names-usage": "^0.0.1"` as `devDependencies` in `package.json`
2. `npm install`

## How to Use

In your `coffeelint.json`, add

```
{
  // other lint rules
  {
    "internal_variable_names_usage": {
      "module": "coffeelint-internal-variable-names-usage",
      "level": "warn"
    }
  }
}
```

and run `coffeelint`.
