import * as plugin from "./pluginManager.ts";

export class GLBuffer{
    readonly #_id: number;
    constructor(id: number){
        this.#_id = id;
    }
    get id() {
        return this.#_id;
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

export enum GlEnums{
    COLOR_BUFFER_BIT        = 0x00004000,
    DEPTH_BUFFER_BIT        = 0x00000100,
    STENCIL_BUFFER_BIT      = 0x00000400,
    BACK                    = 0x0405,
    FRONT                   = 0x0404,
    FRONT_AND_BACK          = 0x0408,
    
    CW                      = 0x0900,
    CCW                     = 0x0901,

    ARRAY_BUFFER            = 0x8892,
    ELEMENT_ARRAY_BUFFER    = 0x8893
}