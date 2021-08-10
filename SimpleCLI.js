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
        Switch: '-help',
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
        Switch: '-startApp',
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
        Switch: '-ram',
        Message: 'RAM',
        CallBack: () => {
            const os = require('os');
            let free = os.freemem() / 1024 / 1024 / 1024;
            let total = os.totalmem() / 1024 / 1024 /1024;
            console.log(`Free memory: ${Math.floor(free * 100) /100} GB`);
            console.log(`Total memory: ${Math.floor(total * 100) /100} GB`);
        }
    },

    {
        Switch: '-hdd',
        Message: 'HDD',
        CallBack: () => {
            const cp = require('child_process');
            if (process.platform == 'win32') { // Run wmic for Windows.
                cp.exec('wmic logicaldisk get size,freespace,caption', (error, stdout)=>{
                    if(error){
                        console.error(error); return
                    } 
                    console.log(stdout);
                });
                
            } else { // Run df for Linux.
                cp.exec('df', (error, stdout)=>{
                    if(error){
                        console.error(error); return
                    } 
                   console.log(stdout);
                });
            }
        }
    },

    {
        Switch: '-changeFolder',
        Message: 'Change Folder',
        CallBack: (data) => {
            let folder = data[0];
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
        Switch: '-newFolder',
        Message: 'New Folder',
        CallBack: (data) => {
             const fs = require('fs');
             let newFile = data[0];
             let text = data.slice(1, data.length).join(' ');
              try {
                const data = fs.writeFileSync(newFile, text, 'utf8');
                console.log('File was created successfully.')
              } catch (err) {
                console.error(err)
              }
            }
        },
    {
        Switch: '-screenSize',
        Message: 'Screen Size',
        CallBack: () => {
            console.log(`Screen size: ${process.stdout.columns}x${process.stdout.rows}`);
        }
    }
])

SimpleCLI.checkParams();
