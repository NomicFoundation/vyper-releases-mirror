# Vyper releases mirror

This is a mirror of the [Vyper releases page](https://github.com/vyperlang/vyper/releases).

Please, don't use this mirror directly from GitHub. Use [its website](https://vyper-releases-mirror.hardhat.org) instead.

## Structure of the mirror 

1. The mirror serves the [`public/`](https://github.com/NomicFoundation/vyper-releases-mirror/tree/main/public) folder present in its repository.
2. It has a `list.json` file in its root, which is a simplified version of a the response of [this API call](https://api.github.com/repos/vyperlang/vyper/releases?per_page=200).
3. Each of the assets listed in `list.json` has been downloaded into the root of the mirror, with the same name.
4. The mirror gets updated every hour.

## `list.json` format

The type of `list.json` is `CompilerList` in the following snippet:

```ts
type CompilersList = CompilerRelease[];

interface CompilerReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface CompilerRelease {
  assets: CompilerReleaseAsset[];
  tag_name: string;
}
```
