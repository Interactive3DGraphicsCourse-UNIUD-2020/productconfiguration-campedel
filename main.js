var stats, controls, renderer, scene, camera, loader, customMaterial;
var envMap = false;
var graniteMod = false;
var metalGold = false;
var metalSilver = false;
var fabric = false;
var meshPlane;
var textureCube;
var diffuseMap;
var specularMap;
var roughnessMap;
var normalMap;
var vs, fs;

// variabili per gestire il tempo
let clock = new THREE.Clock();
let delta = 0;
let interval = 1 / 60;

var loaderDT = new THREE.CubeTextureLoader();
loaderDT.setPath('cubemaps/dolbyTheatre/');

var textureCubeDT = loaderDT.load([
    'px.png', 'nx.png',
    'py.png', 'ny.png',
    'pz.png', 'nz.png'
]);

var loaderDTIrradiance = new THREE.CubeTextureLoader();
loaderDTIrradiance.setPath('cubemaps/dolbyTheatreIrradiance/');

var textureCubeDTIrra = loaderDTIrradiance.load([
    'px.png', 'nx.png',
    'py.png', 'ny.png',
    'pz.png', 'nz.png'
]);

var vsRefle = document.getElementById("vertex-reflection").textContent;
var fsRefle = document.getElementById("fragment-reflection").textContent;
var vsNoRefle = document.getElementById("vertex-noreflection").textContent;
var fsNoRefle = document.getElementById("fragment-noreflection").textContent;

document.getElementById("graniteMod").onclick = function () { graniteMod = true; };
document.getElementById("metalGold").onclick = function () { metalGold = true; };
document.getElementById("metalSilver").onclick = function () { metalSilver = true; };
document.getElementById("fabric").onclick = function () { fabric = true; };

function update() {
    requestAnimationFrame(update);
    delta += clock.getDelta();
    // ciclo per effettuare il render solamente una volta ogni 1/60 di secondo
    if (delta > interval) {
        render();
        delta = delta % interval;
    }
}

function render() {
    stats.update();
    changeEnv();
    changeMaterial();
    controls.update();
    renderer.render(scene, camera);
}

// funzione responsabile di caricare le immagini come texture
function loadTexture(file) {
    var texture = new THREE.TextureLoader().load(file, function (texture) {
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.needsUpdate = true;
        render();
    })
    return texture;
}

function init() {
    var canvas = document.getElementById("canvasID");
    let box = document.querySelector('.product');
    let canvasWidth = box.offsetWidth;
    let canvasHeight = box.offsetHeight;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 1, 200);
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    textureCube = textureCubeDT;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    var customMaterial = new THREE.ShaderMaterial({ uniforms: applyShaderUniforms(diffuseMapMetalGold, specularMapMetal, roughnessMapMetal, normalMapMetal, textureCube), vertexShader: vs, fragmentShader: fs });
    loader = new THREE.OBJLoader();
    loader.load("model/academyAward.obj", function (group) {
        geometry = group.children[0].geometry;
        geometry.center();
        mesh = new THREE.Mesh(geometry, customMaterial);
        mesh.scale.multiplyScalar(5);
        mesh.castShadow = true;
        mesh.receiveShadow = false;
        scene.add(mesh);
    });

    scene.background = textureCube;

    controls.minDistance = 20;
    controls.maxDistance = 150;
    controls.enablePan = true;

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    camera.position.z = 100;
    camera.position.y = 20;

    customMaterial.needsUpdate = true;
}

function changeEnv() {
    if (envMap == true) {
        envMap = false;
        presentEnv();
    }
}

//cambia il materiale
function changeMaterial() {
    if (graniteMod == true) {
        graniteMod = false;
        mesh.material = new THREE.ShaderMaterial({ uniforms: applyShaderUniforms(diffuseMapGranite, specularMapGranite, roughnessMapGranite, normalMapGranite, textureCube), vertexShader: vs, fragmentShader: fs });
    }
    if (metalGold == true) {
        metalGold = false;
        mesh.material = new THREE.ShaderMaterial({ uniforms: applyShaderUniforms(diffuseMapMetalGold, specularMapMetal, roughnessMapMetal, normalMapMetal, textureCube), vertexShader: vs, fragmentShader: fs });
    }
    if (metalSilver == true) {
        metalSilver = false;
        mesh.material = new THREE.ShaderMaterial({ uniforms: applyShaderUniforms(diffuseMapMetalSilver, specularMapMetal, roughnessMapMetal, normalMapMetal, textureCube), vertexShader: vs, fragmentShader: fs });
    }
    if (fabric == true) {
        fabric = false;
        mesh.material = new THREE.ShaderMaterial({ uniforms: applyShaderUniforms(diffuseMapFabric, specularMapFabric, roughnessMapFabric, normalMapFabric, textureCube), vertexShader: vs, fragmentShader: fs });
    }
}

function presentEnv() {
    textureCube = textureCubeDT;
    scene.background = textureCube;
    mesh.material = new THREE.ShaderMaterial({ uniforms: applyShaderUniforms(diffuseMap, specularMap, roughnessMap, normalMap, textureCube), vertexShader: vs, fragmentShader: fs });
}