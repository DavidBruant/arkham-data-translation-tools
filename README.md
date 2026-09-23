# arkham-data-translation-tools

Tools to help translation of https://github.com/Kamalisk/arkhamdb-json-data

## Get translation status

You need to set the `ARKHAM_DATA_ROOT` environment variable, for instance via a `.env` file (or via the command line)


```sh
# For interactive version
ARKHAM_DATA_ROOT=./path/to/arkhamdb-json-data npx --package https://github.com/DavidBruant/arkham-data-translation-tools translation-status

# below, the commandline preamble is skipped for readability to show the options
# To specify the language directly. It needs to match a translation directory name
translation-status --language fr

# To get the translation status of all packs in a given language
translation-status --language fr --all

# To get the translation status of a specified pack (it's one of the directory names) in a given language
translation-status --language fr --pack tpc

# To get the translation status of a specific file within a pack in a given language
translation-status --language fr --pack tpc --file tpm_encounter.json
```



## Getting help for translation

⚠️ super-experimental - only sort of works in French for now ⚠️

```sh
node --env-file=.env translation-helper.js

node --env-file=.env translation-helper.js --language fr --pack ptc --file tpm_encounter.json --card 03247 --property name
```






 