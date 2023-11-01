#!/usr/bin/env node

import { program } from 'commander'
import { exec } from 'child_process'
import inquirer from 'inquirer';
import ora from 'ora';
import download from 'download-git-repo'
import axios from 'axios'

const URLS = {
    'Vue3 Simple': 'direct:https://github.com/zjy4fun/vue3-vite-ts-simple-template.git#main',
    'Vue3 + Vite + Arco Design': 'direct:https://github.com/zjy4fun/arco-vue3-template.git#main',
    'Vue3 + Vite + Tailwind CSS': 'direct:https://github.com/zjy4fun/tailwindcss-vue3-vite-template.git#main',
    'React Simple': 'direct:https://github.com/zjy4fun/react-simple-template.git#main',
}

const remoteUrl = 'https://x-init-json.vercel.app/api/data'
const remoteUrl2 = 'https://gist.githubusercontent.com/zjy4fun/03520bd48febab3a5dd44a27ff2062db/raw/a363a827b329f6209b370eb74babf9f50ae55a11/templateUrls.json'

const promise1 = axios.get(remoteUrl, {
    timeout: 3000,
});
const promise2 = axios.get(remoteUrl2, {
    timeout: 3000,
});

let templateUrls = URLS
async function fetchTemplateUrls() {
    const spinner = ora()
    spinner.start()
    try {
        const response = await Promise.race([promise1, promise2])
        spinner.succeed('template URLs fetched');
        return response.data;
    } catch (error) {
        spinner.fail('Failed to fetch template URLs');
        return URLS;
    }
}

program
    .arguments('<projectName>')
    .description('init a new project')
    .action(async (projectName, options) => {
        templateUrls = await fetchTemplateUrls();
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'frameTemplate',
                    message: 'choose a template',
                    choices: Object.keys(templateUrls)
                },
                {
                    type: 'list',
                    name: 'git',
                    message: 'need git?',
                    choices: ['yes', 'no']
                },
                {
                    type: 'list',
                    name: 'china',
                    message: 'need China mirror acceleration?',
                    choices: ['yes', 'no']
                }
            ])
            .then((answer) => {
                const spinner = ora()
                spinner.start()
                templateUrls[answer.frameTemplate]
                const url = answer.china === 'yes' ? templateUrls[answer.frameTemplate].replace('github.com', 'jihulab.com'): templateUrls[answer.frameTemplate]
                spinner.text = 'downloading from ' + (answer.china === 'yes' ? 'jihulab.com' : 'github.com')
                download(
                    url,
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

program.version("1.0.10").parse(process.argv)