import * as THREE from 'three';
export {setMaterial}
function setMaterial(object, material)
{
    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = material;
        }
    })
}
