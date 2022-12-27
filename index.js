#! /usr/bin/env node

const figlet = require("figlet");
const inquirer = require("inquirer");
const fs = require("fs-extra");
const os = require("os");
const multispinner = require("multispinner");

figlet("goated", async (err, data) => {
  if (err) return console.error("There was an error starting the CLI!");

  console.log(data);

  const templatesPath = `${os.homedir()}/goated.js/templates`;

  if (!fs.existsSync(templatesPath)) {
    try {
      fs.mkdirSync(`${os.homedir()}/goated.js`);
      fs.mkdir(templatesPath);

      return console.log("You have no templates to clone!");
    } catch (err) {
      return console.error(
        `There was an error creating the templates directory: ${err}`
      );
    }
  }

  const templates = fs.readdirSync(templatesPath);

  if (!templates.length) return console.log("You have no templates to clone!");

  const answers = await inquirer
    .prompt([
      {
        type: "list",
        name: "template",
        message: "Which template do you want to clone?",
        default: templates[0],
        choices: templates,
      },
      {
        type: "input",
        name: "name",
        message: "What is the name of the new app?",
        default: templates[0],
      },
    ])
    .catch((err) =>
      console.error(`There was an error cloning the template: ${err}`)
    );

  const spinner = new multispinner([answers.template], {
    preText: "Cloning template",
  });

  try {
    fs.copySync(`${templatesPath}/${answers.template}`, `./${answers.name}`);

    spinner.success(answers.template);
  } catch (err) {
    console.error(`There was an error cloning the template: ${err}`);
  }
});
