import * as THREE from 'three';
import { parse } from "../lib/object";
import { mouseRay } from "../lib/raycaster";
import { angleBetweenPoints } from '../lib/angleBetweenPoints';
import { setMaterial } from '../lib/setMaterial';
import { objectContains } from '../lib/objectContains';

export { rotate }
import { getColor } from '../lib/colors';

import { Object } from '../lib/objects';

function rotate(canvas, camera, renderer, position, callback, endCallback)
{
    const rotation = new THREE.Euler(0,0,0)

    let active = false
    const pivotScene = new THREE.Scene();
    const material1 = new THREE.MeshBasicMaterial({ color: getColor("color1"),polygonOffset: true,polygonOffsetFactor: 1 });
    const material2 = new THREE.MeshBasicMaterial({ color: getColor("color2"),polygonOffset: true,polygonOffsetFactor: 2 });
    const material3 = new THREE.MeshBasicMaterial({ color: getColor("color3"),polygonOffset: true,polygonOffsetFactor: 3 });

    const material4 = new THREE.MeshBasicMaterial({ color: getColor("hover") });

    
    const xz = parse(Object("rotate_helper"))

    const xy = xz.clone()
    const yz = xz.clone()

    xy.rotation.x = -Math.PI / 2;
    yz.rotation.z = Math.PI / 2;

    pivotScene.add(xz)
    pivotScene.add(xy)
    pivotScene.add(yz)

    const angleDict = {
        "xz":"y",
        "xy":"z",
        "yz":"x",
    }

    function resetMaterial()
    {
        setMaterial(xz,material1)
        setMaterial(xy,material2)
        setMaterial(yz,material3)
        canvas.style.cursor = "default"

    }
    resetMaterial()

    function scaleObject(object)
    {
        // Calculate the distance between the camera and the object
        const distance = camera.position.distanceTo(object.position) / 20;

        // Set the scale of the object based on distance
        object.scale.set(distance, distance, distance);
    }
    function scale()
    {
        xz.position.copy(position)
        xy.position.copy(position)
        yz.position.copy(position)
        scaleObject(xz)
        scaleObject(xy)
        scaleObject(yz)
    }
    
    let drag = false
    let selectedAxis = null
    let previousDiff = null
    let isHover = false

    const caster = mouseRay(canvas, camera)

    
    document.addEventListener("mousedown",e=>{
        if(!active) return
        if(e.button != 0 || e.controlKey) return
        if(selectedAxis)
        {
            const ray = caster.cast(e)
            drag = true
            const point = ray.snap(selectedAxis, position)
            previousDiff = {}
            var a = []
            var b = []
            for(const axis of selectedAxis)
            {
                a.push(point[axis])
                b.push(position[axis])
            }
            if(selectedAxis == "xz")
            {
                previousDiff = rotation[angleDict[selectedAxis]] + angleBetweenPoints(...a,...b);
            }
            else
            {
                previousDiff = rotation[angleDict[selectedAxis]] - angleBetweenPoints(...a,...b);

            }
        }
    })


    document.addEventListener("mouseup",e=>{
        if(!active) return
        if(e.button != 0) return
        if(drag)
        {
            endCallback(rotation)
        }
        drag = false
        selectedAxis = null
    })

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
            const point = ray.snap(selectedAxis, position)


            var a = []
            var b = []
            for(const axis of selectedAxis)
            {
                a.push(point[axis])
                b.push(position[axis])
            }
            if(selectedAxis == "xz")
            {
                rotation[angleDict[selectedAxis]] = -angleBetweenPoints(...a,...b) + previousDiff;
            }
            else
            {
                rotation[angleDict[selectedAxis]] = angleBetweenPoints(...a,...b) + previousDiff;
            }
            callback(rotation)
        }
        else
        {
            const ray = caster.cast(e,[xz,xy,yz])
            resetMaterial()
            selectedAxis = null
            isHover = false

            if(ray.intersect != null)
            {
                isHover = true
                if(objectContains(xz, ray.intersect.object))
                {
                    selectedAxis = "xz"
                    setMaterial(ray.intersect.object, material4)
                    canvas.style.cursor = "grab"
                }
                if(objectContains(xy, ray.intersect.object))
                {
                    selectedAxis = "xy"
                    setMaterial(ray.intersect.object, material4)
                    canvas.style.cursor = "grab"
                }
                if(objectContains(yz, ray.intersect.object))
                {
                    selectedAxis = "yz"
                    setMaterial(ray.intersect.object, material4)
                    canvas.style.cursor = "grab"
                }
            }
        }
    })


    function render()
    {
        if(!active) return
        scale()
        renderer.clearDepth();
        renderer.render(pivotScene,camera)
    }
    function set(x,y,z)
    {
        rotation.x = x
        rotation.y = y
        rotation.z = z
        callback(rotation)
    }
    return { render, set active(value){ active = value}, set, get isHover(){return isHover} }
}

