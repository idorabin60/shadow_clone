process.on('exit', (code) => {
    console.log('\n\n🚨 Process exiting with code:', code);
    const handles = process._getActiveHandles();
    console.log('Active handles count:', handles.length);
    handles.forEach(h => {
        console.log('Handle:', h.constructor ? h.constructor.name : typeof h);
    });
});

const originalExit = process.exit;
process.exit = function (code) {
    console.log('\n\n🚨 SOMEONE CALLED process.exit(', code, ')');
    console.trace();
    originalExit.call(process, code);
};

require('ts-node').register({ transpileOnly: true });
require('./src/index.ts');
