# `dependency-loader` for Webpack

Automatically require any resources related to the module.

## Install

```
npm install --save-dev https://github.com/anton-drobot/dependency-loader.git
```

## Example

For example you have file structure like this:

```
components/
├── foo/
│   ├── index.js
│   ├── index.css
│   └── template.html
├── bar/
│   ├── index.js
│   └── index.css
└── baz/
    ├── index.js
    └── index.css
```

And in each of component's `index.js` you're doing something like this:

```js
import template from './template.html';
import './index.css';

// rest of the file
```

Now you can automate this with `dependency-loader`. Just put this in your webpack config:

```js
module.exports = {
    module: {
        rules: [
            {
                test: /components\/(.*)\/index\.js$/,
                loader: 'dependency-loader',
                options: {
                    injections: [
                        'index.css',
                        {
                            file: 'template.html',
                            variable: 'template'
                        }
                    ]
                }
            }
        ]
    }
}
```

The example above will include the necessary dependencies, with variable declarations, if the files does exists:

```js
// this is automatic injected by "dependency-loader"
import template from './template.html';
import './index.css';

// rest of the file
```

## Options

### `modules` (Boolean), default `true`

If `modules` set to `true`, `dependency-loader` will use ES6 modules. Otherwise — CommonJS.

### `injections` (Array)

Array of files to be injected into file. If you want to only import file without declaring a variable, you can specify configuration like this:

```js
[
    'file1.js',
    'file2.css'
]
```

If you want to specify a variable:

```js
[
    {
        file: 'file1.js',
        variable: 'file1'
    },
    {
        file: 'file2.css',
        variable: 'file2'
    }
]
```

Or you can use both variants:

```js
[
    {
        file: 'file1.js',
        variable: 'file1'
    },
    'file2.css'
]
```
