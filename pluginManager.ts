const filePath = `./target/debug/${getPrefix()}deno_gl${getSuffix()}`;
const rid = Deno.openPlugin(filePath);

export const {
    op_initialize_window,
    op_poll_events,
    op_should_close,
    op_swap_buffers,

    op_clear_color,
    op_clear,
} = (Deno as any).core.ops as {[x: string]: number};

function getSuffix(){
    return Deno.build.os === "windows" ?
        ".dll" :
        Deno.build.os === "darwin" ?
        ".dylib" :
        ".so";
}

function getPrefix(){
    return Deno.build.os === "windows" ? 
        "" : "lib"
}

export function invoke(op: number, args?: unknown, zeroCopy?: Uint8Array): unknown{
    return (Deno as any).core.opSync(op,args,zeroCopy)
}