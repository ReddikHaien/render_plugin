import { GlEnums } from "./enums.ts";

export type GetShaderParameterType<T> = 
    T extends GlEnums.SHADER_TYPE ? GlEnums.VERTEX_SHADER | GlEnums.FRAGMENT_SHADER | GlEnums.GEOMETRY_SHADER :
    T extends GlEnums.COMPILE_STATUS ? boolean :
    T extends GlEnums.DELETE_STATUS ? boolean :
    never;