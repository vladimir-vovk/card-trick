const DATAURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAHCAYAAAD5wDa1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNDNFMzM5REEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNDNFMzM5RUEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0M0UzMzlCQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0M0UzMzlDQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jzOsUQAAANhJREFUeNqsks0KhCAUhW/Sz6pFSc1AD9HL+OBFbdsVOKWLajH9EE7GFBEjOMxcUNHD8dxPBCEE/DKyLGMqraoqcd4j0ChpUmlBEGCFRBzH2dbj5JycJAn90CEpy1J2SK4apVSM4yiKonhePYwxMU2TaJrm8BpykpWmKQ3D8FbX9SOO4/tOhDEG0zRhGAZo2xaiKDLyPGeSyPM8sCxr868+WC/mvu9j13XBtm1ACME8z7AsC/R9r0fGOf+arOu6jUwS7l6tT/B+xo+aDFRo5BykHfav3/gSYAAtIdQ1IT0puAAAAABJRU5ErkJggg=='

class Sparkle {
  constructor (parent, opts = {}) {
    /* Options */
    this.options = {
      color: 'rainbow',
      count: 200,
      overlap: 0,
      speed: 1,
      minSize: 4,
      maxSize: 9,
      direction: 'both',
      spriteCoords: [0, 6, 13, 20],
      ...opts
    }
    const relativeOverlap = 0 - parseInt(this.options.overlap, 10)
    const cssOpts = {
      position: 'absolute',
      top: relativeOverlap.toString() + 'px',
      left: relativeOverlap.toString() + 'px',
      'pointer-events': 'none'
    }

    this.parent = parent

    /* Create canvas */
    this.canvas = document.createElement('canvas')
    this.canvas.classList.add('sparkle-canvas')
    this.canvas.width = parent.offsetWidth
    this.canvas.height = parent.offsetHeight
    Object.keys(cssOpts).forEach(k => {
      this.canvas.style[k] = cssOpts[k]
    })
    this.context = this.canvas.getContext('2d')

    parent.style.position = 'relative'
    // check if the parent has a z-index, if it does
    // then make the canvas 1 place higher than it!
    if (parent.style['z-index'] !== 'auto') {
      const zIndex = parseInt(parent.style['z-index'], 10)
      this.canvas.style['z-index'] = zIndex + 1
    }
    // check if the DOM element is a singleton, ie it
    // doesnt have a closing tag... we can't put the canvas
    // inside an <img> for example.
    var singletons = "IMG|BR|HR|INPUT";
    var regexp = "\\b"+ parent.nodeName +"\\b";
    this.isSingleton = new RegExp(regexp).test(singletons);

    if (this.isSingleton) {
      // insertBefore with null as a second argument works like appendChild
      parent.parentNode.insertBefore(this.canvas, parent.nextSibling)
    } else {
      parent.appendChild(this.canvas)
    }

    /* Sparkle sprite */
    this.sprite = new Image()
    this.sprite.src = DATAURI

    /* Animation */
    this.anim = null
    this.fade = false

    this.particles = this.createSparkles()
  }

  randomParticleSize = () => {
    return Math.floor(Math.random() * (this.options.maxSize - this.options.minSize + 1) + this.options.minSize)
  }

  randomHexColor = () => {
    return '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6)
  }

  createSparkles = () => {
    const { width: w, height: h } = this.canvas
    const options = this.options

    // temporarily store our created particles
    const tempicles = []

    // loop through and add a new particles
    // on each loop for the count provided
    for (var i = 0; i < options.count; i++) {
      let color
      if (options.color === 'rainbow') {
        // if we chose rainbow, give us much random so color very blergh
        // http://www.paulirish.com/2009/random-hex-color-code-snippets/
        color = this.randomHexColor()
      } else if (Array.isArray(options.color)) {
        // if we supplied an array, choose a random color from array.
        color = options.color[Math.floor(Math.random() * options.color.length)]
      } else {
        color = options.color
      }

      let yDelta = Math.floor(Math.random() * 1000) - 500

      if (options.direction === 'down') {
        yDelta = Math.floor(Math.random() * 500) - 550
      } else if (options.direction === 'up') {
        yDelta = Math.floor(Math.random() * 500) + 50
      }

      // create a particle with random position,
      // random sprite start point, delta, size and a defined color.
      const { spriteCoords } = options
      tempicles[i] = {
        position: {
          x: Math.floor(Math.random() * w),
          y: Math.floor(Math.random() * h)
        },
        style: spriteCoords[Math.floor(Math.random() * spriteCoords.length)],
        delta: {
          x: Math.floor(Math.random() * 1000) - 500,
          y: yDelta
        },
        size: this.randomParticleSize(options),
        color
      }
    }

    return tempicles
  }

  show = () => {
    this.canvas.style.visibility = 'visible'
  }

  hide = () => {
    this.canvas.style.visibility = 'hidden'
  }

