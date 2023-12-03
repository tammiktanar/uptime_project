
function server_log(log) {
    console.log("\u001b[36m[SERVER]\u001b[37m:", log ,"\u001B[0m")
}

function server_update(log) {
    console.log("\u001b[36m[SERVER]\u001b[37m:", log ,"\u001B[0m")
}

function server_error(log) {
    console.error("\u001b[36m[SERVER]\u001b[37m:\u001b[31m [ERROR]", log ,"\u001B[0m")
}


function mysql_log(log) {
    console.log("\u001b[32m[MYSQL]\u001b[37m:", log ,"\u001B[0m")
}

function mysql_update(log) {
    console.log("\u001b[32m[MYSQL]\u001b[37m:", log ,"\u001B[0m")
}

function mysql_error(log) {
    console.error("\u001b[32m[MYSQL]\u001b[37m:\u001b[31m [ERROR]", log ,"\u001B[0m")
}

module.exports = { 
    server_log, server_update, server_error, 
    mysql_log, mysql_update, mysql_error
};