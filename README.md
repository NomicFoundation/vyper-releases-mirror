# Vyper releases mirror

This repository has a mirror of the [Vyper releases page](https://github.com/vyperlang/vyper/releases).

Please, don't use this mirror directly from GitHub. Use its website instead.

## Structure of the mirror

1. The mirror serves the `public/` folder.
2. It has a `list.json` file in its root, which is a cached version of [this API call](https://api.github.com/repos/vyperlang/vyper/releases?per_page=200) without any modification.
3. Each of the assets listed in `list.json` has been downloaded into the root of the mirror.
