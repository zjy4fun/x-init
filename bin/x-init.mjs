#!/usr/bin/env node

import { program } from 'commander'
import inquirer from 'inquirer';
import ora from 'ora';
import download from 'download-git-repo'

const templateUrls = {
    'Vue3 + Arco Design': 'direct:https://github.com/zjy4fun/arco-vue3-template.git#main',
    'Vue3 + Vite + Tailwind CSS': 'direct:https://github.com/zjy4fun/tailwindcss-vue3-vite-template#main'
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
                        }
                    }
                )
            })
    })

program.version("1.0.1").parse(process.argv)