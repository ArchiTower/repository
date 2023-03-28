# A new package

A new package description

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![test@main][ci-main-src]][ci-href]
[![test@develop][ci-develop-src]][ci-href]
[![Codecov][codecov-src]][codecov-href]

## How to use it?

TODO

## Development

At first make a local copy of this repository, then install all the dependencies using `pnpm` or package manager of your choice:

```bash
git clone git@github.com:ArchiTower/new-package.git
cd new-package
pnpm i
```

Then, create a branch, make your changes in code, commit it following [gitmoji](https://gitmoji.dev/) & [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) styles.

After that, push it and then create a [Pull Request](https://github.com/ArchiTower/new-package/pulls) with target to `develop` branch.

### Branching

In our repositories we're following the simple solution:

- `main` branch represents stable releases of the libraries or production environment of released applications
- `develop` branch is for release candidates, betas etc. Here we developing solution - library or app.

## License

[MIT](./LICENSE.md)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@architower/new-package?style=flat-square
[npm-version-href]: https://npmjs.com/package/@architower/new-package

[npm-downloads-src]: https://img.shields.io/npm/dm/@architower/new-package?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@architower/new-package

[ci-main-src]: https://img.shields.io/github/actions/workflow/status/ArchiTower/new-package/test.yml?branch=main&style=flat-square
[ci-develop-src]: https://img.shields.io/github/actions/workflow/status/ArchiTower/new-package/test.yml?branch=develop&style=flat-square
[ci-href]: https://github.com/ArchiTower/new-package/actions/workflows/test.yml

[codecov-src]: https://img.shields.io/codecov/c/gh/ArchiTower/new-package/main?style=flat-square
[codecov-href]: https://codecov.io/gh/ArchiTower/new-package
