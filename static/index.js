import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';
import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/MTLLoader.js';
import {MtlObjBridge} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';

var username = "";
var avatarName = "";
var players = [];
var exit = false;
function main() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  var canvas = renderer.domElement;
  canvas.style = "position: absolute; left: 0; top: 0; z-index: 0;"
  document.getElementById("canvasHolder").appendChild( canvas );
  var canvas1 = document.getElementById("textCanvas")
  canvas1.width = canvas.width
  canvas1.height = canvas.height
  

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  var controls = new OrbitControls( camera, renderer.domElement );

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set( 0, 20, 100 );
    controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

//   {
//     const planeSize = 40;

//     const loader = new THREE.TextureLoader();
//     const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//     texture.magFilter = THREE.NearestFilter;
//     const repeats = planeSize / 2;
//     texture.repeat.set(repeats, repeats);

//     const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
//     const planeMat = new THREE.MeshPhongMaterial({
//       map: texture,
//       side: THREE.DoubleSide,
//     });
//     const mesh = new THREE.Mesh(planeGeo, planeMat);
//     mesh.rotation.x = Math.PI * -.5;
//     scene.add(mesh);
//   }

  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
  }

  document.getElementById('loginButton').onclick = setLogin;
  function setLogin() {
        username = document.getElementById('username').value;
        window.onbeforeunload = function() {
            exit = true;
            var url = "https://connectus.dev/exit?user=" + username
            fetch(url, {keepalive: true})
        };
        avatarName = document.getElementById('avatar').value;
        spawnPlayer(username, avatarName, (up, ap) => {});
    }

