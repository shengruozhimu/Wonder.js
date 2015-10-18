/// <reference path="../../../definitions.d.ts"/>
module dy{
    export abstract class ShaderLib{
        //abstract attribute
        public type:string = null;

        public attributes:dyCb.Hash<ShaderVariable> = dyCb.Hash.create<ShaderVariable>();
        public uniforms:dyCb.Hash<ShaderVariable> = dyCb.Hash.create<ShaderVariable>();
        public vsSourceTop:string = "";
        public vsSourceDefine:string = "";
        public vsSourceVarDeclare:string = "";
        public vsSourceFuncDeclare:string = "";
        public vsSourceFuncDefine:string = "";
        public vsSourceBody:string = "";
        public fsSourceTop:string = "";
        public fsSourceDefine:string = "";
        public fsSourceVarDeclare:string = "";
        public fsSourceFuncDeclare:string = "";
        public fsSourceFuncDefine:string = "";
        public fsSourceBody:string = "";
        public vsSourceDefineList:dyCb.Collection<any> = dyCb.Collection.create<any>();
        public fsSourceDefineList:dyCb.Collection<any> = dyCb.Collection.create<any>();

        public initWhenCreate(){
            //todo rename?
            this.setShaderDefinition();
        }

        public abstract sendShaderVariables(program: Program, quadCmd:QuadCommand, material:Material);

        protected setShaderDefinition(){
            var vs = this.getVsChunk(),
                fs = this.getFsChunk();

            vs && this.setVsSource(vs);
            fs && this.setFsSource(fs);
        }

        protected getVsChunk();
        protected getVsChunk(type:string);

        protected getVsChunk(){
            var type = arguments.length === 0 ? this.type : arguments[0];

            return this._getChunk(type, ShaderLibType.vs);
        }

        protected getFsChunk();
        protected getFsChunk(type:string);

        protected getFsChunk(){
            var type = arguments.length === 0 ? this.type : arguments[0];

            return this._getChunk(type, ShaderLibType.fs);
        }

        protected setVsSource(vs:GLSLChunk, operator:string="="){
            this._setSource(vs, ShaderLibType.vs, operator);
        }

        protected setFsSource(fs:GLSLChunk, operator:string="="){
            this._setSource(fs, ShaderLibType.fs, operator);
        }

        protected addAttributeVariable(variableArr:Array<string>){
            this._addVariable(this.attributes, variableArr);
        }

        protected addUniformVariable(variableArr:Array<string>){
            this._addVariable(this.uniforms, variableArr);
        }

        protected sendAttributeData(program:Program, name:string, data:any){
            program.sendAttributeData(name, VariableType.BUFFER, data);
        }

        @In(function(program:Program, name:string, data:any){
            assert(!!VariableLib[name], `${name} should exist in VariableLib`);
        })
        protected sendUniformData(program:Program, name:string, data:any){
            program.sendUniformData(name, VariableLib[name].type, data);
        }

        private _getChunk(type:string, sourceType:ShaderLibType){
            var key = null;

            if(type.indexOf(".glsl") > -1){
                key =  `${dyCb.PathUtils.basename(type, ".glsl")}`;
            }
            else{
                if(sourceType === ShaderLibType.vs){
                    key = `${type}_vertex`;
                }
                else{
                    key = `${type}_fragment`;
                }
            }

            return ShaderChunk[key] ? ShaderChunk[key] : ShaderChunk.empty;
        }

        private _setSource(chunk:GLSLChunk, sourceType:ShaderLibType, operator:string) {
            if(!chunk){
                return;
            }

            switch (operator){
                case "+":
                    this[`${sourceType}SourceTop`] += chunk.top;
                    this[`${sourceType}SourceDefine`] += chunk.define;
                    this[`${sourceType}SourceVarDeclare`] += chunk.varDeclare;
                    this[`${sourceType}SourceFuncDeclare`] += chunk.funcDeclare;
                    this[`${sourceType}SourceFuncDefine`] += chunk.funcDefine;
                    this[`${sourceType}SourceBody`] += chunk.body;
                    break;
                case "=":
                    this[`${sourceType}SourceTop`] = chunk.top;
                    this[`${sourceType}SourceDefine`] = chunk.define;
                    this[`${sourceType}SourceVarDeclare`] = chunk.varDeclare;
                    this[`${sourceType}SourceFuncDeclare`] = chunk.funcDeclare;
                    this[`${sourceType}SourceFuncDefine`] = chunk.funcDefine;
                    this[`${sourceType}SourceBody`] = chunk.body;
                    break;
                default:
                    Log.error(true, Log.info.FUNC_INVALID("opertor:", operator));
                    break;
            }
        }

        private _addVariable(target:dyCb.Hash<ShaderVariable>, variableArr:Array<string>){
            variableArr.forEach((variable:string) => {
                Log.assert(VariableLib[variable], Log.info.FUNC_SHOULD(variable, "exist in VariableLib"));

                target.addChild(variable, VariableLib[variable]);
            });
        }
    }

    enum ShaderLibType{
        vs=<any>"vs",
        fs=<any>"fs"
    }
}
