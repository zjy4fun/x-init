#!/usr/bin/env node
import { execSync } from 'child_process';
import { program } from 'commander';
import axios from 'axios';
import ora from 'ora';
import chalk from 'chalk';

// Removed unnecessary constants
const vercel = 'http://x-init-tools.vercel.app/api/data';
const netlify = 'http://main--verdant-cocada-7c7d70.netlify.app/api/data';

const axiosConfig = {
  timeout: 8000,
};

const COMMON = [
  "npm",
  "yarn",
  "pnpm",
  "nrm",
  "fanyi",
  "@antfu/ni",
  "x-init",
  "corepack",
  "@jsdevtools/version-bump-prompt",
];

async function fetchPackages() {
  const spinner = ora();
  spinner.start();
  try {
    const response = await Promise.race([
      axios.get(vercel, axiosConfig),
      axios.get(netlify, axiosConfig),
    ]);
    spinner.succeed('Template URLs fetched');
    return response.data;
  } catch (error) {
    spinner.fail('Failed to fetch template URLs');
    // Return an empty array in case of failure
    return [];
  }
}

let packages = COMMON;
program
  .command('install')
  .alias('i')
  .description('Install packages globally')
  .action(async () => {
    packages = await fetchPackages();
    if (packages.length > 0) {
      // Install each package globally
      packages.forEach((item) => {
        console.log(chalk.green(`Installing ${item} globally...`));
        execSync(`npm install -g ${item}`, { stdio: 'inherit' });
      });
      console.log(chalk.green('All packages installed successfully.'));
    } else {
      console.log('No packages to install.');
    }
  });

// Parse command-line arguments
program.version('2.0.0').parse(process.argv)