function spawnPlayer(userparam, avatarparam, callback) {
    players.push(userparam);
    const mtlLoader = new MTLLoader();
    console.log("Spawn 1: " + userparam)
    mtlLoader.load("static/" + avatarparam + "/" + avatarparam + ".mtl", mtlParseResult => {
        console.log("Spawn 2: " + userparam)
        const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
        const objLoader = new OBJLoader2();
        objLoader.addMaterials(materials);
        console.log("Spawn 3: " + userparam)
        objLoader.load("static/" + avatarparam + "/" + avatarparam + ".obj", obj => { 
            obj.name = userparam
            obj.position.x = 5
            obj.position.y = 0.7
            console.log("Spawn 4: " + userparam)
            scene.add(obj) 
            callback(userparam, avatarparam)
        });
    });
}
  {

//   {
//     const mtlLoader = new MTLLoader();
//     mtlLoader.load("convention256/convention256.mtl", mtlParseResult => {
//         const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
//         const objLoader = new OBJLoader2();
//         objLoader.addMaterials(materials);
//         objLoader.load("convention256/convention256.obj", obj => { 
//             obj.name = "convention"
//             scene.add(obj) });
//     });
//   }

    const mtlLoader = new MTLLoader();
    mtlLoader.load("static/townSquare/townSquareMagica.mtl", mtlParseResult => {
        const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
        const objLoader = new OBJLoader2();
        objLoader.addMaterials(materials);
        objLoader.load("static/townSquare/townSquareMagica.obj", obj => { 
            obj.name = "townSquare"
            scene.add(obj) });
    });
  }

    var xSpeed = 0.25;
    var ySpeed = 0.25;
    var rotSpeed = 0.1;

    var xmod = 0;
    var ymod = 0;
    var rotmod = 0;
    var shiftmod = 1;

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
                var keyCode = event.which;
                if (keyCode == 87) {
                    ymod = 1
                } else if (keyCode == 83) {
                    ymod = -1
                } else if (keyCode == 81) {
                    xmod = -1
                } else if (keyCode == 69) {
                    xmod = 1
                } else if (keyCode == 65) {
                    rotmod = 1
                } else if (keyCode == 68) {
                    rotmod = -1
                } else if (keyCode == 16) {
                    shiftmod = 2;
                }
                // else if (keyCode == 32) {
                //     player.position.set(0, 0.7, 0);
                // }
    };

    document.addEventListener("keyup", onDocumentKeyUp, false);
    function onDocumentKeyUp(event) {
                var keyCode = event.which;
                if (keyCode == 87) {
                    ymod = 0
                } else if (keyCode == 83) {
                    ymod = 0
                } else if (keyCode == 81) {
                    xmod = 0
                } else if (keyCode == 69) {
                    xmod = 0
                } else if (keyCode == 65) {
                    rotmod = 0
                } else if (keyCode == 68) {
                    rotmod = 0
                } else if (keyCode == 16) {
                    shiftmod = 1
                }
                // else if (keyCode == 32) {
                //     player.position.set(0, 0.7, 0);
                // }
    };

    setInterval(function(){ 
        try {
            if (username != "") {
                var player = scene.getObjectByName(username)
                var cx = Math.cos(player.rotation.y)
                var cy = Math.sin(player.rotation.y)
    
                player.position.x += ySpeed * (ymod * cx + xmod * cy) * shiftmod
                player.position.z += xSpeed * (ymod * -cy + xmod* cx) * shiftmod
                var shiftmod2 = shiftmod
                if (shiftmod2 != 1) {
                    shiftmod2 = shiftmod2 * 3
                }
                player.rotation.y += rotSpeed * rotmod * shiftmod2
            }
        }
        catch(err) {
    
        }
        try {
            if (username != "" && exit == false) {
                var player = scene.getObjectByName(username);
                var url = "https://connectus.dev/setData?user=" + username + "&avatar=" + avatarName + "&x=" + player.position.x + "&y=" + player.position.y + "&z=" + player.position.z + "&rx=" + player.rotation.x + "&ry=" + player.rotation.y + "&rz=" + player.rotation.z
                 fetch(url)
                .then(response => response.json())
                .then(data => {
                    var canvas2 = document.getElementById("textCanvas")
                    var ctx = canvas2.getContext("2d");
                    ctx.clearRect(0, 0, canvas2.width, canvas2.height);   
                    var found_usernames = []
                    for (var i in data) {
                        var found = false;
                        if (i != username) {
                            found_usernames.push(i)
                            var av = data[i][0]
                            var x = Number(data[i][1])
                            var y = Number(data[i][2])
                            var z = Number(data[i][3])
                            var rx = Number(data[i][4])
                            var ry = Number(data[i][5])
                            var rz = Number(data[i][6])
                            for (var j = 0; j < players.length; j++) {
                                if (i == players[j]) {
                                    found = true;
                                    break;
                                }
                            }
                            if (found == false) {
                                console.log("Spawning: " + i)
                                spawnPlayer(i, av, (up, ap) => {
                                    console.log("Spawn Done: " + up)
                                    var other = scene.getObjectByName(up)
                                    other.position.x = x;
                                    other.position.y = y;
                                    other.position.z = z;
                                    other.rotation.x = rx;
                                    other.rotation.y = ry;
                                    other.rotation.z = rz;
                                })
                                
                            }
                            else {
                                var other = scene.getObjectByName(i)
                                other.position.x = x;
                                other.position.y = y;
                                other.position.z = z;
                                other.rotation.x = rx;
                                other.rotation.y = ry;
                                other.rotation.z = rz;
                                // Set nametag
                                var dist = camera.position.distanceTo(other.position)
                                var width = window.innerWidth, height = window.innerHeight;
                                var widthHalf = width / 2, heightHalf = height / 2;
                                var pos = other.position.clone();
                                pos = pos.add(new THREE.Vector3(-1.3, 3.5, 0))
                                pos.project(camera);
                                pos.x = ( pos.x * widthHalf ) + widthHalf;
                                pos.y = - ( pos.y * heightHalf ) + heightHalf;
                                
                                ctx.font = "30px Arial";
                                ctx.fillStyle = "white";
                                ctx.fillText(i, pos.x, pos.y);
                            }
                        }
                    }
                    for(var g = 0; g < players.length; g++) {
                        if(players[g] == username || players[g] == "") {
                            continue;
                        }
                        var f = false;
                        for (var k = 0; k < found_usernames.length; k++) {
                            if (players[g] == found_usernames[k]) {
                                f = true;
                            }
                        }
                        if (f == false) {
                            var b = scene.getObjectByName(players[g]);
                            scene.remove(b);
                            players.splice(g, 1);
                        }
                    }
                })
            }
        }
        catch (err) {
    
        }
    }, 30);
  function render() {
    renderer.render(scene, camera);
    
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
