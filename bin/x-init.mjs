#!/usr/bin/env node

import {program} from 'commander'
import inquirer from 'inquirer';
import ora from 'ora';
import download from 'download-git-repo'

program
    .command('create <projectName>')
    .description('create a new project')
    .alias('c')
    .action((projectName, options) => {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'frameTemplate',
                    message: 'choose a frame template',
                    choices: ['Vue3']
                }
            ])
            .then((answer) => {
                const spinner = ora()
                spinner.text = 'downloading...'
                spinner.start()
                download(
                    'direct:https://github.com/zjy4fun/arco-vue3-template.git#main',
                    projectName,
                    {clone: true},
                    function (err) {
                        if (err) {
                            spinner.fail('download failed: ' + JSON.stringify(err))

                        } else {
                            spinner.succeed('download success')
                        }
                    }
                )
            })
    })

program.version("1.0.0").parse(process.argv)