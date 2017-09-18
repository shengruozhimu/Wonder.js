import { getColorDataSize } from "./materialUtils";
import { getColorArr3Data, getSingleSizeData } from "../../../common/operateBufferDataUtils";
import { setTypeArrayValue } from "../../../../../utils/typeArrayUtils";
import { getLightMaterialBufferStartIndex } from "../../../material/bufferUtils";

export const getShadingDataSize = () => 1;

export const getLightModelDataSize = () => 1;

export const getShininessDataSize = () => 1;

export const getMapSize = () => 1;

export const getSpecularColorArr3 = (index: number, LightMaterialDataFromSystem: any) => {
    return getColorArr3Data(index, LightMaterialDataFromSystem.specularColors);
}

export const getEmissionColorArr3 = (index: number, LightMaterialDataFromSystem: any) => {
    return getColorArr3Data(index, LightMaterialDataFromSystem.emissionColors);
}

export const getShininess = (index: number, LightMaterialDataFromSystem: any) => {
    return getSingleSizeData(index, LightMaterialDataFromSystem.shininess);
}

export const getShading = (index: number, LightMaterialDataFromSystem: any) => {
    return getSingleSizeData(index, LightMaterialDataFromSystem.shadings);
}

export const getLightModel = (index: number, LightMaterialDataFromSystem: any) => {
    return getSingleSizeData(index, LightMaterialDataFromSystem.lightModels);
}

export const hasDiffuseMap = (index: number, LightMaterialDataFromSystem: any) => {
    return _hasMap(index, LightMaterialDataFromSystem.hasDiffuseMaps);
}

export const hasSpecularMap = (index: number, LightMaterialDataFromSystem: any) => {
    return _hasMap(index, LightMaterialDataFromSystem.hasSpecularMaps);
}

export const markHasMap = (index: number, hasMapTypArray: Uint8Array) => {
    setTypeArrayValue(hasMapTypArray, computeLightBufferIndex(index), 1);
}

export const markNotHasMap = (index: number, hasMapTypArray: Uint8Array) => {
    setTypeArrayValue(hasMapTypArray, computeLightBufferIndex(index), getNotHasMapValue());
}

export const getNotHasMapValue = () => 0;

const _hasMap =(index: number, hasMapTypArray: Uint8Array) => {
    return getSingleSizeData(index, hasMapTypArray) !== getNotHasMapValue();
}

export const computeLightBufferIndex = (index: number) => index - getLightMaterialBufferStartIndex();

export const createTypeArrays = (buffer: any, offset: number, count: number, LightMaterialDataFromSystem: any) => {
    LightMaterialDataFromSystem.specularColors = new Float32Array(buffer, offset, count * getColorDataSize());
    offset += count * Float32Array.BYTES_PER_ELEMENT * getColorDataSize();

    LightMaterialDataFromSystem.emissionColors = new Float32Array(buffer, offset, count * getColorDataSize());
    offset += count * Float32Array.BYTES_PER_ELEMENT * getColorDataSize();

    LightMaterialDataFromSystem.shininess = new Float32Array(buffer, offset, count * getShininessDataSize());
    offset += count * Float32Array.BYTES_PER_ELEMENT * getShininessDataSize();

    LightMaterialDataFromSystem.shadings = new Uint8Array(buffer, offset, count * getShadingDataSize());
    offset += count * Uint8Array.BYTES_PER_ELEMENT * getShadingDataSize();

    LightMaterialDataFromSystem.lightModels = new Uint8Array(buffer, offset, count * getLightModelDataSize());
    offset += count * Uint8Array.BYTES_PER_ELEMENT * getLightModelDataSize();

    LightMaterialDataFromSystem.hasDiffuseMaps = new Uint8Array(buffer, offset, count * getMapSize());
    offset += count * Uint8Array.BYTES_PER_ELEMENT * getMapSize();

    LightMaterialDataFromSystem.hasSpecularMaps = new Uint8Array(buffer, offset, count * getMapSize());
    offset += count * Uint8Array.BYTES_PER_ELEMENT * getMapSize();

    return offset;
}

export const getClassName = () => "LightMaterial";