# MacOS style terminal image generator

[Cover Image](./images/cover-image.png)

## Config options

- Terminal size
- Terminal title
- Font and text size
- Prompt (pre-set options and custom)
- Colour
  - Prompt colour
  - Seperate command colour
  - Text colour
  - Terminal background colour
- Custom 'user' and 'host' which are re-used

## Contributing

This repo uses gitflow, the following branches are used:

- `main` - the production branch, only contains stable releases
- `develop` - the development branch, contains the latest changes and features, may be unstable
- `feature/*` - feature branches, used for developing new features, should be branched off of `develop` and merged back into `develop` when complete
- `hotfix/*` - hotfix branches, used for fixing bugs in production, should be branched off of `main` and merged back into both `main` and `develop` when complete

[Prettier](https://prettier.io/) is used for code formatting
