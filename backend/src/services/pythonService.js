import { spawn } from "child_process"; //built in node module to spawn child processes

let pyProcess = null;
let queue = [];

// initialize python process once
const initPython = () => {
  if (pyProcess) return;

  pyProcess = spawn("python", ["main.py"]); //spawning a child process to run the python script main.py where our prediction model is loaded and prediction function defined

  pyProcess.stdout.setEncoding("utf8");

  pyProcess.stdout.on("data", (data) => {
    const response = data.trim();

    if (queue.length > 0) {
      const resolve = queue.shift();
      resolve(response);
    }
  });

  pyProcess.stderr.on("data", (err) => {
    console.error("Python error:", err.toString());
  });

  pyProcess.on("close", () => {
    console.log("Python process exited");
    pyProcess = null;
  });
};

// prediction function
const predict = (text) => {
  return new Promise((resolve, reject) => {
    if (!pyProcess) {
      initPython();
    }

    queue.push(resolve);
    pyProcess.stdin.write(text + "\n");
  });
};

export { predict };
