'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Wonder_jest = require("wonder-bs-jest/lib/js/src/wonder_jest.js");
var GLSLTool$Wonderjs = require("../../../render/core/GLSLTool.js");
var SettingTool$Wonderjs = require("../../../service/setting/SettingTool.js");
var InstanceTool$Wonderjs = require("../../../service/instance/InstanceTool.js");

function testModelMatrixInstanceShaderLibs(sandbox, param, state) {
  var execFunc = param[2];
  var prepareForJudgeGLSLNotExecFunc = param[1];
  var prepareForJudgeGLSLFunc = param[0];
  Wonder_jest.test("if has no sourceInstance component, use modelMatrix_noInstance shader lib", (function () {
          var match = Curry._2(prepareForJudgeGLSLFunc, sandbox, state[0]);
          return Curry._2(Wonder_jest.Expect[/* Operators */23][/* = */5], Wonder_jest.Expect[/* expect */0](GLSLTool$Wonderjs.containMultiline(GLSLTool$Wonderjs.getVsSource(match[1]), /* :: */[
                              "uniform mat4 u_mMatrix;",
                              /* :: */[
                                "mat4 mMatrix = u_mMatrix;",
                                /* [] */0
                              ]
                            ])), true);
        }));
  describe("else", (function () {
          Wonder_jest.test("if support hardware instance, use modelMatrix_hardware_instance shader lib", (function () {
                  var match = Curry._2(prepareForJudgeGLSLNotExecFunc, sandbox, state[0]);
                  var match$1 = InstanceTool$Wonderjs.addSourceInstance(match[2], match[0]);
                  var state$1 = InstanceTool$Wonderjs.setGPUDetectDataAllowHardwareInstance(sandbox, match$1[0]);
                  Curry._1(execFunc, state$1);
                  return Curry._2(Wonder_jest.Expect[/* Operators */23][/* = */5], Wonder_jest.Expect[/* expect */0](GLSLTool$Wonderjs.containMultiline(GLSLTool$Wonderjs.getVsSource(match[1]), /* :: */[
                                      "attribute vec4 a_mVec4_0;",
                                      /* :: */[
                                        "attribute vec4 a_mVec4_1;",
                                        /* :: */[
                                          "attribute vec4 a_mVec4_2;",
                                          /* :: */[
                                            "attribute vec4 a_mVec4_3;",
                                            /* :: */[
                                              "mat4 mMatrix = mat4(a_mVec4_0, a_mVec4_1, a_mVec4_2, a_mVec4_3);",
                                              /* [] */0
                                            ]
                                          ]
                                        ]
                                      ]
                                    ])), true);
                }));
          describe("else, use modelMatrix_batch_instance shader lib", (function () {
                  Wonder_jest.test("if state->gpuConfig->useHardwareInstance == false, use batch", (function () {
                          var match = Curry._2(prepareForJudgeGLSLNotExecFunc, sandbox, state[0]);
                          var match$1 = InstanceTool$Wonderjs.addSourceInstance(match[2], match[0]);
                          var state$1 = SettingTool$Wonderjs.setGPU(/* record */[/* useHardwareInstance */false], match$1[0]);
                          Curry._1(execFunc, state$1);
                          return Curry._2(Wonder_jest.Expect[/* Operators */23][/* = */5], Wonder_jest.Expect[/* expect */0](GLSLTool$Wonderjs.containMultiline(GLSLTool$Wonderjs.getVsSource(match[1]), /* :: */[
                                              "uniform mat4 u_mMatrix;",
                                              /* :: */[
                                                "mat4 mMatrix = u_mMatrix;",
                                                /* [] */0
                                              ]
                                            ])), true);
                        }));
                  return Wonder_jest.test("if gpu not support hardware instance, use batch", (function () {
                                var match = Curry._2(prepareForJudgeGLSLNotExecFunc, sandbox, state[0]);
                                var match$1 = InstanceTool$Wonderjs.addSourceInstance(match[2], match[0]);
                                var state$1 = InstanceTool$Wonderjs.setGPUDetectDataAllowBatchInstance(match$1[0]);
                                Curry._1(execFunc, state$1);
                                return Curry._2(Wonder_jest.Expect[/* Operators */23][/* = */5], Wonder_jest.Expect[/* expect */0](GLSLTool$Wonderjs.containMultiline(GLSLTool$Wonderjs.getVsSource(match[1]), /* :: */[
                                                    "uniform mat4 u_mMatrix;",
                                                    /* :: */[
                                                      "mat4 mMatrix = u_mMatrix;",
                                                      /* [] */0
                                                    ]
                                                  ])), true);
                              }));
                }));
          return /* () */0;
        }));
  return /* () */0;
}

exports.testModelMatrixInstanceShaderLibs = testModelMatrixInstanceShaderLibs;
/* Wonder_jest Not a pure module */
