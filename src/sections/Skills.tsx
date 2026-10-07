const getCardAnimation = (position: number) => {
  // MAIN / ACTIVE CARD — EXACT CENTER
  if (position === 0) {
    return {
      x: '-50%',
      y: 0,
      scale: 1,
      opacity: 1,
      rotateY: 0,
      zIndex: 50,
      filter: 'blur(0px)',
    }
  }

  // LEFT CARD
  if (position === -1) {
    return {
      x: '-128%',
      y: 32,
      scale: 0.82,
      opacity: 0.42,
      rotateY: 15,
      zIndex: 30,
      filter: 'blur(0px)',
    }
  }

  // RIGHT CARD
  if (position === 1) {
    return {
      x: '28%',
      y: 32,
      scale: 0.82,
      opacity: 0.42,
      rotateY: -15,
      zIndex: 30,
      filter: 'blur(0px)',
    }
  }

  // FAR LEFT
  if (position === -2) {
    return {
      x: '-174%',
      y: 65,
      scale: 0.66,
      opacity: 0.12,
      rotateY: 24,
      zIndex: 10,
      filter: 'blur(1px)',
    }
  }

  // FAR RIGHT
  if (position === 2) {
    return {
      x: '74%',
      y: 65,
      scale: 0.66,
      opacity: 0.12,
      rotateY: -24,
      zIndex: 10,
      filter: 'blur(1px)',
    }
  }

  return {
    x: position < 0 ? '-190%' : '90%',
    y: 80,
    scale: 0.55,
    opacity: 0,
    rotateY: position < 0 ? 30 : -30,
    zIndex: 0,
    filter: 'blur(2px)',
  }
}
