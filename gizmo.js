import * as THREE from 'three';
import { move } from "./components/move";
import { rotate } from "./components/rotate";
import { scale } from "./components/scale";
export { gizmo }
export { setColor } from "./lib/colors"
function gizmo(camera, renderer)
{
    renderer.autoClear = false;
    
    let position = new THREE.Vector3(0,0,0)
    let helpers = []
    let events = {}
    let object = {render, on}
    
    object.none = none
    object.selectedTool = "none"


    function none()
    {
        object.selectedTool = "none"
        for(const helper of helpers)
        {
            helper.active = false
        }
    }

    object.setOrigin = (point) =>{
        position.copy(point)
    }

    const scalePivot = scale(renderer.domElement, camera, renderer, position,x => events?.scale(x) , x=> events["end-scale"] && events["end-scale"](x) )
    
    helpers.push(scalePivot)

    object.scale = () => {
        none()
        object.selectedTool = "scale"
        scalePivot.active = true
    }

    object.setScale = (...props) => scalePivot.set(...props)
    
    const movePivot = move(renderer.domElement, camera, renderer, position, x => {
        position.copy(x)
        events?.move(x)
    }, x=> events["end-move"] && events["end-move"](x) )

    helpers.push(movePivot)

    object.move = () => {
        none()
        object.selectedTool = "move"
        movePivot.active = true
    }

    object.setPosition = (...props) => movePivot.set(...props)


    
    const rotatePivot =rotate(renderer.domElement, camera, renderer, position, x => events?.rotate(x), x=>  events["end-rotate"] && events["end-rotate"](x) )
    
    helpers.push(rotatePivot)
    object.rotate = () => {
        none()
        object.selectedTool = "rotate"
        rotatePivot.active = true
    }
    object.setRotation = (...props) => rotatePivot.set(...props)

    object.isHover = () => {
        return helpers.some(x=>x.isHover)
    }


    function render()
    {
        for(const helper of helpers)
        {
            helper.render()
        }
    }

    function on(key, value)
    {
        events[key] = value
    }

    return object
}