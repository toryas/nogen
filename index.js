#!/usr/bin/env node

'use strict';

const nodePlop = require('node-plop');
const plop = nodePlop(__dirname + `/plopfile.js`);
const pkg = require('./package.json');

run();

async function run() {
    let args = process.argv.slice(2);
    let action = args[0];

    switch (action) {
        case '-v': console.log(pkg.version);
            break;
        case 'new':
            let options = groupOptions(args);
            options.artifactName = args[1];
            generateElement("newArtifact", options);
            break;

        case 'generate':
        case 'g': generatorSelector(args);
            break;
    }
}

/**
 * Chosse the generator for opctione **g** of cli
 * @param {Array<String>} args cli arguments
 */
async function generatorSelector(args) {
    let options = groupOptions(args);
    switch (args[1]) {
        case "module":
        case "m":
            options.moduleName = args[2];
            generateElement("module", options);
            break;
        case "controller":
        case "c":
        case "operation":
        case "o":
            options.controllerPath = args[2];
            generateElement("controller", options);
            break;
        case "model":
            options.modelPath = args[2];
            generateElement("model", options);
            break;
            
        default:
            console.log("command not found");
            break;
    }
}

/**
 * 
 * @param {String} type generator type, options are: `newArtifact|module` 
 * @param {*} options 
 */
async function generateElement(type, options = {}) {
    let gen = plop.getGenerator(type);
    try {
        let data = await gen.runPrompts();
        data = {
            ...data,
            ...options,
            path: data.path = process.cwd()
        }
        let result = await gen.runActions(data);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Group the arguments with prefix *--* in a json
 * @example
 * 
 * let agrs = ["ng","new","proyect","--skipGit","--logs"];
 * console.log(groupOptions(args)); //this return
 * 
 * {
 *  skipGit:true,
 *  logs:true
 * }
 * 
 * @param {Array<String>} args cli arguments
 * @returns {JSON} JSON with options
 */
function groupOptions(args) {
    let options = args.filter(arg => arg.substr(0, 2) === "--")
        .map(element => element.substr(2));
    let json = {};
    for (let option in options) {
        json[options[option]] = true;
    }
    return json;
}