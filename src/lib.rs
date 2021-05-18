use deno_core::Extension;
use deno_core::OpFn;


pub mod window;
pub mod drawing;
pub mod buffer;
pub mod shader;

#[no_mangle]
pub fn init() -> Extension{
    let mut ops: Vec<(&'static str, Box<OpFn>)> = Vec::new();

    window::init(&mut ops);
    drawing::init(&mut ops);
    buffer::init(&mut ops);
    shader::init(&mut ops);
    Extension::builder().ops(ops).build()
}
