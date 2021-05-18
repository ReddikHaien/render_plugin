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
    ops.push(("op_cull_face",op_sync(cull_face)));
    ops.push(("op_viewport",op_sync(viewport)));
    ops.push(("op_front_face",op_sync(front_face)));
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


#[derive(Deserialize)]
struct ViewPortArgs{
    x: i32,
    y: i32,
    width: i32,
    height: i32,
}


fn clear(
    _state: &mut OpState,
    args: ClearArgs,
    _: ()
)-> Result<(),AnyError>{

    unsafe{
        gl::Clear(args.mask);
    }
    Ok(())
}

fn clear_color(
    _state: &mut OpState,
    args: ClearColorArgs,
    _: ()
)-> Result<(),AnyError>{

    unsafe{
        gl::ClearColor(args.r, args.g, args.b, args.a);
    }

    Ok(())
}

fn cull_face(
    _state: &mut OpState,
    mode: u32,
    _: (),
)->Result<(),AnyError>{
    unsafe{
        gl::CullFace(mode);
    }
    Ok(())
}

fn viewport(
    _state: &mut OpState,
    args: ViewPortArgs,
    _: ()
)-> Result<(),AnyError>{
    unsafe{
        gl::Viewport(args.x,args.y,args.width,args.height);
    }
    Ok(())
}

fn front_face(
    _state: &mut OpState,
    mode: u32,
    _: (),
) -> Result<(),AnyError>{
    unsafe{
        gl::FrontFace(mode);
    }
    Ok(())
}