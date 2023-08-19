import * as THREE from 'three';
export { SnapToAxis }
function SnapToAxis(raycaster,axis,camera,view_point)
{
    view_point = new THREE.Vector3(view_point.x,view_point.y,view_point.z);
    const view_axis = new THREE.Vector3();
    const view_plane = new THREE.Plane();

    view_axis.x = axis.includes("x")?0:camera.position.x;
    view_axis.y = axis.includes("y")?0:camera.position.y;
    view_axis.z = axis.includes("z")?0:camera.position.z;

    view_plane.setFromNormalAndCoplanarPoint(view_axis, view_point);
    
    const point = new THREE.Vector3();

    raycaster.ray.intersectPlane( view_plane ,point);
    if(!axis.includes("x"))
    {
        point.x = 0;
    }
    if(!axis.includes("y"))
    {
        point.y = 0;
    }
    if(!axis.includes("z"))
    {
        point.z = 0;
    }
    return point;
}

function getAngle(view_plane, view_point, camera)
{
    const planeNormal = view_plane.normal.clone(); // Clone the plane's normal vector
    const vectorToCamera = camera.position.clone().sub(view_point);
    
    // Normalize the vectors
    planeNormal.normalize();
    vectorToCamera.normalize();
    
    // Calculate the cosine of the angle between the vectors
    const cosineAngle = planeNormal.dot(vectorToCamera);
    
    // Calculate the angle in radians
    const angleInRadians = Math.acos(cosineAngle);
    
    // Convert the angle to degrees
    const angleInDegrees = (angleInRadians * 180) / Math.PI;


}