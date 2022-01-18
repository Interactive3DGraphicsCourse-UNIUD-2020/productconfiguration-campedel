// plastic
var diffuseMapGranite = loadTexture("texture/granite/graniteColor.png");
var specularMapGranite = loadTexture("texture/granite/graniteSpec.png");
var roughnessMapGranite = loadTexture("texture/granite/graniteRough.png");
var normalMapGranite = loadTexture("texture/granite/graniteNormal.png");

// metal
var diffuseMapMetalGold = loadTexture("texture/metal/metalGold.jpg");
var diffuseMapMetalSilver = loadTexture("texture/metal/metalSilver.jpg");

var specularMapMetal = loadTexture("texture/metal/metalSpec.jpg");
var roughnessMapMetal = loadTexture("texture/metal/metalRough.jpg");
var normalMapMetal = loadTexture("texture/metal/metalNormal.jpg");

// fabric
var diffuseMapFabric = loadTexture("texture/fabric/fabricColor.jpg");
var specularMapFabric = loadTexture("texture/fabric/fabricSpec.jpg");
var roughnessMapFabric = loadTexture("texture/fabric/fabricRough.jpg");
var normalMapFabric = loadTexture("texture/fabric/fabricNormal.jpg");

// crea uniforms nel caso in cui il materiale dovrebbe riflettere l'ambiente (granito e metallo)
function applyMaterialRad(diffuseMapPar, specularMapPar, roughnessMapPar, normalMapPar, textureCubePar) {
    diffuseMap = diffuseMapPar;
    specularMap = specularMapPar;
    roughnessMap = roughnessMapPar;
    normalMap = normalMapPar;

    var uniforms = {
        specularMap: { type: "t", value: specularMapPar },
        diffuseMap: { type: "t", value: diffuseMapPar },
        roughnessMap: { type: "t", value: roughnessMapPar },
        pointLightPosition: { type: "v3", value: new THREE.Vector3(0.0, 600.0, 0.0) },
        clight: { type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
        textureRepeat: { type: "v2", value: new THREE.Vector2(1, 1) },
        normalMap: { type: "t", value: normalMapPar },
        normalScale: { type: "v2", value: new THREE.Vector2(0.2, 0.2) },
        envMap: { type: "t", value: textureCubePar },
    };
    return uniforms;
}

//crea uniforms nel caso in cui il materiale non dovrebbe riflettere l'ambiente (tessuto)
function applyMaterialIrra(diffuseMapPar, specularMapPar, roughnessMapPar, normalMapPar, irradianceMap) {
    diffuseMap = diffuseMapPar;
    specularMap = specularMapPar;
    roughnessMap = roughnessMapPar;
    normalMap = normalMapPar;

    var uniforms = {
        diffuseMap: { type: "t", value: diffuseMapPar },
        normalMap: { type: "t", value: normalMapPar },
        normalScale: { type: "v2", value: new THREE.Vector2(1, 1) },
        textureRepeat: { type: "v2", value: new THREE.Vector2(1, 1) },
        pointLightPosition: { type: "v3", value: new THREE.Vector3(0.0, 600.0, 0.0) },
        clight: { type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
        irradianceMap: { type: "t", value: irradianceMap },
        roughnessMap: { type: "t", value: roughnessMapPar },
        specularMap: { type: "t", value: specularMapPar },
    };
    return uniforms;
}

// applicazione il textureCube e Vertex/Fragment shader in base alla situazione
function applyShaderUniforms(diffuseMapPar, specularMapPar, roughnessMapPar, normalMapPar, textureCube){
    if(diffuseMapPar == diffuseMapFabric){
        textureCube = textureCubeDTIrra;
        vs = vsNoRefle; fs = fsNoRefle;
        return applyMaterialIrra(diffuseMapPar, specularMapPar, roughnessMapPar, normalMapPar, textureCube);
    }
    textureCube = textureCubeDT;
    vs = vsRefle; fs = fsRefle;
    return applyMaterialRad(diffuseMapPar, specularMapPar, roughnessMapPar, normalMapPar, textureCube);
}