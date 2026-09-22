# arkham-data-translation-tools

Tools to help translation of https://github.com/Kamalisk/arkhamdb-json-data

## Get translation status

(for now, only for French translation)

You need to set the `ARKHAM_DATA_ROOT` environment variable, for instance via a `.env` file ()

```sh
node --env-file=.env translation-status.js
node --env-file=.env translation-status.js --language fr
node --env-file=.env translation-status.js --language fr --all
node --env-file=.env translation-status.js --language fr --pack tpc
node --env-file=.env translation-status.js --language fr --pack tpc --file tpm_encounter.json
```

## Getting help for translation

```sh
node --env-file=.env translation-helper.js

node --env-file=.env translation-helper.js --language fr --pack ptc --file tpm_encounter.json --card 03247 --property name
```






 