  resize = (parent = null) => {
    if (parent) {
      this.parent = parent
    }

    // We set the width/height of the canvas upon mouseover
    // because of document-load issues with fonts and images and
    // other things changing dimentions of elements.
    this.canvas.width = this.parent.offsetWidth + this.options.overlap * 2
    this.canvas.height = this.parent.offsetHeight + this.options.overlap * 2

    // also if the base element is a singleton then we re-position the
    // canvas. we don't want the canvas to be in the wrong position if
    // something has moved.
    if (this.isSingleton) {
      const { top, left } = this.parent.getBoundingClientRect()
      this.canvas.style.top = top - this.options.overlap
      this.canvas.style.left = left - this.options.overlap
    }
  }

  start = (parent = null) => {
    this.resize(parent)

    // we hide/show the canvas element on hover
    // just to make sure it has it's garbage collected
    this.show()

    // make sure the animation frame was cancelled, or we
    // get multiple update/draw loops happening (BAD) .. this
    // can happen because we let the animation loop continue
    // while it fades out.
    window.cancelAnimationFrame(this.anim)

    // randomize the opacity every time we over the animation
    // this stops our particles all being at same opacity
    // after the fadeout happens.
    for (let i = 0; i < this.options.count; i++) {
      this.particles[i].opacity = Math.random()
    }

    // run our update loop.
    this.fade = false;
    this.update();
  }

  stop = () => {
    // here we just tell the update loop that
    // we want to fade out, and that we want to
    // take 100 frames to fade out
    this.fade = true;
    this.fadeCount = 100
  }

  update = () => {
    // update is our particle alteration and animation frame
    // render loop, calling draw on each update.
    this.anim = window.requestAnimationFrame(time => {
      // store a floored version of the time passed
      const flatTime = Math.floor(time)

      for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i]
          let resizeParticle = false

          // randomly move particles in the x/y direction
          // we weight x heavier than y allowing some random
          // decelleration giving an ethereal floating feeling
          const randX = (Math.random() > Math.random() * 2)
          const randY = (Math.random() < Math.random() * 5)

          // arbitrary position change/speed based on what felt good.
          if (randX) {
              p.position.x += ((p.delta.x * this.options.speed) / 1500)
          }

          // arbitrary position change/speed based on what felt good.
          if (randY) {
              p.position.y -= ((p.delta.y * this.options.speed) / 800)
          }

          // if particle fell off of canvas, then position it
          // back at the opposite side... minus 7 pixels which is the
          // largest size a particle can be.
          if (p.position.x > this.canvas.width) {
              p.position.x = -(this.options.maxSize)
              resizeParticle = true
          } else if (p.position.x < -(this.options.maxSize)) {
              p.position.x = this.canvas.width
              resizeParticle = true
          }

          // if it fell off top or bottom, give it a random x position
          if (p.position.y > this.canvas.height) {
              p.position.y = -(this.options.maxSize)
              p.position.x = Math.floor(Math.random() * this.canvas.width)
              resizeParticle = true
          } else if (p.position.y < -(this.options.maxSize)) {
              p.position.y = this.canvas.height
              p.position.x = Math.floor(Math.random() * this.canvas.width)
              resizeParticle = true
          }

          // if the particle left the canvas, let's resize it
          if ( resizeParticle ) {
              p.size = this.randomParticleSize()
              p.opacity = 0.4
          }

          // if we're trying to fade out fast because
          // of a _out_ event, increase opacity delta
          if (this.fade) {
              p.opacity -= 0.035
          } else {
              p.opacity -= 0.005
          }

          // if the opacity went below 0, then
          // set it back to 1.2 (this gives slightly longer brightness)
          if (p.opacity <= 0.15) {
              p.opacity = (this.fade) ? 0 : 1.2
          }

          // basically we want to randomly change the sparkles
          // sprite position, this arbitrary number _felt_ right.
          if (flatTime % Math.floor((Math.random() * 7) + 1) === 0) {
              p.style = this.options.spriteCoords[Math.floor(Math.random() * this.options.spriteCoords.length)]
          }
      }

      // draw all the particles.
      this.draw(time)

      // only _stop_ the animation after we've finished
      // fading out and we also hide the canvas.
      if (this.fade) {
          this.fadeCount -= 1
          if (this.fadeCount < 0) {
              window.cancelAnimationFrame(this.anim);
              this.hide()
          } else {
              this.update()
          }
      } else {
          this.update()
      }
    });
  }

  draw = () => {
    // draw is where we draw our particles to the stage.
    // first we clear the entire context for updating.
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // for every particle
    for (let i = 0; i < this.particles.length; i++) {
        // save the context so we can restore teh default settings.
        this.context.save()
        this.context.globalAlpha = this.particles[i].opacity
        this.context.drawImage(this.sprite, this.particles[i].style, 0, 7, 7, this.particles[i].position.x, this.particles[i].position.y, this.particles[i].size, this.particles[i].size)

        // if we set a color we want to tint the sprite with it
        if (this.options.color) {
            this.context.globalCompositeOperation = "source-atop"
            this.context.globalAlpha = 0.6
            this.context.fillStyle = this.particles[i].color
            this.context.fillRect(this.particles[i].position.x, this.particles[i].position.y, 7, 7)
        }

        this.context.restore()
    }
  }
}
