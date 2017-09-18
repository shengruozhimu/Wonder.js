import { ensureFunc } from "../../../../../../../definition/typescript/decorator/contract";
import { AttributeLocationMap } from "../../../../../../type/dataType";
import { createMap, isValidMapValue } from "../../../../../../../utils/objectUtils";

export const getAttribLocation = ensureFunc((pos: number, gl: WebGLRenderingContext, program: WebGLProgram, name: string, attributeLocationMap: AttributeLocationMap) => {
    // it(`${name}'s attrib location should be number`, () => {
    //     expect(pos).be.a("number");
    // });
}, (gl: WebGLRenderingContext, program: WebGLProgram, name: string, attributeLocationMap: AttributeLocationMap) => {
    var pos: number = null;

    pos = attributeLocationMap[name];

    if (isValidMapValue(pos)) {
        return pos;
    }

    pos = gl.getAttribLocation(program, name);
    attributeLocationMap[name] = pos;

    return pos;
})

export const isAttributeLocationNotExist = (pos: number) => {
    return pos === -1;
}

export const setEmptyLocationMap = (shaderIndex: number, LocationDataFromSystem: any) => {
    LocationDataFromSystem.attributeLocationMap[shaderIndex] = createMap();
    LocationDataFromSystem.uniformLocationMap[shaderIndex] = createMap();
}

export const initData = (LocationDataFromSystem: any) => {
    LocationDataFromSystem.attributeLocationMap = createMap();
    LocationDataFromSystem.uniformLocationMap = createMap();
}