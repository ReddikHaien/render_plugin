use deno_core::Extension;
use deno_core::OpState;
use deno_core::ZeroCopyBuf;
use deno_core::op_sync;
use deno_core::error::AnyError;
use deno_core::OpFn;
use serde::Deserialize;
use serde::Serialize;
use std::sync::mpsc::Receiver;
use winit::platform::run_return::EventLoopExtRunReturn;

pub fn init(ops: &mut Vec<(&'static str, Box<OpFn>)>){
    ops.push(("op_initialize_window",op_sync(initalize_window)));
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
    Close,
}

fn initalize_window(
    state: &mut OpState,
    args: InitializeWindowArgs,
    _zero_copy: Option<ZeroCopyBuf>
)->Result<u32,AnyError>{

    let window = state.try_borrow::<winit::window::Window>();

    match window{
        Some(d) => Ok(0), //already initialized
        None => {
            let event_loop = winit::event_loop::EventLoop::new();

            let window = winit::window::WindowBuilder::new()
                .with_title(&args.title)
                .with_inner_size(winit::dpi::LogicalSize::new(args.width,args.height))
                .build(&event_loop)
                .unwrap();            

            let config = raw_gl_context::GlConfig::default();

            let context = raw_gl_context::GlContext::create(&window, config).unwrap();

            gl::load_with(|symbol| context.get_proc_address(symbol));

            context.make_current();

            state.put(event_loop);
            state.put(window);
            state.put(context);

            Ok(0)
        },
    }
}

fn poll_events(
    state: &mut OpState,
    _: (),
    _: ()
) -> Result<Vec<WindowEvent>,AnyError>{

    
    let mut out: Vec<WindowEvent> = Vec::new();
    let event_loop = state.try_borrow_mut::<winit::event_loop::EventLoop<()>>().expect("Failed to get event loop");
    event_loop.run_return(|event,_,control_flow|{
        *control_flow = winit::event_loop::ControlFlow::Exit;
        match event{
            winit::event::Event::WindowEvent {window_id, event} => {
                match event{
                    winit::event::WindowEvent::KeyboardInput {device_id, input, is_synthetic} => {
                        out.push(WindowEvent::Key{key:0,scancode:0,action:0,modifiers: 0});
                    },
                    winit::event::WindowEvent::CloseRequested => {
                        out.push(WindowEvent::Close);
                    }
                    _ => (),
                }
            }
            _ => (),
        }
    });

    Ok(out)
}

fn swap_buffers(
    state: &mut OpState,
    _: (),
    _: ()
) -> Result<u32,AnyError>{

    {
        let context = state.try_borrow_mut::<raw_gl_context::GlContext>().expect("Failed to borrow glcontext");
        context.swap_buffers();
    }

    let window = state.try_borrow_mut::<winit::window::Window>().expect("Failed to borrow window");
    window.request_redraw();

    Ok(0)
}