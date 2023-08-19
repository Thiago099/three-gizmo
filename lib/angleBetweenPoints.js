export { angleBetweenPoints }
function angleBetweenPoints(x1, y1, x2, y2) {
    const deltaY = y2 - y1;
    const deltaX = x2 - x1;
    const angleInRadians = Math.atan2(deltaY, deltaX);
    return angleInRadians;
  }
  