#!/usr/bin/env node
/* eslint-disable no-console */
import * as yargs from "yargs";
import { AppRunner, errorChalk } from "./app_runner";
import { hideBin } from "yargs/helpers";
import { Context } from "./context";
import * as prompts from "prompts";

const appRunner = new AppRunner();

yargs(hideBin(process.argv))
  .version(false)
  .help()
  .option("ngrok", {
    description: "Run backend server via ngrok.",
    type: "boolean",
    // npm swallows command line args instead of forwarding to the script
    default:
      process.env.npm_config_ngrok?.toLocaleLowerCase().trim() === "true",
  })
  .option("use-https", {
    description: "Start local development server on HTTPS.",
    type: "boolean",
    // npm swallows commands line args instead of forwarding to the script
    default:
      process.env.npm_config_use_https?.toLocaleLowerCase().trim() === "true",
  })
  .command(
    "$0",
    "Starts a local development for the app in /src",
    (yargs) => {
      return yargs
    },
    (args) => {
      const ctx = new Context(process.env, args);
      appRunner.run(ctx);
    },
  )
  .parse();
