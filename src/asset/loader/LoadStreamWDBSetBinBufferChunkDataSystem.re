open WonderBsMost;

open Js.Promise;

open Js.Typed_array;

open StreamType;

let _getGeometry = (meshIndex, geometryArr) =>
  Array.unsafe_get(geometryArr, meshIndex);

let _getGameObjectsAndGeometrys =
    (meshIndex, geometryArr, geometryGameObjects, gameObjectGeometrys) => {
  let geometry = _getGeometry(meshIndex, geometryArr);

  let gameObjects =
    gameObjectGeometrys
    |> WonderCommonlib.ArrayService.reduceOneParami(
         (. indexArr, gameObjectGeometry, index) =>
           gameObjectGeometry === geometry ?
             indexArr |> ArrayService.push(index) : indexArr,
         [||],
       )
    |> Js.Array.map(index => Array.unsafe_get(geometryGameObjects, index));

  /* let geometrys = gameObjects |> Js.Array.copy |> Js.Array.map(_ => geometry); */

  /* (gameObjects, geometrys); */
  (gameObjects, geometry);
};

let _setGeometryData =
    (
      geometryData,
      geometryArr,
      geometryGameObjects,
      gameObjectGeometrys,
      (setPointsByTypeArrayFunc, fromBufferFunc),
      state,
    ) => {
  let (_, geometry) =
    _getGameObjectsAndGeometrys(
      geometryData.meshIndex,
      geometryArr,
      geometryGameObjects,
      gameObjectGeometrys,
    );

  setPointsByTypeArrayFunc(
    geometry,
    fromBufferFunc(geometryData.arrayBuffer),
    state,
  );
};

let _getBasicSourceTextures =
    (imageIndex, basicSourceTextureArr, imageTextureIndexData) =>
  IndicesUtils.getBasicSourceTextures(
    imageIndex,
    basicSourceTextureArr,
    imageTextureIndexData,
  );

let _setImageData =
    (imageData, basicSourceTextureArr, imageTextureIndices, state) => {
  let {imageIndex, image} = imageData |> OptionService.unsafeGet;
  let basicSourceTextures =
    _getBasicSourceTextures(
      imageIndex,
      basicSourceTextureArr,
      imageTextureIndices,
    );

  basicSourceTextures
  |> WonderCommonlib.ArrayService.reduceOneParam(
       (. state, basicSourceTexture) =>
         OperateBasicSourceTextureMainService.setIsNeedUpdate(
           basicSourceTexture,
           BufferSourceTextureService.getNeedUpdate(),
           state,
         )
         |> OperateBasicSourceTextureMainService.setSource(
              basicSourceTexture,
              image |> ImageType.imageToDomExtendImageElement,
            ),
       state,
     );
};

let _getUint32ArrayBufferIndexData = arrayBuffer =>
  Uint32Array.fromBuffer(arrayBuffer)
  |> WonderLog.Contract.ensureCheck(
       indices => GeometryUtils.checkIndexData(indices),
       IsDebugMainService.getIsDebug(StateDataMain.stateData),
     );

let _getIndexUintData = (componentType, arrayBuffer) =>
  switch (componentType) {
  | 5121 => Uint16Array.make(Uint8Array.fromBuffer(arrayBuffer) |> Obj.magic)
  | 5123 => Uint16Array.fromBuffer(arrayBuffer)
  | 5125 =>
    Uint16Array.make(
      _getUint32ArrayBufferIndexData(arrayBuffer) |> Obj.magic,
    )
  | componentType =>
    WonderLog.Log.fatal(
      WonderLog.Log.buildFatalMessage(
        ~title="_getIndexUintData",
        ~description={j|unknown componentType for geometry index|j},
        ~reason="",
        ~solution={j||j},
        ~params={j|componentType: $componentType|j},
      ),
    )
  };

let setBinBufferChunkData =
    (
      loadedStreamChunkDataArrWhichHasAllData,
      (geometryArr, geometryGameObjects, gameObjectGeometrys),
      (basicSourceTextureArr, imageTextureIndices),
      state,
    ) =>
  loadedStreamChunkDataArrWhichHasAllData
  |> WonderCommonlib.ArrayService.reduceOneParam(
       (. state, {geometryData, imageData, type_}) =>
         switch (type_) {
         | Vertex =>
           _setGeometryData(
             geometryData |> OptionService.unsafeGet,
             geometryArr,
             geometryGameObjects,
             gameObjectGeometrys,
             (
               VerticesGeometryMainService.setVerticesByTypeArray,
               Float32Array.fromBuffer,
             ),
             state,
           )
         | Normal =>
           _setGeometryData(
             geometryData |> OptionService.unsafeGet,
             geometryArr,
             geometryGameObjects,
             gameObjectGeometrys,
             (
               NormalsGeometryMainService.setNormalsByTypeArray,
               Float32Array.fromBuffer,
             ),
             state,
           )
         | TexCoord =>
           _setGeometryData(
             geometryData |> OptionService.unsafeGet,
             geometryArr,
             geometryGameObjects,
             gameObjectGeometrys,
             (
               TexCoordsGeometryMainService.setTexCoordsByTypeArray,
               Float32Array.fromBuffer,
             ),
             state,
           )
         | Index =>
           let {componentType, meshIndex, arrayBuffer} =
             geometryData |> OptionService.unsafeGet;
           let (gameObjects, geometry) =
             _getGameObjectsAndGeometrys(
               meshIndex,
               geometryArr,
               geometryGameObjects,
               gameObjectGeometrys,
             );

           let state =
             IndicesGeometryMainService.setIndicesByUint16Array(
               geometry,
               _getIndexUintData(componentType, arrayBuffer),
               state,
             );

           let geometrys =
             gameObjects |> Js.Array.copy |> Js.Array.map(_ => geometry);

           state
           |> BatchAddGameObjectComponentMainService.batchAddGeometryComponentForCreate(
                gameObjects,
                geometrys,
              );
         | Image =>
           _setImageData(
             imageData,
             basicSourceTextureArr,
             imageTextureIndices,
             state,
           )
         },
       state,
     );