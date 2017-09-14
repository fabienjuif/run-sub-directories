#!/usr/bin/env node

// make bluebird the default implementation of promises
global.Promise = require('bluebird')

// modules
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const { exec } = require('child_process')
const [launcher, file, ...argv] = process.argv

const execSub = sub => new Promise((resolve, reject) => {
  exec(`cd ${sub.name} && ${sub.cmd}`, (err, stdout, stderr) => {
    console.log(`> [${sub.name}] ${sub.cmd}\n${stdout}`)
    if (err) {
      console.error(err)
      reject(err)
    }

    resolve()
  })
});

const run = async () => {
  // read package.json from current location
  const rawPackage = await fs.readFileAsync(path.resolve(process.env.PWD, 'package.json'), { encoding: 'UTF-8' })
  const package = JSON.parse(rawPackage)

  // command line arguments
  const parallel = argv[0] === '--parallel'
  const otherArgs = parallel && argv.filter((a, i) => i !== 0) || argv
  const command = otherArgs.join(' ')

  // create sub commands
  if (package.subdirectories === undefined) throw new Error('package.json file should have a subdirectories field (array)')
  const subs = package
    .subdirectories
    .map(sub => ({ name: sub, cmd: command }))

  // run them
  // - parallel
  if (parallel) {
    return Promise.all(subs.map(execSub))
  }
  // - serial
  for (let i = 0; i < subs.length; ++i) {
    const errors = []
    try {
      await execSub(subs[i])
    } catch (ex) {
      errors.push(ex)
    }
  }
}

run()
 .catch(err => {
   console.error(err)
   process.exit(-1)
 })
