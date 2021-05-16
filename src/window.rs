use deno_core::Extension;
use deno_core::OpState;
use deno_core::ZeroCopyBuf;
use deno_core::op_sync;
use deno_core::error::AnyError;
use deno_core::OpFn;
use serde::Deserialize;
use serde::Serialize;
use std::sync::mpsc::Receiver;
use glfw::Context;

pub fn init(ops: &mut Vec<(&'static str, Box<OpFn>)>){
    ops.push(("op_initialize_window",op_sync(initalize_window)));
    ops.push(("op_should_close",op_sync(should_close)));
    ops.push(("op_poll_events",op_sync(poll_events)));
    ops.push(("op_swap_buffers",op_sync(swap_buffers)));
}

#[derive(Deserialize)]
struct InitializeWindowArgs{
    width: u32,
    height: u32,
    title: String,
}

#[derive(Deserialize, Serialize)]
enum WindowEvent{
    Key{key: u32,scancode: u32,action: u32,modifiers: u32},
}

fn initalize_window(
    state: &mut OpState,
    args: InitializeWindowArgs,
    _zero_copy: Option<ZeroCopyBuf>
)->Result<u32,AnyError>{

    let instance = state.try_borrow::<glfw::Glfw>();

    match instance{
        Some(d) => Ok(0), //already initialized
        None => {
            let instance = glfw::init(glfw::FAIL_ON_ERRORS).expect("Failed to create glfw");
            
            let (mut window,mut events) = instance.create_window(
                args.width, 
                args.height, 
                &args.title, 
                glfw::WindowMode::Windowed
            ).expect("Failed to create window");

            gl::load_with(|s|window.get_proc_address(s));

            state.put(instance);
            state.put(window);
            state.put(events);

            Ok(0)
        },
    }
}

fn should_close(
    state: &mut OpState,
    _: (),
    _: (),
) -> Result<bool,AnyError>{
    let window = state.try_borrow::<glfw::Window>().expect("Failed to get window instance");
    Ok(window.should_close())
}

fn poll_events(
    state: &mut OpState,
    _: (),
    _: ()
) -> Result<Vec<WindowEvent>,AnyError>{

    {
        let glfw = state.try_borrow_mut::<glfw::Glfw>().expect("Failed to get glfw instance");
        glfw.poll_events();
    }
    
    let events = state.try_borrow::<Receiver<(f64,glfw::WindowEvent)>>().expect("Failed to get window event reciever");
    
    let mut out: Vec<WindowEvent> = Vec::new();

    for (_,e) in glfw::flush_messages(events){
        match e{
            glfw::WindowEvent::Key(key,scancode,action,modifiers) =>{
                out.push(WindowEvent::Key{
                    key: 0,
                    scancode: 0,
                    action: 0,
                    modifiers: 0
                });
            },
            _ => ()
        }
    }

    Ok(out)
}

fn swap_buffers(
    state: &mut OpState,
    _: (),
    _: ()
) -> Result<u32,AnyError>{


    let window = state.try_borrow_mut::<glfw::Window>().expect("Failed to get window");

    window.swap_buffers();

    Ok(0)
}