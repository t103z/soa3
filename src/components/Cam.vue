<template>
    <div>
        <h3 v-if="!supported">Your browser doesn't support webcam, please use Chrome</h3>
        <video ref="video" autoplay="true" :src="src"></video>
    </div>
</template>
<script>
    export default {
      name: 'cam',
      props: {
        width: {
          type: Number,
          default: 400
        },
        height: {
          type: Number,
          default: 300
        }
      },
      data: function () {
        return {
          src: '',
          stream: '',
          supported: true
        }
      },
      methods: {
        getPhoto () {
          if (!this.supported) {
            return null
          }

          const canvas = this.getCanvas()
          return canvas.toDataURL('image/jpeg')
        },
        getCanvas () {
          if (!this.supported) return null

          if (!this.ctx) {
            let canvas = document.createElement('canvas')
            canvas.height = this.height
            canvas.width = this.width
            this.canvas = canvas

            this.ctx = canvas.getContext('2d')
          }

          const { ctx, canvas } = this
          ctx.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height)

          return canvas
        },
        checkSupported () {
          return this.supported
        }

      },
      mounted: function () {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia

        if (navigator.getUserMedia) {
          navigator.getUserMedia({ video: true }, (stream) => {
            this.src = window.URL.createObjectURL(stream)
            this.stream = stream
          }, (error) => {
            console.log(error)
          })
        } else {
          this.supported = false
        }
      },
      beforeDestroy: function () {
        this.$refs.video.pause()
        this.src = ''
        this.stream.getTracks()[0].stop()
      }
    }
</script>
