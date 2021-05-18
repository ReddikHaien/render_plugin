use deno_core::OpState;
use deno_core::ZeroCopyBuf;
use deno_core::op_sync;
use deno_core::error::AnyError;
use deno_core::OpFn;
use serde::Deserialize;


pub fn init(ops: &mut Vec<(&'static str, Box<OpFn>)>){
    ops.push(("op_validate_program",op_sync(validate_program)));
    ops.push(("op_use_program",op_sync(use_program)));
    ops.push(("op_link_program",op_sync(link_program)));
}


pub fn validate_program(
    _state: &mut OpState,
    args: u32,
    _: ()
) -> Result<(),AnyError>{
    
    unsafe{
        gl::ValidateProgram(args);
    }

    Ok(())
}

pub fn use_program(
    _state: &mut OpState,
    args: u32,
    _: ()
) -> Result<(),AnyError>{

    unsafe{
        gl::UseProgram(args);
    }

    Ok(())
}

pub fn link_program(
    _state: &mut OpState,
    args: u32,
    _: ()
) -> Result<(),AnyError>{

    unsafe{
        gl::LinkProgram(args);
    }

    Ok(())
}