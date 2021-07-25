## Description

This will resolve every json pointer ($ref) externally or internally and then save it in a json file. Which can then be used for code generation and so on.

Adapted from https://github.com/mohsen1/multi-file-swagger-example

Better to combine to a single file for use.

## Other References

- https://azimi.me/2015/07/16/split-swagger-into-smaller-files.html#tools
- https://community.smartbear.com/t5/Swagger-Open-Source-Tools/Swagger-ref-won-t-work/td-p/175957

## Usage

```
npm i
```

Refer to **.env** file for openapi folder (relative to this script), root file and output file (will be generated in the openapi folder)

```
node index.js
```