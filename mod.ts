import * as plugin from "./pluginManager.ts";
import { GlEnums } from "./enums.ts";
import { GetShaderParameterType } from "./conditional_types.ts";
abstract class PointerWrapper{
    readonly #id: number;
    _deleted: boolean;
    constructor(id: number){
        this.#id = id;
        this._deleted = false;
    }
    get id(){
        return this.#id;
    }
    get deleted(){
        return this._deleted;
    }
}

export class GLBuffer extends PointerWrapper{
    constructor(id: number){
        super(id);
    }
}

export class GLProgram extends PointerWrapper{
    constructor(id: number){
        super(id);
    }
}

export class GLShader extends PointerWrapper{
    constructor(id: number){
        super(id);
    }
}


export function initializeWindow(width: number, height: number, title: string){
    plugin.invoke(plugin.op_initialize_window,{width: width, height: height, title: title});
}

export function swapBuffers(){
    plugin.invoke(plugin.op_swap_buffers);
}

export function pollEvents(){
    return plugin.invoke(plugin.op_poll_events) as any[];
}

export function cullFace(mode: GlEnums.BACK | GlEnums.FRONT | GlEnums.FRONT_AND_BACK){
    plugin.invoke(plugin.op_cull_face,mode);
}

export function viewport(x: number, y: number, width: number, height: number){
    plugin.invoke(plugin.op_viewport,{
        x: x, y: y, width: width, height: height
    });
}

export function frontFace(mode: GlEnums.CCW | GlEnums.CW){
    plugin.invoke(plugin.op_front_face,mode);
}

export function clearColor(r: number, g: number, b: number, a: number){
    plugin.invoke(plugin.op_clear_color,{
        r: r, g: g, b: b, a: a
    });
}

export function clear(mask: number){
    plugin.invoke(plugin.op_clear,{
        mask: mask
    });
}

export function bindBuffer(target: GlEnums.ARRAY_BUFFER | GlEnums.ELEMENT_ARRAY_BUFFER, buffer: GLBuffer ){
    plugin.invoke(plugin.op_bind_buffer,{
        target: target,
        buffer: buffer.id,
    });
}

export function createBuffer(): GLBuffer{
    return new GLBuffer(plugin.invoke(plugin.op_create_buffer) as number);
}

export function bufferData(
    target: GlEnums.ARRAY_BUFFER | GlEnums.ELEMENT_ARRAY_BUFFER, 
    src: number | ArrayBufferView, 
    usage: GlEnums.STATIC_DRAW | GlEnums.STATIC_READ | GlEnums.STATIC_COPY | 
    GlEnums.STREAM_DRAW | GlEnums.STREAM_READ | GlEnums.STREAM_COPY |
    GlEnums.DYNAMIC_DRAW | GlEnums.DYNAMIC_READ | GlEnums.DYNAMIC_COPY){

        if (typeof src === "number"){
            plugin.invoke(plugin.op_buffer_data,{target: target,size: src, usage: usage});
        }
        else{
            const buf = new Uint8Array(src.buffer);
            plugin.invoke(plugin.op_buffer_data,{target: target, size: buf.byteLength, usage: usage}, buf);
        }

}

export function bufferSubData(target: GlEnums.ARRAY_BUFFER | GlEnums.ELEMENT_ARRAY_BUFFER, offset: number, src: ArrayBufferView, srcOffset=0, length?:number){

    plugin.invoke(
        plugin.op_buffer_sub_data,
        {
            target: target,
            offset: offset,
            src_offset: srcOffset,
            length: length ?? src.byteLength,
        },
        new Uint8Array(src.buffer)
    );
}

export function deleteBuffer(buffer: GLBuffer){
    plugin.invoke(plugin.op_delete_buffer,buffer.id);
    buffer._deleted = true;
}

export function validateProgram(program: GLProgram){
    plugin.invoke(plugin.op_validate_program,program.id);
}

export function isProgram(program?: unknown): boolean{
    return program instanceof GLProgram && !program.deleted;
}

export function isShader(shader: unknown): boolean{
    return shader instanceof GLShader && !shader.deleted;
}

export function useProgram(program: GLProgram){
    plugin.invoke(plugin.op_use_program,program.id);
}

export function linkProgram(program: GLProgram){
    plugin.invoke(plugin.op_link_program,program.id);
}

export function shaderSource(shader: GLShader, source: string){
    plugin.invoke(plugin.op_shader_source,{
        id: shader.id,
        source: source
    });
}

export function getShaderSource(shader: GLShader): string{
    return plugin.invoke(plugin.op_get_shader_source,shader.id) as string;
}

export function getShaderParameter <P extends GlEnums.SHADER_TYPE | GlEnums.DELETE_STATUS | GlEnums.COMPILE_STATUS> (shader: GLShader, pname: P): GetShaderParameterType<P>{

    const out = plugin.invoke(plugin.op_get_shader_parameter,{id: shader.id,pname: pname}) as number;
    switch(pname){
        case GlEnums.SHADER_TYPE: return out as GetShaderParameterType<P>;
        case GlEnums.DELETE_STATUS: case GlEnums.COMPILE_STATUS: return (out != GlEnums.FALSE) as GetShaderParameterType<P>;
        default: throw new Error("unsupported pname for getShaderParameter " + GlEnums[pname]);
    }

}

export function getProgramInfoLog(program: GLProgram): string{
    return plugin.invoke(plugin.op_get_program_info_log,program.id) as string;
}