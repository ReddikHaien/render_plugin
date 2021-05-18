use deno_core::OpState;
use deno_core::ZeroCopyBuf;
use deno_core::op_sync;
use deno_core::error::AnyError;
use deno_core::OpFn;
use serde::Deserialize;
use serde::Serialize;
use deno_core::error;

pub fn init(ops: &mut Vec<(&'static str, Box<OpFn>)>){
    ops.push(("op_bind_buffer",op_sync(bind_buffer)));
    ops.push(("op_create_buffer",op_sync(create_buffer)));
    ops.push(("op_buffer_data",op_sync(buffer_data)));
    ops.push(("op_buffer_sub_data",op_sync(buffer_sub_data)));
    ops.push(("op_delete_buffer",op_sync(delete_buffer)));
}

#[derive(Deserialize)]
struct BindBufferArgs{
    target: u32,
    buffer_id: u32,
}

#[derive(Deserialize)]
struct BufferDataArgs{
    target: u32,
    size: isize,
    usage: u32,
}

#[derive(Deserialize)]
struct BufferSubDataArgs{
    target: u32,
    offset: isize,
    src_offset: usize,
    length: isize,
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

fn buffer_data(
    _state: &mut OpState,
    args: BufferDataArgs,
    zero_copy: Option<ZeroCopyBuf>
) -> Result<(),AnyError>{

    unsafe{
        gl::BufferData(args.target,args.size,match zero_copy{
            Some(d) => d.as_ptr() as *const std::ffi::c_void,
            None => std::ptr::null()  as *const std::ffi::c_void
        },args.usage);
    }

    Ok(())
}

fn buffer_sub_data(
    _state: &mut OpState,
    args: BufferSubDataArgs,
    zero_copy: Option<ZeroCopyBuf>
) -> Result<(),AnyError>{
    
    let data = match zero_copy{
        Some(ref d) => d,
        None => panic!("expected buffer, recieved none")
    };

    let slice = &data[args.src_offset..];

    unsafe{
        gl::BufferSubData(args.target,args.offset,args.length,slice.as_ptr() as *const std::ffi::c_void)
    }

    Ok(())
}

fn delete_buffer(
    _state: &mut OpState,
    arg: u32,
    _: ()
) -> Result<(),AnyError>{

    unsafe{
        gl::DeleteBuffers(1,&arg);
    }

    Ok(())
}