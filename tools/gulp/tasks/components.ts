import {task, watch} from 'gulp';

import {readdirSync, statSync, writeFileSync} from 'fs';
import * as path from 'path';

import {SOURCE_ROOT, DIST_COMPONENTS_ROOT, PROJECT_ROOT} from '../constants';
import {sassBuildTask, tsBuildTask, execNodeTask, copyTask} from '../task_helpers';

console.log(__dirname);

// No typings for these.
const inlineResources = require('../../scripts/inline-resources');
const rollup = require('rollup').rollup;
const uglify = require('rollup-plugin-uglify');
const minify = require('uglify-js').minify;

const componentsDir = path.join(SOURCE_ROOT, 'lib');


function camelCase(str: string) {
  return str.replace(/-(\w)/g, (_: any, letter: string) => {
    return letter.toUpperCase();
  })
}

task('build:components', [
  ':build:components:rollup',
], () => inlineResources([DIST_COMPONENTS_ROOT]));

task(':build:components:ngc', ['build:components'], execNodeTask(
  '@angular/compiler-cli', 'ngc', ['-p', path.relative(PROJECT_ROOT, path.join(componentsDir, 'tsconfig.json'))]
));

task(':build:components:ts', tsBuildTask(componentsDir));

task(':build:components:rollup', [':build:components:ts'], () => {
  const components = readdirSync(componentsDir)
    .filter(componentName => (statSync(path.join(componentsDir, componentName))).isDirectory());

  const globals: {[name: string]: string} = {
    // Angular dependencies
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/platform-browser': 'ng.platformBrowser',
    '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',

    // Rxjs dependencies
    'rxjs/Subject': 'Rx',
    'rxjs/Subscription': 'Rx',
    'rxjs/BehaviorSubject': 'Rx',
    'rxjs/Observable': 'Rx',
    'rxjs/add/observable/forkJoin': 'Rx.Observable',
    'rxjs/add/observable/of': 'Rx.Observable',
    'rxjs/add/operator/toPromise': 'Rx.Observable.prototype',
    'rxjs/add/operator/map': 'Rx.Observable.prototype',
    'rxjs/add/operator/filter': 'Rx.Observable.prototype',
    'rxjs/add/operator/do': 'Rx.Observable.prototype',
    'rxjs/add/operator/share': 'Rx.Observable.prototype',
    'rxjs/add/operator/finally': 'Rx.Observable.prototype',
    'rxjs/add/operator/catch': 'Rx.Observable.prototype'
  };
  components.forEach(name => {
    globals[`@angular2-layouts/${name}`] = `${camelCase(name)}`
  });

  // Build all of them asynchronously.
  return components.reduce((previous, name) => {
    return previous
      .then(() => {
        return rollup({
          entry: path.join(DIST_COMPONENTS_ROOT, name, 'index.js'),
          context: 'window',
          external: [
            ...Object.keys(globals),
            ...components.map(name => `@angular2-layouts/${name}`)
          ],
          plugins: [
            uglify({}, minify)
          ]
        });
      })
      .then((bundle: any) => {
        const result = bundle.generate({
          moduleName: `${camelCase(name)}`,
          format: 'umd',
          globals
        });
        const outputPath = path.join(DIST_COMPONENTS_ROOT, name, `${name}.umd.js`);
        writeFileSync( outputPath, result.code );
      });
  }, Promise.resolve());
});

