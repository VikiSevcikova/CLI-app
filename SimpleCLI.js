let CLIApplication = require('./CLIApplication');

const startApp = () => {
    const process = require('process');
            console.log(CLIApplication.getMessage("StartupMessage"));
            console.log(CLIApplication.getMessage("WaitMessage"));
            // Begin reading from stdin so the process does not exit.
            // This is a common trick to prevent our application terminating.
            process.stdin.resume();
            process.on('SIGINT', () => {
                console.log('Received SIGINT. Press Control-D to exit.');
              });

            function handle(signal) {
                console.log(`${CLIApplication.getMessage("RecievedSignal")} ${signal}`);
            }

            process.on('SIGINT', handle);
            process.on('SIGTERM', handle);
            process.on('SIGHUP', handle);

            process.on('SIGWINCH', handle);

            process.stdout.on('resize', () => {
                console.log('screen size has changed!');
                console.log(`${process.stdout.columns}x${process.stdout.rows}`);
            });
}


let SimpleCLI = new CLIApplication("SimpleCLI", require('process'), [
    {
        Switch: '-h',
        Message: 'Shows Suported Params',
        CallBack: () => {
            const fs = require('fs')

            try {
                const data = fs.readFileSync('helper2.txt', 'utf8')
                console.log(data)
              } catch (err) {
                console.error(err)
              }
              
        }
    },
    {
        Switch: '-s',
        Message: 'Start App',
        CallBack: startApp
    },
    {
        Switch: '-arch',
        Message: 'Architecture',
        CallBack: () => {
            console.log(`Architecture ${process.arch}`)
        }
    },
    {
        Switch: '-os',
        Message: 'Operating System',
        CallBack: () => {
            const os = require('os');
            console.log(`Operating System ${os.type}`)
        }
    },
    {
        Switch: '-cpu',
        Message: 'Cpu',
        CallBack: () => {
            const os = require('os');
            let cpus = os.cpus();
            console.log(`Cpus: ${cpus.length} cores`);
            cpus.map((cpu)=> console.log(cpu));
        }
    },
    {
        Switch: '-cf',
        Message: 'Change Folder',
        CallBack: (folder) => {
            if(!folder){
                console.log('Folder not found.');
            }else{
                console.log(`Change folder to ${folder}`);
                try {
                    process.chdir(folder);
                    console.log(`New directory: ${process.cwd()}`);
                } catch (err) {
                    console.error(`chdir: ${err}`);
                }
            }
        }
    },
    {
        Switch: '-ss',
        Message: 'Screen Size',
        CallBack: () => {
            console.log(`Screen size: ${process.stdout.columns}x${process.stdout.rows}`);
        }
    }
])

SimpleCLI.checkParams();
