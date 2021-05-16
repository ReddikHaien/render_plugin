import * as plugin from "./pluginManager.ts"
export function initializeWindow(width: number, height: number, title: string){
    plugin.invoke(plugin.op_initialize_window,{width: width, height: height, title: title});
}

export function shouldWindowClose(){
    return plugin.invoke(plugin.op_should_close) as boolean;
}

export function swapBuffers(){
    plugin.invoke(plugin.op_swap_buffers);
}

export function pollEvents(){
    plugin.invoke(plugin.op_poll_events);
}



export function clearColor(r: number, g: number, b: number, a: number){
    plugin.invoke(plugin.op_clear_color,{
        r: r,
        g: g,
        b: b,
        a: a
    });
}

export function clear(mask: number){
    plugin.invoke(plugin.op_clear,{
        mask: mask
    });
}