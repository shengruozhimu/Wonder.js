'use strict';

var NoWorkerJobConfigTool$Wonderjs = require("../../../service/noWorkerJob/NoWorkerJobConfigTool.js");

function buildNoWorkerJobConfig() {
  return NoWorkerJobConfigTool$Wonderjs.buildNoWorkerJobConfig(undefined, NoWorkerJobConfigTool$Wonderjs.buildNoWorkerInitPipelineConfigWithoutInitMain(/* () */0), NoWorkerJobConfigTool$Wonderjs.buildNoWorkerLoopPipelineConfig(/* () */0), NoWorkerJobConfigTool$Wonderjs.buildNoWorkerInitJobConfigWithoutInitMain(/* () */0), NoWorkerJobConfigTool$Wonderjs.buildNoWorkerLoopJobConfig(/* () */0), /* () */0);
}

exports.buildNoWorkerJobConfig = buildNoWorkerJobConfig;
/* NoWorkerJobConfigTool-Wonderjs Not a pure module */
