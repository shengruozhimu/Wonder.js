/// <reference path="../definitions.d.ts"/>
module dy{
    export class CubemapMaterial extends Material{
        public static create() {
            var obj = new this();

            return obj;
        }

        public reflect:boolean = false;
        public refract:boolean = false;
        public fresnel:boolean = false;
        public refractionRatio:number = null;

        public init(){
            this.shader = render.Shader.create(render.CubemapShaderLib.getInstance().createShaderDefinition({
                reflect: this.reflect,
                refract: this.refract,
                fresnel: this.fresnel
            }));

            super.init();
        }

        protected sendSpecificShaderVariables(quadCmd:render.QuadCommand){
            if (quadCmd.buffers.hasChild("normalBuffer")) {
                this.program.setAttributeData("a_normal", render.VariableType.BUFFER, <render.ArrayBuffer>quadCmd.buffers.getChild("normalBuffer"));
            }

            this.program.setUniformData("u_normalMatrix", render.VariableType.FLOAT_MAT4, quadCmd.mMatrix.copy().invert().transpose());
            this.program.setUniformData("u_cameraPos", render.VariableType.FLOAT_3, Director.getInstance().stage.camera.transform.position);

            //todo refactor
            if(this.refract){
                this.program.setUniformData("u_refractionRatio", render.VariableType.FLOAT_1, this.refractionRatio);
            }
            if(this.fresnel){
                this.program.setUniformData("u_refractionRatio", render.VariableType.FLOAT_1, this.refractionRatio);
            }
        }
    }
}

