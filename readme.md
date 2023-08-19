
# THREE Gizmo

## Description

This is a open source solution, to manipulate objects in three js, it has three features: Move, Rotate and Scale


Move:
![image](https://github.com/Thiago099/three-guizmo/assets/66787043/ecd496f9-c9fa-42c5-9be4-230253295f30)

Rotate:
![image](https://github.com/Thiago099/three-guizmo/assets/66787043/76fbe30b-441b-4509-a145-d048388f1ce2)

Scale:
![image](https://github.com/Thiago099/three-guizmo/assets/66787043/80ec3dc7-3fe9-4529-b4b1-ad597b88193a)


## Usage
Install the package:
```
npm i three-gizmo
```
Then you can inport it like this:
```js
import { gizmo } from "three-gizmo";
helper = gizmo(camera, renderer)
```
To chose wich type of transformation you can use
```js
helper.move()
helper.rotate()
helper.scale()
helper.none()
```
For each transformation you can use to modify your objects:
```js
helper.on("rotate", angle=>{
  // this function will be caleed during the rotation process
})
helper.on("end-rotate",angle=>{
  // this function will be caleed at the end of the rotation process
})
```

the avaliable events are: scale, end-scale, move, end-move, rotate, end-rotate

Finally, to render your gizmo after the render function you must call the gizmo render function:

```js
renderer.render( scene, camera );
helper.render()
```

you can change the gizmo position by calling this method:

```js
helper.setOrigin(position)
```

this method returns if the mouse is over any of the helpers, this is usefull to not take any other click action, if you are selecting a guzmo

```js
helper.isHover()
```
