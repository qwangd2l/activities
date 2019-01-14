# d2l-activities

Web components to be used with activities entities!

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

If you don't have it already, install the [Polymer CLI](https://www.polymer-project.org/3.0/docs/tools/polymer-cli) globally:

```shell
npm install -g polymer-cli
```

To start a [local web server](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#serve) that hosts the demo page and tests:

```shell
polymer serve
```

To lint ([eslint](http://eslint.org/) and [Polymer lint](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#lint)):

```shell
npm run lint
```

To run unit tests locally using [Polymer test](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#tests):

```shell
npm run test:polymer:local
```

To lint AND run local unit tests:

```shell
npm test
```

## Usage

The evaluation hub should be pulled directly from `my-unassessed-activities`:

```html
<d2l-evaluation-hub href="https://activities.[[apiUrl]]/my-unassessed-activities" token="token"></d2l-evaluation-hub>
```

[ci-url]: https://travis-ci.org/BrightspaceUI/activities
[ci-image]: https://travis-ci.org/BrightspaceUI/activities.svg?branch=master
