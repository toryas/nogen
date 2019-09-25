module.exports = function (plop) {

  //Helpers
  function extractCodeString(text) {
    return text.replace(/[^a-zA-Z]/g, "").substr(0, 3).toUpperCase();
  }

  /**
   * Busca codigo de operacion valido para utilizar que no este usado
   * @param {JSON} code_json lista de codigos de api
   * @param {string} code codigo de operacion
   * @param {number} it numero de correlativo por defecto 0
   */
  function findApiCodeValid(code_json, opName, it = 0) {
    let _code = extractCodeString(opName);
    if (it != 0) {
      _code = _code.concat(it);
    }

    let _codeExist = code_json.moduleApi.filter(element => element.apiCode == _code);
    if (_codeExist.length > 0) {
      it++;
      return findApiCodeValid(code_json, opName, it);
    } else {
      return _code;
    }
  }

  // Plop Helpers
  plop.addHelper("upperCase", text => text.toUpperCase());

  plop.addHelper("extractCodeString", extractCodeString);


  // Generator for news artifacts
  plop.setGenerator("newArtifact", {
    description: "new artifact proyect",
    prompts: [
      {
        type: 'list',
        name: 'artifactType',
        message: 'Choose artifact type',
        choices: ['API','BFF', 'Microservice'],
        filter: function (val) {
          return val.toLowerCase();
        }
      },
      {
        type: "input",
        name: "description",
        message: "Artifact description:"
      },
      {
        type: "input",
        name: "author",
        message: "Author name:"
      }
    ],

    actions: data => {
      let actions = [
        {
          type: "addMany",
          destination: "{{path}}/{{kebabCase artifactName}}",
          base: "templates/base-artifact",
          templateFiles: "templates/base-artifact/**/*",
          globOptions: { dot: true }
        }
      ];

      return actions;
    }
  });

  plop.setGenerator("module", {
    description: "module generator",
    prompts: [],
    actions: data => {

      function validate() {
        let fs = require('fs');
        let existRouter = fs.existsSync("src/core/server/router.js");
        if (existRouter) {
          let actions = [
            {
              type: "add",
              path: "{{path}}/src/modules/{{kebabCase moduleName}}/{{kebabCase moduleName}}.module.js",
              templateFile: "templates/module/module.module.js"
            },
            {
              type: "add",
              path: "{{path}}/src/modules/{{kebabCase moduleName}}/{{kebabCase moduleName}}.codes.json",
              templateFile: "templates/module/module.codes.json"
            },
            {
              type: "append",
              path: "{{path}}/src/core/server/router.js",
              pattern: /(?:loadModules\(route\) {|loadModules\(route\){)/gi,
              template: "\t\troute.use('/{{kebabCase moduleName}}',new {{pascalCase moduleName}}Module());"
            },
            {
              type: "modify",
              path: "{{path}}/src/core/server/router.js",
              pattern: /(\/\/-->Import Routers Here:)/gi,
              template: '$1\r\nimport {{pascalCase moduleName}}Module from "../../modules/{{kebabCase moduleName}}/{{kebabCase moduleName}}.module";'
            }
          ];
          return actions;
        } else {
          console.log("Router server not found");
          return []
        }
      }
      return validate();
    }
  });

  plop.setGenerator("controller", {
    description: "controller generator",
    prompts: [
      {
        type: 'list',
        name: 'methodType',
        message: 'Choose method',
        choices: ['GET', 'POST', 'PUT', 'DELETE'],
        filter: function (val) {
          return val.toLowerCase();
        }
      }
    ],
    actions: data => {

      let fs = require('fs');
      let controllerPath = data.controllerPath.split("/");
      switch (controllerPath.length) {
        case 1: console.log("1");
          data.isApi = true;
          let apiPath = `${data.path}/src/api`;
          let existApi = fs.existsSync(`${apiPath}/api.codes.json`);
          data.controllerName = controllerPath[0];
          data.moduleName = "api";
          let configApi = {
            type: "add",
            path: "{{path}}/src/api/api.codes.json",
            templateFile: "templates/module/module.codes.json"
          }
          let actions = [
            {
              type: "add",
              path: `${apiPath}/controllers/{{kebabCase controllerName}}.controller.js`,
              templateFile: "templates/controller/name.controller.js"
            },
            {
              type: "append",
              path: "{{path}}/src/core/server/router.js",
              pattern: /(?:loadModules\(route\){|loadModules\(route\) {)/gi,
              templateFile: "templates/controller/load-api.template"
            },
            {
              type: "append",
              path: "{{path}}/src/core/server/router.js",
              pattern: /(\/\/-->Import Routers Here:)/gi,
              template: 'import {{pascalCase controllerName}}Controller from "../../api/controllers/{{kebabCase controllerName}}.controller";'
            },
            function (data) {
              let moduleCodes = require(`${apiPath}/api.codes.json`);
              let template = require(`${__dirname}/templates/controller/code.template.json`);
              data.apiCode = findApiCodeValid(moduleCodes, data.controllerName);
              template.apiCode = data.apiCode
              moduleCodes.moduleApi.push(template);
              fs.writeFileSync(`${apiPath}/api.codes.json`, JSON.stringify(moduleCodes, null, 2));
            },
            {
              type: "modify",
              path: `${apiPath}/controllers/{{kebabCase controllerName}}.controller.js`,
              pattern: /(#apiCode#)/gi,
              template: "{{apiCode}}"
            }
          ]
          if (!existApi) actions.unshift(configApi);
          return actions;
        default: console.log("default");
          data.controllerName = controllerPath.splice(-1, 1)[0];
          let moduleName = controllerPath[controllerPath.length - 1];
          data.moduleName = moduleName;
          let modulePath = `${data.path}/src/modules${controllerPath.join("/")}`;
          let existModule = fs.existsSync(`${modulePath}/${moduleName}.module.js`);
          if (!existModule) {
            console.log("Module path not found");
            return []
          } else {
            return [
              {
                type: "add",
                path: `${modulePath}/controllers/{{kebabCase controllerName}}.controller.js`,
                templateFile: "templates/controller/name.controller.js"
              },
              {
                type: "append",
                path: `${modulePath}/${moduleName}.module.js`,
                pattern: /(\/\/Import controllers Here --)/gi,
                templateFile: `templates/controller/import.template`
              },
              {
                type: "append",
                path: `${modulePath}/${moduleName}.module.js`,
                pattern: /(?:apiLoad\(route\){|apiLoad\(route\) {)/gi,
                templateFile: "templates/controller/load-controller.template"
              },
              function (data) {
                let moduleCodes = require(`${modulePath}/${moduleName}.codes.json`);
                let template = require(`${__dirname}/templates/controller/code.template.json`);
                data.apiCode = findApiCodeValid(moduleCodes, data.controllerName);
                template.apiCode = data.apiCode
                moduleCodes.moduleApi.push(template);
                fs.writeFileSync(`${modulePath}/${moduleName}.codes.json`, JSON.stringify(moduleCodes, null, 2));
              },
              {
                type: "modify",
                path: `${modulePath}/controllers/{{kebabCase controllerName}}.controller.js`,
                pattern: /(#apiCode#)/gi,
                template: "{{apiCode}}"
              }
            ]
          }
      }
    }
  });

  plop.setGenerator("model", {
    description: "Generador de modelos",
    prompts: [
      {
        type: 'list',
        name: 'modelType',
        message: 'Elija el tipo de base de datos',
        choices: ['MongoDB'],
        filter: function (val) {
          return val.toLowerCase();
        }
      }
    ],
    actions: data => {
      let fs = require('fs');

      let modelPath = data.modelPath.split("/");
      data.modelName = modelPath.pop();
      modelPath = modelPath.join("/");
      if (modelPath.length == 0) {
        data.modelPath = '/api';
      } else {
        data.modelPath = `modules${modelPath}`;
      }

      let generalConf = fs.readFileSync(`${data.path}/src/config/general.config.js`).toString();
      let existConfig = (generalConf.match(/(MONGO_CONFIG)/gi)) ? true : false;

      let mongoConfig = {
        type: "append",
        path: `{{path}}/src/config/general.config.js`,
        templateFile: `templates/model/config/general.config.js`
      }



      let actions = [
        function (data) {
          let package = require(`${data.path}/package.json`);
          let child_process = require('child_process');
          let depMongoose = Object.keys(package.dependencies).includes('mongoose');
          let depJsonschema = Object.keys(package.dependencies).includes('jsonschema');
          let dep = []
          if (!depMongoose) {
            dep.push('mongoose');
          }
          if (!depJsonschema) {
            dep.push('jsonschema');
          }

          if(dep.length > 0){
            child_process.execSync(`npm i -S  ${dep.join(" ")}`, { stdio: [0, 1, 2] });
          }
        },
        {
          type: "add",
          path: `{{path}}/src/core/helpers/mongo.helper.js`,
          templateFile: "templates/model/helpers/mongo.helper.js",
          abortOnFail: false
        },
        {
          type: "add",
          path: `{{path}}/src/{{modelPath}}/models/{{kebabCase modelName}}.model.js`,
          templateFile: `templates/model/base.model.js`
        }
      ]

      if (!existConfig) {
        actions.unshift(mongoConfig);
      }
      return actions;
    }
  });
};

