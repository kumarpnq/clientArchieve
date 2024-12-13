const defaultLayouts = {
  lg: [
    { i: '0', x: 0, y: 0, w: 12, h: 28 }, // lg width is 10
    { i: '1', x: 0, y: 12, w: 12, h: 28 },
    { i: '2', x: 12, y: 0, w: 4, h: 56 },
    { i: '3', x: 0, y: 28, w: 16, h: 28 },
    { i: '4', x: 0, y: 58, w: 8, h: 28 },
    { i: '5', x: 8, y: 58, w: 8, h: 28 },
    { i: '6', x: 0, y: 75, w: 8, h: 35, maxH: 35, minH: 35 },
    { i: '7', x: 8, y: 110, w: 8, h: 35, isResizable: false, isDraggable: true },
    { i: '8', x: 0, y: 145, w: 8, h: 35, isResizable: false, isDraggable: true },
    { i: '9', x: 8, y: 180, w: 8, h: 35, isResizable: false, isDraggable: true },
    { i: '10', x: 0, y: 215, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '11', x: 0, y: 250, w: 8, h: 35, isResizable: false, isDraggable: true },
    { i: '12', x: 8, y: 285, w: 8, h: 35, isResizable: false, isDraggable: true },
    { i: '13', x: 0, y: 320, w: 8, h: 35, isResizable: false, isDraggable: true },
    { i: '14', x: 8, y: 355, w: 8, h: 35, isResizable: false, isDraggable: true }
  ],
  md: [
    { i: '0', x: 0, y: 0, w: 10, h: 25 }, // lg width is 10
    { i: '1', x: 0, y: 25, w: 10, h: 25 },
    { i: '2', x: 10, y: 0, w: 6, h: 50 },
    { i: '3', x: 0, y: 50, w: 16, h: 25 },
    { i: '4', x: 0, y: 75, w: 16, h: 25 },
    { i: '5', x: 6, y: 100, w: 16, h: 25 },
    { i: '6', x: 0, y: 135, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '7', x: 0, y: 170, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '8', x: 0, y: 205, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '9', x: 0, y: 240, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '10', x: 0, y: 275, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '11', x: 0, y: 310, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '12', x: 8, y: 345, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '13', x: 0, y: 380, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '14', x: 8, y: 415, w: 16, h: 35, isResizable: false, isDraggable: true }
  ],
  sm: [
    { i: '0', x: 0, y: 0, w: 9, h: 25 }, // lg width is 10
    { i: '1', x: 0, y: 0, w: 9, h: 25 },
    { i: '2', x: 9, y: 0, w: 7, h: 50 },
    { i: '3', x: 0, y: 0, w: 16, h: 25 },
    { i: '4', x: 0, y: 0, w: 16, h: 25 },
    { i: '5', x: 0, y: 0, w: 16, h: 25 },
    { i: '6', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '7', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '8', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '9', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '10', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '11', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '12', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '13', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '14', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true }
  ],
  xs: [
    { i: '0', x: 0, y: 0, w: 16, h: 25 }, // lg width is 10
    { i: '1', x: 0, y: 0, w: 16, h: 25 },
    { i: '2', x: 8, y: 0, w: 16, h: 50 },
    { i: '3', x: 0, y: 0, w: 16, h: 25 },
    { i: '4', x: 0, y: 0, w: 16, h: 25 },
    { i: '5', x: 0, y: 0, w: 16, h: 25 },
    { i: '6', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '7', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '8', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '9', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '10', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '11', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '12', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '13', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true },
    { i: '14', x: 0, y: 0, w: 16, h: 35, isResizable: false, isDraggable: true }
  ]
}

export default defaultLayouts
