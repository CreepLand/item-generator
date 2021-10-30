# Item Generator [![CodeFactor](https://www.codefactor.io/repository/github/creepland/item-generator/badge/master)](https://www.codefactor.io/repository/github/creepland/item-generator/overview/master) ![Discord](https://img.shields.io/discord/702398630128255047?color=768AD4&label=discord) ![GitHub package.json version](https://img.shields.io/github/package-json/v/CreepLand/item-generator)
Automatically generates a item.yml file for the [item contributions repostiory](https://github.com/CreepLand/item-contributions).
## Requeriments
This project requires the following things:

- Node.js (along with npm)
- Git

## Setting up
In order to set up the project, we need to clone it first, so run the following commands:
```sh
git clone https://github.com/CreepLand/item-generator --recurse-submodules
cd item-generator
```
Then, install the required dependencies:
```sh
npm install
```
### Submodules
If you want to use the files directly from the [item-contributions repo](https://github.com/CreepLand/item-contributions) and didn't use `--recurse-submodules`, you can initialize them with the following commands:
```sh
git submodule init & git submodule update
```

## Running
When you finish setting up the project, you must decide between two options:

- Generate a completely new item.yml file (default)
- Get the latest item.yml file from the [item contributions repostiory](https://github.com/CreepLand/item-contributions).

If you want to generate a completely new item.yml file, you can simply run the following the command:
```sh
npm start
```
If that's not the case, you must edit the `config.yml` file:
```yaml
config:
  submodule: true # By default this is set to false, change it to true.
```
Then, initialize the Git submodule:
```sh
git submodule update --init
```
And you're now ready to go. You can now start the project like you would do generating a new item.yml from scratch (`npm start`).

