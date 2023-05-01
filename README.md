# Ember Data v3.12.6-patched

## Releasing a new version

These release steps assume that only the `@ember-data/store` package has been modified.

1. Commit your code changes to the [v3.12.6-patched](https://github.com/Addepar/ember-data/commits/v3.12.6-patched) branch.
2. From the root of this repo, run:
   ```
   yarn workspace @ember-data/store pack
   ```
3. Commit the generated file:
   ```
   git add -A
   git commit -m "Update @ember-data/store tarball"
   ```
4. Push your branch to GitHub.
5. In Iverson, change the `@ember-data/store` version in `package.json`'s `resolutions` section to point to the new git SHA, e.g. 
   ```
   "@ember-data/store": "https://github.com/Addepar/ember-data/raw/889a9695079e4a14ef13feca1c7bd8c72a50303b/packages/store/ember-data-store-3.12.6.tgz"
   ```

## Linking to Iverson

In the root of this repo, run:

```
yarn install
yarn workspace ember-data link
```

In the root of the Iverson repo, run:

```
yarn link "ember-data"
```
