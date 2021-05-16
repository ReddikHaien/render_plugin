import * as plugin from "./pluginManager.ts"
export function initializeWindow(width: number, height: number, title: string){
    plugin.invoke(plugin.op_initialize_window,{width: width, height: height, title: title});
}

export function swapBuffers(){
    plugin.invoke(plugin.op_swap_buffers);
}

export function pollEvents(){
    return plugin.invoke(plugin.op_poll_events) as any[];
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

export enum GlEnums{
    COLOR_BUFFER_BIT = 0x00004000,
    DEPTH_BUFFER_BIT = 0x00000100,
    STENCIL_BUFFER_BIT = 0x00000400,
    BACK = 0x0405,
    FRONT = 0x0404,
    FRONT_AND_BACK = 0x0408
}