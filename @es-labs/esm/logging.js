// {
//   const type = 'error'
// 	const orig = console[type]
// 	console[type] = function logError() {
// 		orig.apply(console, [`[${new Date().toISOString().replace("T", " ").replace(/\..+/, "")}]`, ...arguments])
// 	}
// }

var GlobalDebug = (function () {
    var savedConsole = console;
    return function(debugOn,suppressAll){
        var suppress = suppressAll || false;
        if (debugOn === false) {
            console = {};
            console.log = function () { };
            if(suppress) {
                console.info = function () { };
                console.warn = function () { };
                console.error = function () { };
            } else {
                console.info = savedConsole.info;
                console.warn = savedConsole.warn;
                console.error = savedConsole.error;              
            }
        } else {
            console = savedConsole;
        }
    }
})()

GlobalDebug(true, false)
