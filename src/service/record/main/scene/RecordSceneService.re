open SceneType;

let create = () => {
  currentCameraGameObject: None,
  ambientLight: {
    color: AmbientLightService.getDefaultColor(),
  },
};