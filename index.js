const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

const DEFAULT_OPTIONS = {
    modules: true,
    injections: []
};

const DEFAULT_INJECTION = {
    file: null,
    variable: null
};

function normalizeInjection(injection) {
    if (Object.prototype.toString.call(injection) === '[object String]') {
        injection = Object.assign(
            {},
            DEFAULT_INJECTION,
            { file: injection }
        );
    } else {
        injection = Object.assign(
            {},
            DEFAULT_INJECTION,
            injection
        );
    }

    return injection;
}

function getInjectionString(filePath, injection, options) {
    if (injection.variable && options.modules) {
        return `import ${injection.variable} from '${filePath}';`;
    }

    if (options.modules) {
        return `import '${filePath}';`;
    }

    if (injection.variable) {
        return `const ${injection.variable} = require('${filePath}');`;
    }

    return `require('${filePath}');`;
}

module.exports = function (content, sourceMap) {
    if (this.cacheable) {
        this.cacheable();
    }

    const options = Object.assign(
        {},
        DEFAULT_OPTIONS,
        loaderUtils.getOptions(this)
    );

    const injections = [];

    options.injections.forEach((injection) => {
        injection = normalizeInjection(injection);

        if (!injection.file) {
            return;
        }

        const filePath = loaderUtils.urlToRequest(loaderUtils.interpolateName(this, injection.file, options));

        try {
            const stats = fs.statSync(path.resolve(this.context, filePath));

            if (stats.isFile()) {
                injections.push(getInjectionString(filePath, injection, options));
            }
        } catch (err) {}
    });

    if (injections.length) {
        content = injections.join('\r\n') + '\r\n' + content;
    }

    this.callback(null, content, sourceMap);
};
