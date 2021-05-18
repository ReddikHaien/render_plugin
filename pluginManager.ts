//deno-lint-ignore-file camelcase no-explicit-any no-unused-vars

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
    op_cull_face,
    op_front_face,
    op_viewport,
} = (Deno as any).core.ops() as {[x: string]: number};


export function invoke(op: number, args?: unknown, zeroCopy?: Uint8Array): unknown{
    return (Deno as any).core.opSync(op,args,zeroCopy)
}
