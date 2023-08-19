import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
const objLoader = new OBJLoader();
export { load, parse }

function parse(data)
{
  return objLoader.parse(data)
}
function load(path)
{
    return new Promise(resolve=>{
        objLoader.load(
            path,
            (object) => {
                resolve(object)
            },
            (xhr) => {
              // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
              console.error('An error happened', error);
            }
          );
          
    })
}
