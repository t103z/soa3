<template>
    <div>
        <h2>Login Your Account</h2>
        <div v-if="step===1">
            <cam v-if="!retake" ref="webcam"></cam>
            <img v-if="retake" :src="photo" alt=""/>
            <br>
            <b-button v-if="supported" id="take_button" variant="primary" @click="take_photo">{{take_or_retake}}
            </b-button>
            <b-button v-if="retake" id="login_button" variant="success" @click="do_login">Login</b-button>
        </div>

        <div v-if="step>=2">
            <h3>{{wait_info}}</h3>
            <b-link v-if="step>=3" to="/evaluate">Proceed to used car evaluation</b-link>
        </div>
    </div>
</template>

<script>
  import Cam from '@/components/Cam.vue'
  import axios from 'axios'
  import {b64ToBlob} from '../utils/ImageUtils'
  export default {
    name: 'login',
    components: {
      Cam
    },
    data () {
      return {
        step: 1,
        photo: undefined,
        retake: false,
        wait_info: 'Please wait'
      }
    },
    methods: {
      take_photo () {
        this.retake = !this.retake
        this.photo = this.$refs.webcam && this.$refs.webcam.getPhoto()
      },
      do_login () {
        this.step += 1
        this.wait_info = 'Please wait'
        var self = this

        const blob = b64ToBlob(this.photo)
        axios.post('https://westus.api.cognitive.microsoft.com/face/v1.0/detect', blob,
          {
            headers: {
              'Content-Type': 'application/octet-stream',
              'Ocp-Apim-Subscription-Key': '5dfd7fe32c974d0191cba61db3024fb1'
            }
          }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.data.length === 0) {
              throw {code: 'no_face'}
            }
            const {faceId} = response.data[0]
            return axios.post('https://westus.api.cognitive.microsoft.com/face/v1.0/identify',
              {
                faceIds: [faceId],
                personGroupId: 1,
                confidenceThreshold: 0.85
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Ocp-Apim-Subscription-Key': '5dfd7fe32c974d0191cba61db3024fb1'
                }
              })
          } else {
            throw response.body
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            const candidates = response.data[0].candidates
            if (candidates.length === 0) {
              throw {code: 'no_candidate'}
            }
            const personId = candidates[0].personId
            return axios.get('https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/1/persons/' + personId,
              {
                headers: {
                  'Ocp-Apim-Subscription-Key': '5dfd7fe32c974d0191cba61db3024fb1'
                }
              })
          } else {
            const {error} = response.data
            if (error.code === 'PersonGroupNotTrained') {
              this.wait_info('Backend is processing faces, please wait and retry')
            }
          }
        }).catch(error => {
          if (error.code && error.code === 'no_face') {
            self.wait_info = 'No face detected, please refresh to retry'
          }
          if (error.code && error.code === 'no_candidate') {
            self.wait_info = 'User unrecognized, please retry or register'
          }
          if (error.response) {
            const content = error.response.data.error
            if (content.code === 'PersonGroupNotTrained') {
              this.wait_info = 'Backend is processing faces, please wait and retry'
              return axios.post('https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/1/train', null,
                {
                  headers: {
                    'Ocp-Apim-Subscription-Key': '5dfd7fe32c974d0191cba61db3024fb1'
                  }
                })
            }
          } else {
            console.log(error)
          }
        }).then(response => {
          if (response.status === 200) {
            const {name} = response.data
            this.wait_info = 'Welcome, ' + name
            this.step += 1
          } else {
            throw response.data
          }
        }).catch(error => {
          self.wait_info('Something went wrong... Please retry')
          console.log(error)
        })
      },
      supported () {
        return this.$refs.webcam && this.$refs.webcam.checkSupported()
      }
    },
    computed: {
      take_or_retake () {
        return this.retake ? 'Retake' : 'Take Photo'
      }
    }
  }
</script>

<style scoped>
    #take_button {
        margin-top: 20px;
    }

    #login_button {
        margin-top: 20px;
        margin-left: 20px
    }

    h3 {
        margin-top: 50px;
        font-size: x-large;
        font-weight: normal;
    }
</style>
