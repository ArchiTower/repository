# @architower/repository

Repository pattern implementation with TypeScript as framework agnostic library

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
git clone git@github.com:ArchiTower/repository.git
cd repository
pnpm i
```

Then, create a branch, make your changes in code, commit it following [gitmoji](https://gitmoji.dev/) & [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) styles.

After that, push it and then create a [Pull Request](https://github.com/ArchiTower/repository/pulls) with target to `develop` branch.

### Branching

In our repositories we're following the simple solution:

- `main` branch represents stable releases of the libraries or production environment of released applications
- `develop` branch is for release candidates, betas etc. Here we developing solution - library or app.

## License

[MIT](./LICENSE.md)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@architower/repository?style=flat-square
[npm-version-href]: https://npmjs.com/package/@architower/repository

[npm-downloads-src]: https://img.shields.io/npm/dm/@architower/repository?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@architower/repository

[ci-main-src]: https://img.shields.io/github/actions/workflow/status/ArchiTower/repository/test.yml?branch=main&style=flat-square
[ci-develop-src]: https://img.shields.io/github/actions/workflow/status/ArchiTower/repository/test.yml?branch=develop&style=flat-square
[ci-href]: https://github.com/ArchiTower/repository/actions/workflows/test.yml

[codecov-src]: https://img.shields.io/codecov/c/gh/ArchiTower/repository/main?style=flat-square
[codecov-href]: https://codecov.io/gh/ArchiTower/repository
