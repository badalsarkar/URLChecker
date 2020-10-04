#!/usr/bin/env node

const fs = require("fs").promises;
const yargs = require("yargs");
const chalk = require("chalk");
const axios = require("axios");
const version = require("./package.json").version;

// Define options, aliases, required arguments and usage message
const argv = yargs
  .scriptName("urlcheck")
  .usage(chalk.yellow("Usage: $0 [options]"))
  .alias("f", "file")
  .nargs("f", 1)
  .describe("f", "Load a file")
  .demandOption(["f"])
  .alias("s", "ssl")
  .describe("s", "Check if http works as https in links, enter after file")
  .help("h")
  .alias("h", "help")
  .version(`${version}`)
  .alias("v", "version").argv;

let urlList;

// Read the file asynchronously. Convert data to string, match against URL regex and store in urlList
async function readF() {
  const data = await fs.readFile(argv.file);

  const dataString = data.toString();
  urlList = dataString.match(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g
  );

  return urlList;
}

// Make a head request for each URL asynchronously and print out colored response status code
async function fetch(urlList) {
  urlList.forEach(async (url) => {
    try {
      let urlResponse = await axios.head(url);

      // If ssl argv is input, convert all http to https
      if (argv.s) {
        url = url.replace("http:", "https:");
      }

      if (urlResponse.status == 200) {
        console.log(
          chalk.green.bold(`[SUCCESS] Status: [${urlResponse.status}] ${url}`)
        );
      } else if (urlResponse.status == 400 || urlResponse.status == 404) {
        console.log(
          chalk.red.bold(`[FAIL] Status: [${urlResponse.status}] ${url}`)
        );
      } else {
        console.log(
          chalk.grey.bold(`[UNKNOWN] Status: [${urlResponse.status}] ${url}`)
        );
      }
    } catch (error) {
      console.log(chalk.grey.bold(`[UNKNOWN] Status: [UNKNOWN] ${url}`));
    }
  });
}

// Chain both asynchronous operations
readF().then((urlList) => {
  fetch(urlList);
});
