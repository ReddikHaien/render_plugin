use deno_core::Extension;
use deno_core::OpState;
use deno_core::ZeroCopyBuf;
use deno_core::op_sync;
use deno_core::error::AnyError;
use deno_core::OpFn;
use serde::Deserialize;
use serde::Serialize;

pub fn init(ops: &mut Vec<(&'static str, Box<OpFn>)>){
    ops.push(("op_clear",op_sync(clear)));
    ops.push(("op_clear_color",op_sync(clear_color)));
}

#[derive(Deserialize)]
struct ClearArgs{
    mask: u32,
}

#[derive(Deserialize)]
struct ClearColorArgs{
    r: f32,
    g: f32,
    b: f32,
    a: f32
}


fn clear(
    _state: &mut OpState,
    args: ClearArgs,
    _: ()
)-> Result<u32,AnyError>{

    unsafe{
        gl::Clear(args.mask);
    }
    Ok(0)
}

fn clear_color(
    _state: &mut OpState,
    args: ClearColorArgs,
    _: ()
)-> Result<u32,AnyError>{

    unsafe{
        gl::ClearColor(args.r, args.g, args.b, args.a);
    }

    Ok(0)
}