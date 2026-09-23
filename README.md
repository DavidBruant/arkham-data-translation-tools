# arkham-data-translation-tools

Tools to help translation of https://github.com/Kamalisk/arkhamdb-json-data

## Get translation status

You need to set the `ARKHAM_DATA_ROOT` environment variable, for instance via a `.env` file (or via the command line)

```sh
node --env-file=.env translation-status.js
node --env-file=.env translation-status.js --language fr
node --env-file=.env translation-status.js --language fr --all
node --env-file=.env translation-status.js --language fr --pack tpc
node --env-file=.env translation-status.js --language fr --pack tpc --file tpm_encounter.json
```



## Getting help for translation

⚠️ super-experimental - only works a bit in French ⚠️

```sh
node --env-file=.env translation-helper.js

node --env-file=.env translation-helper.js --language fr --pack ptc --file tpm_encounter.json --card 03247 --property name
```






 