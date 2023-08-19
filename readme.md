
# THREE Gizmo

## Description

This is an open source solution, to manipulate objects in three js.
You can manipulate the objects, by clicking and dragging on each part of the gizmo, it will transform your object accordingly.
It has three modes: Move, Rotate and Scale


Move:

![image](https://github.com/Thiago099/three-guizmo/assets/66787043/ecd496f9-c9fa-42c5-9be4-230253295f30)

Rotate:

![image](https://github.com/Thiago099/three-guizmo/assets/66787043/76fbe30b-441b-4509-a145-d048388f1ce2)

Scale:

![image](https://github.com/Thiago099/three-guizmo/assets/66787043/80ec3dc7-3fe9-4529-b4b1-ad597b88193a)

## Example

Here is an example page, with this library implemented:

![image](https://github.com/Thiago099/three-guizmo/assets/66787043/88c5d079-0944-4423-853c-5c21d8d803cc)

[link](https://thiago099.github.io/three-gizmo-example/)

[source code](https://github.com/Thiago099/three-gizmo-example)

## Usage
Install the package:
```
npm i three-gizmo
```
Then you can import it like this:
```js
import { gizmo } from "three-gizmo";
helper = gizmo(camera, renderer)
```
To choose which type of transformation is active you can call these functions
```js
helper.move()
helper.rotate()
helper.scale()
helper.none()
```
For each transformation you can use events to modify your objects:
```js
helper.on("rotate", angle=>{
  // this function will be caleed during the rotation process
})
helper.on("end-rotate",angle=>{
  // this function will be caleed at the end of the rotation process
})
```

the available events are: scale, end-scale, move, end-move, rotate, end-rotate

Finally, to render your gizmo after the render function you must call the gizmo render function:

```js
renderer.render( scene, camera );
helper.render()
```

You can change the gizmo position by calling this method:

```js
helper.setOrigin(position)
```
This method returns if the mouse is over any of the helpers, this is useful to not take any other click action, if you are selecting a gizmo

```js
helper.isHover()
```

You can customize your gizmo by using the setColor function

```js
import { setColor } from "three-gizmo";
setColor("color1",0xff0000)
setColor("color2",0x00ff00)
setColor("color3",0x0000ff)
```
![image](https://github.com/Thiago099/three-guizmo/assets/66787043/2a1c097a-4a46-4b8e-983d-6f859b413bd3)

The supported parameters are
```
color1, color2, color3, color4 ,hover
```
