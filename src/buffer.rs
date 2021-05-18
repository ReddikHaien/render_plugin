use deno_core::OpState;
use deno_core::ZeroCopyBuf;
use deno_core::op_sync;
use deno_core::error::AnyError;
use deno_core::OpFn;
use serde::Deserialize;
use serde::Serialize;

pub fn init(ops: &mut Vec<(&'static str, Box<OpFn>)>){
    ops.push(("op_bind_buffer",op_sync(bind_buffer)));
    ops.push(("op_create_buffer",op_sync(create_buffer)));
}

#[derive(Deserialize)]
struct BindBufferArgs{
    target: u32,
    buffer_id: u32,
}



fn bind_buffer(
    _state: &mut OpState,
    args: BindBufferArgs,
    _: (),
) -> Result<(),AnyError>{

    unsafe{
        gl::BindBuffer(args.target,args.buffer_id);
    }

    Ok(())
}

fn create_buffer(
    _state: &mut OpState,
    _: (),
    _: (),
) -> Result<u32,AnyError>{
    unsafe{
        if !gl::CreateBuffers::is_loaded(){
            panic!("createBuffer function not loaded");
        }
        let mut index: u32 = 0;
        gl::CreateBuffers(1,&mut index);
        Ok(index)
    }
}