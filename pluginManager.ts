import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Plug } from "https://deno.land/x/plug/mod.ts";


const rid = await Plug.prepare({
    name: "deno_gl",
    url:  "https://github.com/ReddikHaien/deno_gl/releases/download/V1.0.0/",
    policy: Plug.CachePolicy.STORE,
    cache: "./cache",
    log: true,
});


export const {
    op_initialize_window,
    op_poll_events,

    op_swap_buffers,

    op_clear_color,
    op_clear,
} = (Deno as any).core.ops() as {[x: string]: number};


console.log("heeeey",op_initialize_window);


export function invoke(op: number, args?: unknown, zeroCopy?: Uint8Array): unknown{
    return (Deno as any).core.opSync(op,args,zeroCopy)
}

"https://github.com/ReddikHaien/deno_gl/releases/download/V1.0.0/deno_gl.dll"
"https://github.com/denosaurs/pane/releases/download/0.2.0-pre.0/pane.dll"