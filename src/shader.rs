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
    ops.push(("op_shader_source",op_sync(shader_source)));
    ops.push(("op_get_shader_source",op_sync(get_shader_source)));
    ops.push(("op_get_shader_parameter",op_sync(get_shader_parameter)));
    ops.push(("op_get_program_info_log",op_sync(get_program_info_log)));
}

#[derive(Deserialize)]
struct ShaderSourceArgs{
    id: u32,
    source: String
}
#[derive(Deserialize)]
struct CommonGetParameterArgs{
    id: u32,
    pname: u32,
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

fn use_program(
    _state: &mut OpState,
    args: u32,
    _: ()
) -> Result<(),AnyError>{

    unsafe{
        gl::UseProgram(args);
    }

    Ok(())
}

fn link_program(
    _state: &mut OpState,
    args: u32,
    _: ()
) -> Result<(),AnyError>{

    unsafe{
        gl::LinkProgram(args);
    }

    Ok(())
}

fn shader_source(
    _state: &mut OpState,
    args: ShaderSourceArgs,
    _: (),
) -> Result<(),AnyError>{

    let source_pointer = args.source.as_ptr();
    let source_len = args.source.as_bytes().len() as i32;
    unsafe{
        gl::ShaderSource(args.id,1,source_pointer as *const *const i8,&source_len);
    }
    Ok(())
}

fn get_shader_source(
    _state: &mut OpState,
    args: u32,
    _: (),
) -> Result<String,AnyError>{

    unsafe{
        let mut size: i32 = 0;
        gl::GetShaderiv(args,gl::SHADER_SOURCE_LENGTH,&mut size);
        
        let mut buffer = String::with_capacity(size as usize);

        let mut out_size: i32 = 0;

        gl::GetShaderSource(args,size,&mut out_size, buffer.as_mut_ptr() as *mut i8);
        
        if out_size == 0{
            Ok(String::default())
        }
        else{
            Ok(buffer)
        }

    }

}

fn get_shader_parameter(
    _: &mut OpState,
    args: CommonGetParameterArgs,
    _: ()
) -> Result<i32,AnyError>{

    let mut out: i32 = 0;

    unsafe{
        gl::GetShaderiv(args.id,args.pname,&mut out);
    }

    Ok(out)
}

fn get_program_info_log(
    _state: &mut OpState,
    args: u32,
    _: ()
) -> Result<String,AnyError>{

    unsafe{
        let mut log_size: i32 = 0;
        gl::GetProgramiv(args,gl::INFO_LOG_LENGTH,&mut log_size);
    
        let mut log = String::with_capacity(log_size as usize);
        gl::GetProgramInfoLog(args,log_size,&mut log_size,log.as_mut_ptr() as *mut i8);
        
        if log_size == 0{
            Ok(String::from(""))
        }
        else{
            Ok(log)
        }
    }

}