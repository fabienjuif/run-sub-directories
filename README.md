# run-sub-directories

1. With this kind of project:
```
 - app/
 - api/
 - package.json
```

2. You can specify a `subdirectories` field into your **package.json** file, like this:
```
   "subdirectories": [
    "app",
    "api"
  ]
```

3. Install the command: `npm install --save-dev run-sub-directories`

4. And add a script (in your **pacage.json** file) that will be performed into subdirectories, example :
```
  "scripts": {
    "test": "run-sub-directories --parallel npm run test"
  }
```

## CLI
`run-sub-directories <--parallel> <cmd>`
 - **--parallel**: specify this if you want the command to be run in parallel into sub directories
 - **cmd**: your command line to execute into sub directories

## TODO
 - [ ] tests
 - [ ] lint
 - [ ] CI
 - [ ] `--parallel` should have to be the first option right now
