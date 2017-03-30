"use strict";

const Path = require("path");
const pkg = require("../package.json");
const optionalRequire = require("optional-require")(require);
const constants = require("./constants");
const utils = require("../lib/utils");
const makeAppMode = require("../lib/app-mode");
const userConfig = optionalRequire(Path.resolve("archetype/config"),
  {
    default: {
      options: { reactLib: "react" }
    }
  });

module.exports = {
  dir: Path.resolve(__dirname, ".."),
  pkg,
  AppMode: makeAppMode(constants.PROD_DIR, userConfig.options && userConfig.options.reactLib),
  prodDir: constants.PROD_DIR,
  eTmpDir: constants.ETMP_DIR,
  prodModulesDir: Path.join(constants.PROD_DIR, "modules"),
  checkUserBabelRc: utils.checkUserBabelRc,
  addArchetypeConfig: (config) => Object.assign(module.exports, config)
};

function checkTopDevArchetype() {
  const devArchName = "@kununu/electrode-archetype-react-app-dev";
  const topPkg = require(Path.resolve("package.json"));
  // in case this is being used for test/dev in the -dev archetype
  if (topPkg.name === devArchName) {
    return optionalRequire(Path.resolve("config/archetype"));
  } else {
    return optionalRequire(`${devArchName}/config/archetype`);
  }
}

//
// Try to set dev settings, if the dev archetype is available.
// It may have been removed for production deployment.
//
function loadDev() {
  const devArchetype = checkTopDevArchetype();
  if (devArchetype) {
    module.exports.addArchetypeConfig(devArchetype);
  } else {
    module.exports.noDev = true;
  }
}

loadDev();
