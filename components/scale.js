import * as THREE from 'three';
import { parse } from "../lib/object";
import { mouseRay } from "../lib/raycaster";
import { setMaterial } from '../lib/setMaterial';
import { objectContains } from '../lib/objectContains';

export { scale }
import { getColor } from '../lib/colors';
import { Object } from '../lib/objects';
function scale(canvas, camera, renderer, position, callback, endCallback)
{
    const size = new THREE.Vector3(1,1,1)

    let active = false
    const pivotScene = new THREE.Scene();
    const material1 = new THREE.MeshBasicMaterial({ color: getColor("color1")});
    const material5 = new THREE.MeshBasicMaterial({ color: getColor("color4")});
    const material2 = new THREE.MeshBasicMaterial({ color: getColor("color2")});
    const material3 = new THREE.MeshBasicMaterial({ color: getColor("color3") });

    const material4 = new THREE.MeshBasicMaterial({ color: getColor("hover")});

    
    const x = parse(Object("scale_helper"))
    const all = parse(Object("scale_all_helper"))

    all.children[0].geometry.scale(1.3,1.3,1.3)

    const y = x.clone()
    const z = x.clone()

    // x.children[0].geometry.translate(0,0,-1)
    const xz =parse(Object("generic_two_axis_helper"))



    xz.children[0].geometry.translate(2,0,-1.5)
    xz.children[0].geometry.scale(3,3,3)
    
    const xy = xz.clone()
    const yz = xz.clone()


    xy.rotation.x = -Math.PI / 2;
    yz.rotation.z = Math.PI / 2;

    pivotScene.add(xz)
    pivotScene.add(xy)
    pivotScene.add(yz)
    pivotScene.add(y)
    pivotScene.add(z)
    pivotScene.add(x); 
    pivotScene.add(all); 

    y.rotation.x = Math.PI / 2;
    z.rotation.y = Math.PI;
    x.rotation.y = -Math.PI / 2

    function resetMaterial()
    {
        setMaterial(x,material1)
        setMaterial(y,material2)
        setMaterial(z,material3)
        setMaterial(xz,material1)
        setMaterial(xy,material2)
        setMaterial(yz,material3)
        setMaterial(all,material5)
        canvas.style.cursor = "default"

    }
    resetMaterial()

        
    let drag = false
    let selectedAxis = null
    let selected = null
    let previousDiff = null
    let previousShiftDiff = null
    let previousScale = null
    let isHover = false

    

    function scaleObject(object)
    {
        // Calculate the distance between the camera and the object
        const distance = camera.position.distanceTo(object.position) / 80;

        // Set the scale of the object based on distance
        object.scale.set(distance, distance, distance);
    }


    document.addEventListener("mouseup",e=>{
        if(!active) return
        if(e.button != 0) return
        if(drag)
        {
            endCallback(size)
        }
        drag = false
        selectedAxis = null
    })

    const caster = mouseRay(canvas, camera)

    document.addEventListener("mousedown",e=>{
        if(!active) return
        if(e.button != 0 || e.controlKey) return
        if(selectedAxis)
        {
            const ray = caster.cast(e)
            drag = true

            if(selectedAxis == "xyz")
            {
                const point = ray.snap("xz", position)
                previousDiff = calculateDistance(point.x,point.z,position.x, position.z)
            }
            else
            {
                const point = ray.snap(selectedAxis, position)

                previousDiff = {}
                
                for(const axis of selectedAxis)
                {
                    previousDiff[axis] = Math.abs(position[axis] - point[axis])
                }

                previousShiftDiff = {}

                let avg = 0
                for(const axis of selectedAxis)
                {
                    avg += point[axis]
                }
                avg /= selectedAxis.length
                for(const axis of selectedAxis)
                {
                    point[axis] = avg
                }

                for(const axis of selectedAxis)
                {
                    previousShiftDiff[axis] = Math.abs(position[axis] - point[axis])
                }
            }

            previousScale = {...size}
        }
    })

    function calculateDistance(x1, y1, x2, y2) {
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        return distance;
      }

    document.addEventListener("mousemove", e=>{
        if(!active) return
        if(e.button != 0 || e.ctrlKey) 
        {
            resetMaterial()
            return
        }
        
        if(drag)
        {
            canvas.style.cursor = "grabbing"

            const ray = caster.cast(e)
            if(selectedAxis == "xyz")
            {
                const point = ray.snap("xz", position)
                for(const axis of selectedAxis)
                {
                    let currentDistance = calculateDistance(point.x,point.z,position.x, position.z)

                    if(currentDistance > previousDiff)
                    {
                        currentDistance = previousDiff + (currentDistance - previousDiff) * 0.3
                    }



                    size[axis] = Math.max(0,previousScale[axis] * currentDistance / previousDiff )
                }
            }
            else
            {
                const point = ray.snap(selectedAxis, position)
                if(e.shiftKey)
                {
                    let avg = 0
                    for(const axis of selectedAxis)
                    {
                        avg += point[axis]
                    }
                    avg /= selectedAxis.length
                    for(const axis of selectedAxis)
                    {
                        point[axis] = avg
                    }
                    for(const axis of selectedAxis)
                    {
                        size[axis] = Math.max(0,previousScale[axis] * (point[axis] - position[axis]) / previousShiftDiff[axis])
                    }
                }
                else
                {
                    for(const axis of selectedAxis)
                    {
                        size[axis] = Math.max(0,previousScale[axis] * (point[axis] - position[axis]) / previousDiff[axis])
                    }
                }
            }

            callback(size)
        }
        else
        {
            const ray = caster.cast(e,[x,y,z,xz,xy,yz,all])
            resetMaterial()
            selectedAxis = null
            isHover = false
            if(ray.intersect != null)
            {
                isHover = true
                if(objectContains(x, ray.intersect.object))
                {
                    selected = x
                    selectedAxis = "x"
                    setMaterial(ray.intersect.object, material4)
                    canvas.style.cursor = "grab"

                } 
                if(objectContains(y, ray.intersect.object)) 
                {
                    selected = y
                    selectedAxis = "y"
                    setMaterial(ray.intersect.object, material4)
                    canvas.style.cursor = "grab"

                }
                if(objectContains(z, ray.intersect.object))
                {
                    selected = z
                    selectedAxis = "z"
                    setMaterial(ray.intersect.object, material4)
                    canvas.style.cursor = "grab"
                }
                if(objectContains(xz, ray.intersect.object))
                {
                    selected = xz
                    selectedAxis = "xz"
                    setMaterial(ray.intersect.object, material4)
                    canvas.style.cursor = "grab"
                }
                if(objectContains(xy, ray.intersect.object))
                {
                    selected = xy
                    selectedAxis = "xy"
                    setMaterial(ray.intersect.object, material4)
                    canvas.style.cursor = "grab"
                }
                if(objectContains(yz, ray.intersect.object))
                {
                    selected = yz
                    selectedAxis = "yz"
                    setMaterial(ray.intersect.object, material4)
                    canvas.style.cursor = "grab"
                }
                if(objectContains(all, ray.intersect.object))
                {
                    selected = all
                    selectedAxis = "xyz"
                    setMaterial(ray.intersect.object, material4)
                    canvas.style.cursor = "grab"
                }
            }
        }
    })

    function scaleObject(object)
    {
        // Calculate the distance between the camera and the object
        const distance = camera.position.distanceTo(object.position) / 80;

        // Set the scale of the object based on distance
        object.scale.set(distance, distance, distance);
    }

    function scale()
    {
        x.position.copy(position)
        y.position.copy(position)
        z.position.copy(position)
        xz.position.copy(position)
        xy.position.copy(position)
        yz.position.copy(position)
        all.position.copy(position)
        scaleObject(x)
        scaleObject(y)
        scaleObject(z)
        scaleObject(xz)
        scaleObject(xy)
        scaleObject(yz)
        scaleObject(all)
    }

    function render()
    {
        if(!active) return
        scale()
        renderer.clearDepth();
        renderer.render(pivotScene,camera)
    }
    function set(x,y,z)
    {
        size.x = x
        size.y = y
        size.z = z
        callback(size)
    }
    return { render, set active(value){ active = value},set, get isHover(){return isHover} }
}

