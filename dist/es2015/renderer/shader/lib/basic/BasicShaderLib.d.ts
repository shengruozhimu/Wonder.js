import { EngineShaderLib } from "../EngineShaderLib";
import { Program } from "../../../program/Program";
import { QuadCommand } from "../../../command/QuadCommand";
import { BasicMaterial } from "../../../../material/BasicMaterial";
import { GLSLChunk } from "../../chunk/ShaderChunk";
export declare class BasicShaderLib extends EngineShaderLib {
    static create(): BasicShaderLib;
    vsChunk: GLSLChunk;
    fsChunk: GLSLChunk;
    sendShaderVariables(program: Program, cmd: QuadCommand, material: BasicMaterial): void;
    setShaderDefinition(cmd: QuadCommand, material: BasicMaterial): void;
}