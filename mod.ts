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
    ELEMENT_ARRAY_BUFFER    = 0x8893,

    STREAM_DRAW = 0x88E0,
    STREAM_READ = 0x88E1,
    STREAM_COPY = 0x88E2,
    
    STATIC_DRAW = 0x88E4,
    STATIC_READ = 0x88E5,
    STATIC_COPY = 0x88E6,

    DYNAMIC_DRAW = 0x88E8,
    DYNAMIC_READ = 0x88E9,
    DYNAMIC_COPY = 0x88EA,
}