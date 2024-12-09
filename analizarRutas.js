
var path;

function empezar(p) {
    path = p.split("/");
    path.shift();

}

function siguiente() {
    return path.shift();
}

module.exports = {
    empezar,
    siguiente
}