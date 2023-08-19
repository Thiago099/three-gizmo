import { SnapToAxis } from "./snap";
import * as THREE from "three"
export {mouseRay}

function mouseRay(canvas, camera)
{
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function cast(event, objects)
    {
        const size = getSize(canvas)
        mouse.x = (event.offsetX / size.width) * 2 - 1;
        mouse.y = -(event.offsetY / size.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        function snap(axis, center)
        {
          return SnapToAxis(raycaster,axis,camera, center)
        }

        if(objects)
        {
          const intersects = raycaster.intersectObjects(objects);
          return {
            snap, 
            intersect: intersects[0]
          }
        }
        else
        {
          return { snap }
        }
    }
    return { cast }
}

function getSize(element)
{
   var computedStyle = window.getComputedStyle(element);
   return {
    width: parseFloat(computedStyle.getPropertyValue('width')),
    height: parseFloat(computedStyle.getPropertyValue('height'))
   }
}


