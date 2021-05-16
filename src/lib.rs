use deno_core::Extension;
use deno_core::OpState;
use deno_core::ZeroCopyBuf;
use deno_core::op_sync;
use deno_core::error::AnyError;
use deno_core::OpFn;

use serde::Deserialize;

pub mod window;
pub mod drawing;

#[no_mangle]
pub fn init() -> Extension{
    let mut ops: Vec<(&'static str, Box<OpFn>)> = Vec::new();

    window::init(&mut ops);
    drawing::init(&mut ops);
    
    Extension::builder().ops(ops).build()
}
