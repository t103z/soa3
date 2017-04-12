<template>
    <div id="reg_main">
        <h1>Register Your Account</h1>
        <h3 id="step" v-if="step < 3">{{'#Step ' + step}}</h3>
        <h3 v-if="step === 3" id="wait_header">{{wait_info}}</h3>
        <div v-if="step===1">
            <b-form-fieldset
                    :state="warn_state"
                    :feedback="feedback">
                <b-form-input v-on:keyup.enter="submit_username"
                              placeholder="Enter your user name"
                              size="lg"
                              v-model="username"
                ></b-form-input>
            </b-form-fieldset>
        </div>


        <div v-if="step===2">
            <cam v-if="!retake" ref="webcam"></cam>
            <img v-if="retake" :src="photo" alt=""/>
            <br>
            <b-button id="take_button" variant="primary" @click="take_photo">{{take_or_retake}}</b-button>
            <br>
            <br>

        </div>

        <div v-if="step===4">
            <h3 id="success_header">Register Successful</h3>
            <b-button to="/login" variant="outline-success">Login</b-button>
        </div>

        <b-button id="next_button" v-if="step<3" variant="outline-success" :disabled="!allow_next" @click="next_step">Next</b-button>
        <b-button v-if="step>=2&&step<4" id="prev_button" @click="step-=1">Back</b-button>
    </div>
</template>

<script>
  import Cam from '@/components/Cam.vue'
  import axios from 'axios'
  import {b64ToBlob} from '../utils/ImageUtils'
  export default {
    name: 'reg',
    data () {
      return {
        photo: null,
        step: 1,
        username: '',
        retake: false,
        wait_info: 'Please wait'
      }
    },
    computed: {
      warn_state () {
        if (!this.username || this.username.length === 0) {
          return ''
        }
        if (this.username.match(/^[a-zA-Z0-9_-]*$/) && this.username.length < 64) {
          return 'success'
        } else {
          return 'danger'
        }
      },
      allow_next () {
        if (this.step === 1) {
          return this.warn_state === 'success'
        } else if (this.step === 2) {
          return this.photo !== null
        }
      },
      feedback () {
        if (!this.username.length >= 64) {
          return 'User name too long'
        } else if (!this.username.match(/^[a-zA-Z0-9_-]*$/)) {
          return 'User name should contain only English characters, numbers, \'-\', or \'_\''
        } else {
          return null
        }
      },
      take_or_retake () {
        return this.retake ? 're-take' : 'take photo'
      }
    },
    components: {
      Cam
    },
    http: {
      root: 'https://westus.api.cognitive.microsoft.com/face/v1.0'
    },
    methods: {
      take_photo () {
        this.retake = !this.retake
        this.photo = this.$refs.webcam && this.$refs.webcam.getPhoto()
      },
      submit_username () {
        if (this.warn_state !== 'success') {
          return
        } else {
          this.step += 1
        }
      },
      next_step () {
        if (!this.allow_next) {
          return
        }
        this.step += 1
        if (this.step === 3) {
          this.wait_info = 'Please wait'
          let personId
          this.$http.post('persongroups/1/persons',
            {
              'name': this.username
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': '5dfd7fe32c974d0191cba61db3024fb1'
              }
            }).then(response => {
            if (response.status === 200) {
              console.log(response.body)
              personId = response.body.personId
              const blob = b64ToBlob(this.photo)
              return axios.post('https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/1/persons/' + personId + '/persistedFaces',
              blob, {
                    headers: {
                      'Content-Type': 'application/octet-stream',
                      'Ocp-Apim-Subscription-Key': '5dfd7fe32c974d0191cba61db3024fb1'
                    }
                })
            } else {
              throw response.body
            }
          }).then(response => {
            console.log(response)
            if (response.status === 200) {
              this.step += 1
              return axios.post('https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/1/train', null,
                {
                  headers: {
                    'Ocp-Apim-Subscription-Key': '5dfd7fe32c974d0191cba61db3024fb1'
                  }
                })
            } else {
              throw response.body
            }
          }).catch(error => {
            console.log(error)
            this.wait_info = 'Request error, please retry'
          })
        }
      }
    }
  }
</script>

<style scoped>
    #step {
        font-size: xx-large;
        font-weight: normal;
        font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
        margin-top: 15px;
    }

    #reg_main {
        width: 75%;
        margin: 0 auto;
        margin-top: 30px;
    }

    #next_button {
        float: right;
    }

    #prev_button {
        float: left;
    }

    #take_button {
        margin-top: 20px;
    }

    #success_header {
        margin-top: 50px;
        font-size: x-large;
        font-weight: normal;
    }

    #wait_header {
        margin-top: 50px;
        font-size: x-large;
        font-weight: normal;
    }
</style>
