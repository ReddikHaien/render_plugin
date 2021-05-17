import { Plug } from "https://deno.land/x/plug/mod.ts";

const rid = Plug.prepare({
    name: "deno_gl",
    url:  "https://raw.githubusercontent.com/ReddikHaien/deno_gl/main/mod.ts",
    policy: Plug.CachePolicy.STORE
});

export const {
    op_initialize_window,
    op_poll_events,

    op_swap_buffers,

    op_clear_color,
    op_clear,
} = (Deno as any).core.ops() as {[x: string]: number};


export function invoke(op: number, args?: unknown, zeroCopy?: Uint8Array): unknown{
    return (Deno as any).core.opSync(op,args,zeroCopy)
}