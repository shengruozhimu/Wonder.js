open Wonder_jest;

open Js.Promise;

open RenderConfigType;

let _ =
  describe("test load no worker data", () => {
    open Expect;
    open Expect.Operators;
    open Sinon;
    let sandbox = getSandboxDefaultVal();
    let state = ref(MainStateTool.createState());
    beforeEach(() => {
      sandbox := createSandbox();
      state := TestTool.init(~sandbox, ());
    });
    afterEach(() => restoreSandbox(refJsObjToSandbox(sandbox^)));
    describe("test load job config json files", () => {
      let _buildFakeFetchJsonResponse = jsonStr =>
        LoadDataTool.buildFakeFetchJsonResponse(jsonStr);

      let _buildFakeFetch = sandbox => {
        let fetch = createEmptyStubWithJsObjSandbox(sandbox);
        let (
          noWorkerSetting,
          initPipelines,
          loopPipelines,
          initJobs,
          loopJobs,
        ) =
          NoWorkerJobConfigTool.buildNoWorkerJobConfig();
        fetch
        |> onCall(0)
        |> returns(
             _buildFakeFetchJsonResponse(
               SettingTool.buildSetting(
                 "true",
                 None,
                 SettingTool.buildBufferConfigStr(),
                 {|
        {
        "alpha": true,
        "depth": true,
        "stencil": false,
        "antialias": true,
        "premultiplied_alpha": true,
        "preserve_drawing_buffer": false
        }
               |},
                 "false",
                 "false",
               ),
             ),
           )
        |> onCall(1)
        |> returns(_buildFakeFetchJsonResponse(noWorkerSetting))
        |> onCall(2)
        |> returns(_buildFakeFetchJsonResponse(initPipelines))
        |> onCall(3)
        |> returns(_buildFakeFetchJsonResponse(loopPipelines))
        |> onCall(4)
        |> returns(_buildFakeFetchJsonResponse(initJobs))
        |> onCall(5)
        |> returns(_buildFakeFetchJsonResponse(loopJobs));
        let (shaders, shaderLibs) = RenderConfigTool.buildRenderConfig();
        fetch
        |> onCall(6)
        |> returns(_buildFakeFetchJsonResponse(shaders))
        |> onCall(7)
        |> returns(_buildFakeFetchJsonResponse(shaderLibs));
        fetch;
      };
      describe("test load noWorker config files", () => {
        testPromise("should pass dataDir for get json file path", () => {
          let fetchFunc = _buildFakeFetch(sandbox);
          LoadDataTool.load(
            ~jsonPathArr=[|"../../.res/job/setting.json", "../../.res/job/"|],
            ~fetchFunc,
            (),
          )
          |> then_(() =>
               fetchFunc
               |> expect
               |> toCalledWith([|"../../.res/job/setting.json"|])
               |> resolve
             );
        });
        testPromise("should fetch shader_libs.json file", () => {
          let fetchFunc = _buildFakeFetch(sandbox);
          LoadDataTool.load(
            ~jsonPathArr=[|"../../.res/job/setting.json", "../../.res/job/"|],
            ~fetchFunc,
            (),
          )
          |> then_(() =>
               fetchFunc
               |> expect
               |> toCalledWith([|
                    "../../.res/job/render/shader/shader_libs.json",
                  |])
               |> resolve
             );
        });
        describe("parse job record and set to state", () =>
          testPromise(
            "test parse noWorker setting, init pipeline, noWorker pipeline, init job, noWorker job",
            () => {
              let fetchFunc = _buildFakeFetch(sandbox);
              LoadDataTool.load(~jsonPathArr=[||], ~fetchFunc, ())
              |> then_(() => {
                   let state = MainStateTool.unsafeGetState();
                   (
                     NoWorkerJobConfigTool.getSetting(state),
                     NoWorkerJobConfigTool.getInitPipelines(state),
                     NoWorkerJobConfigTool.getLoopPipelines(state),
                     NoWorkerJobConfigTool.getInitJobs(state),
                     NoWorkerJobConfigTool.getLoopJobs(state),
                   )
                   |>
                   expect == (
                               {
                                 initPipeline: "default",
                                 loopPipeline: "default",
                               },
                               [|
                                 {
                                   name: "default",
                                   jobs: [|
                                     {name: "create_canvas"},
                                     {name: "create_gl"},
                                     {name: "set_full_screen"},
                                     {name: "set_viewport"},
                                     {name: "detect_gl"},
                                     {name: "init_camera"},
                                     {name: "start_time"},
                                     {name: "preget_glslData"},
                                     {name: "init_state"},
                                     {name: "init_basic_material"},
                                     {name: "init_light_material"},
                                     {name: "init_texture"},
                                   |],
                                 },
                               |],
                               [|
                                 {
                                   name: "default",
                                   jobs: [|
                                     {name: "tick"},
                                     {name: "dispose"},
                                     {name: "reallocate_cpu_memory"},
                                     {name: "update_transform"},
                                     {name: "update_camera"},
                                     {name: "get_camera_data"},
                                     {
                                       name: "create_basic_render_object_buffer",
                                     },
                                     {
                                       name: "create_light_render_object_buffer",
                                     },
                                     {name: "clear_color"},
                                     {name: "clear_buffer"},
                                     {name: "clear_last_send_component"},
                                     {name: "send_uniform_shader_data"},
                                     {name: "render_basic"},
                                     {name: "front_render_light"},
                                   |],
                                 },
                               |],
                               [|
                                 {name: "create_canvas", flags: None},
                                 {name: "create_gl", flags: None},
                                 {name: "set_full_screen", flags: None},
                                 {name: "set_viewport", flags: None},
                                 {name: "detect_gl", flags: None},
                                 {name: "init_camera", flags: None},
                                 {name: "start_time", flags: None},
                                 {name: "preget_glslData", flags: None},
                                 {name: "init_state", flags: None},
                                 {name: "init_basic_material", flags: None},
                                 {name: "init_light_material", flags: None},
                                 {name: "init_texture", flags: None},
                               |],
                               [|
                                 {name: "tick", flags: None},
                                 {name: "update_transform", flags: None},
                                 {name: "update_camera", flags: None},
                                 {name: "get_camera_data", flags: None},
                                 {
                                   name: "create_basic_render_object_buffer",
                                   flags: None,
                                 },
                                 {
                                   name: "create_light_render_object_buffer",
                                   flags: None,
                                 },
                                 {
                                   name: "clear_color",
                                   flags: Some([|"#000000"|]),
                                 },
                                 {
                                   name: "clear_buffer",
                                   flags:
                                     Some([|
                                       "COLOR_BUFFER",
                                       "DEPTH_BUFFER",
                                       "STENCIL_BUFFER",
                                     |]),
                                 },
                                 {
                                   name: "clear_last_send_component",
                                   flags: None,
                                 },
                                 {
                                   name: "send_uniform_shader_data",
                                   flags: None,
                                 },
                                 {name: "render_basic", flags: None},
                                 {name: "front_render_light", flags: None},
                                 {name: "dispose", flags: None},
                                 {name: "reallocate_cpu_memory", flags: None},
                                 {name: "draw_outline", flags: None},
                               |],
                             )
                   |> resolve;
                 });
            },
          )
        );
        testPromise("test parse shaders", () => {
          let fetchFunc = _buildFakeFetch(sandbox);
          LoadDataTool.load(~jsonPathArr=[||], ~fetchFunc, ())
          |> then_(() => {
               let state = MainStateTool.unsafeGetState();
               RenderConfigTool.getShaders(state).staticBranchs
               |>
               expect == [|
                           {
                             name: "modelMatrix_instance",
                             value: [|
                               "modelMatrix_noInstance",
                               "modelMatrix_hardware_instance",
                               "modelMatrix_batch_instance",
                             |],
                           },
                           {
                             name: "normalMatrix_instance",
                             value: [|
                               "normalMatrix_noInstance",
                               "normalMatrix_hardware_instance",
                               "normalMatrix_batch_instance",
                             |],
                           },
                         |]
               |> resolve;
             });
        });
        testPromise("test parse shader libs", () => {
          let fetchFunc = _buildFakeFetch(sandbox);
          LoadDataTool.load(~jsonPathArr=[||], ~fetchFunc, ())
          |> then_(() => {
               let state = MainStateTool.unsafeGetState();
               RenderConfigTool.getShaderLibs(state)[0]
               |>
               expect == {
                           name: "common",
                           glsls:
                             Some([|
                               {type_: "vs", name: "common_vertex"},
                               {type_: "fs", name: "common_fragment"},
                             |]),
                           variables:
                             Some({
                               uniforms:
                                 Some([|
                                   {
                                     name: "u_vMatrix",
                                     field: "vMatrix",
                                     type_: "mat4",
                                     from: "camera",
                                   },
                                   {
                                     name: "u_pMatrix",
                                     field: "pMatrix",
                                     type_: "mat4",
                                     from: "camera",
                                   },
                                 |]),
                               attributes: None,
                             }),
                         }
               |> resolve;
             });
        });
        describe("fix bug", () =>
          testPromise(
            "if the order of the fetch of noWorker json record change, shouldn't affect the setted record in state",
            () => {
              let fetchFunc = _buildFakeFetch(sandbox);
              let (
                noWorkerSetting,
                initPipelines,
                loopPipelines,
                initJobs,
                loopJobs,
              ) =
                NoWorkerJobConfigTool.buildNoWorkerJobConfig();
              fetchFunc
              |> onCall(1)
              |> SinonTool.deferReturns(
                   100.,
                   _buildFakeFetchJsonResponse(noWorkerSetting),
                 );
              LoadDataTool.load(~jsonPathArr=[||], ~fetchFunc, ())
              |> then_(() => {
                   let state = MainStateTool.unsafeGetState();
                   NoWorkerJobConfigTool.getSetting(state)
                   |>
                   expect == {
                               initPipeline: "default",
                               loopPipeline: "default",
                             }
                   |> resolve;
                 });
            },
          )
        );
      });
    });
  });