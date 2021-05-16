import * as deno_gl from "../mod.ts";

deno_gl.initializeWindow(400,400,"bacon");

deno_gl.clearColor(1.0,0.0,0.0,1.0);

let isRunning = true;
function update(){

    deno_gl.pollEvents().forEach(x => {
        if (x === "Close"){
            isRunning = false;
        }
    });
    deno_gl.clear(deno_gl.GlEnums.COLOR_BUFFER_BIT);
    deno_gl.swapBuffers();


    if (isRunning){
        setTimeout(() => {
            update();
        }, 5);
    }
}

update();