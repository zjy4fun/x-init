#!/usr/bin/env node

import { program } from 'commander'
import { exec } from 'child_process'
import inquirer from 'inquirer';
import ora from 'ora';
import download from 'download-git-repo'

const templateUrls = {
    'Simple': 'direct:https://github.com/zjy4fun/vue3-vite-ts-simple-template.git#main',
    'Vue3 + Vite + Arco Design': 'direct:https://github.com/zjy4fun/arco-vue3-template.git#main',
    'Vue3 + Vite + Tailwind CSS': 'direct:https://github.com/zjy4fun/tailwindcss-vue3-vite-template.git#main'
}

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
                    choices: Object.keys(templateUrls)
                },
                {
                    type: 'list',
                    name: 'git',
                    message: 'need git init?',
                    choices: ['yes', 'no']
                }
            ])
            .then((answer) => {
                const spinner = ora()
                spinner.text = 'downloading...'
                spinner.start()
                console.log(answer.frameTemplate)
                templateUrls[answer.frameTemplate]
                download(
                    templateUrls[answer.frameTemplate],
                    projectName,
                    { clone: true },
                    function (err) {
                        if (err) {
                            spinner.fail('download failed: ' + JSON.stringify(err))

                        } else {
                            spinner.succeed('download success')
                            // check if git init
                            if (answer.git === 'yes') {
                                exec('git init', { cwd: projectName }, (err, stdout, stderr) => {
                                    if (err) {
                                        console.log(err)
                                        return
                                    }
                                    console.log(stdout)
                                    console.log(stderr)
                                })
                            }
                        }
                    }
                )
            })
    })

program.version("1.0.3").parse(process.argv)