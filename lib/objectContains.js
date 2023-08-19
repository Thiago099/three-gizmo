export { objectContains }

function objectContains(element, mesh)
{
    return element.children.some(x=>x.uuid == mesh.uuid)
}