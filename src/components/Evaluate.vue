<template>
    <div>
        <h1>Evaluate Your Used Car Price</h1>
        <div id="car_form">
            <b-form-fieldset label="Brand" :state="validate_selection(brand)">
                <b-form-select :options="options_brand" v-model="brand"></b-form-select>
                <b-button id="default_button" size="sm" @click="fill_default">fill in default</b-button>
            </b-form-fieldset>
            <b-form-fieldset label="Body Style" :state="validate_selection(body_style)">
                <b-form-select :options="options_body_style" v-model="body_style"></b-form-select>
            </b-form-fieldset>
            <b-form-fieldset label="Fuel System" :state="validate_selection(fuel_system)">
                <b-form-select :options="options_fuel" v-model="fuel_system"></b-form-select>
            </b-form-fieldset>
            <b-form-fieldset label="Peak RPM" :state="validate_number(peak_rpm)">
                <b-form-input placeholder="typical 4000-7000" v-model="peak_rpm"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="Highway MPG" :state="validate_number(highway_mpg)">
                <b-form-input placeholder="typical 10-60" v-model="highway_mpg"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="Horse Power" :state="validate_number(horse_power)">
                <b-form-input placeholder="typical 40-270" v-model="horse_power"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="Wheel Base" :state="validate_number(wheel_base)">
                <b-form-input placeholder="typical 85-125" v-model="wheel_base"></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset label="Engine Size" :state="validate_number(engine_size)">
                <b-form-input placeholder="typical 50-350" v-model="engine_size"></b-form-input>
            </b-form-fieldset>
        </div>
        <h5>{{price_string}}</h5>
        <br>
        <b-button id="submit_button" variant="primary" :disabled="validate_all" @click="submit">Submit</b-button>
    </div>
</template>

<script>
    export default {
      name: 'evaluate',
      data () {
        return {
          querying: false,
          price: undefined,
          brand: null,
          body_style: null,
          fuel_system: null,
          peak_rpm: undefined,
          highway_mpg: undefined,
          horse_power: undefined,
          wheel_base: undefined,
          engine_size: undefined,
          options_fuel: [
            {
              text: 'Please select fuel system type',
              value: null
            },
            {
              text: 'MPFi',
              value: 'mpfi'
            },
            {
              text: '1bbl',
              value: '1bbl'
            },
            {
              text: '2bbl',
              value: '2bbl'
            },
            {
              text: 'IDI',
              value: 'idi'
            },
            {
              text: 'SPDi',
              value: 'spdi'
            }
          ],
          options_body_style: [
            {
              text: 'Please select car body style',
              value: null
            },
            {
              text: 'Convertible',
              value: 'convertible'
            },
            {
              text: 'Hard Top',
              value: 'hardtop'
            },
            {
              text: 'Hatchback',
              value: 'hatchback'
            },
            {
              text: 'Sedan',
              value: 'sedan'
            },
            {
              text: 'Wagon',
              value: 'wagon'
            }
          ],
          options_brand: [
            {
              text: 'Please select your car brand',
              value: null
            },
            {
              text: 'Alfa Romeo',
              value: 'alfa-romero'
            },
            {
              text: 'Audi',
              value: 'audi'
            },
            {
              text: 'BMW',
              value: 'bmw'
            },
            {
              text: 'Chevrolet',
              value: 'chevrolet'
            },
            {
              text: 'Dodge',
              value: 'dodge'
            },
            {
              text: 'Honda',
              value: 'honda'
            },
            {
              text: 'Isuzu',
              value: 'isuzu'
            },
            {
              text: 'Jaguar',
              value: 'jaguar'
            },
            {
              text: 'Mazda',
              value: 'mazda'
            },
            {
              text: 'Mercedes-Benz',
              value: 'mercedes-benz'
            },
            {
              text: 'Mercury',
              value: 'mercury'
            },
            {
              text: 'Mitsubishi',
              value: 'mitsubishi'
            },
            {
              text: 'Nissan',
              value: 'nissan'
            },
            {
              text: 'Peugot',
              value: 'peugot'
            },
            {
              text: 'Plymouth',
              value: 'plymouth'
            },
            {
              text: 'Porsche',
              value: 'porsche'
            },
            {
              text: 'Saab',
              value: 'saab'
            },
            {
              text: 'Subaru',
              value: 'subaru'
            },
            {
              text: 'Volkswagen',
              value: 'volkswagen'
            },
            {
              text: 'Volvo',
              value: 'volvo'
            }
          ]
        }
      },
      http: {
        root: 'https://soaapiproxy.azure-api.net/azureml',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': '4c87758ad0584b3b99000f64066e56cd',
          'Authorization': 'Bearer rTigTFwvPsqBNGsCqMZGANeu/3rB9qcZYL72evYYjZhfnXD86nP+barWisS4fRAzczxr0gUnRC4swKCy1gKh9g=='
        }
      },
      methods: {
        validate_number (field) {
          if (field === undefined || field.length === 0) {
            return ''
          }
          return !isNaN(field) ? 'success' : 'danger'
        },
        validate_selection (field) {
          if (field === undefined || field === null) {
            return ''
          }
          return 'success'
        },
        fill_default () {
          this.brand = 'bmw'
          this.body_style = 'sedan'
          this.fuel_system = 'mpfi'
          this.peak_rpm = 6000
          this.highway_mpg = 30
          this.horse_power = 200
          this.wheel_base = 90
          this.engine_size = 280
        },
        submit () {
          if (this.validate_all) {
            return
          }
          this.querying = true
          this.$http.post('execute?api-version=2.0&format=swagger', {
            Inputs: {
              car: [
                {
                  'make': this.brand,
                  'body-style': this.body_style,
                  'wheel-base': this.wheel_base,
                  'engine-size': this.engine_size,
                  'fuel-system': this.fuel_system,
                  'horsepower': this.horse_power,
                  'peak-rpm': this.peak_rpm,
                  'highway-mpg': this.highway_mpg
                }
              ]
            },
            GlobalParameters: {}
          }).then(response => {
            this.querying = false
            if (response.status === 200) {
              this.price = response.body.Results.evaluation[0]['Scored Label Mean']
            } else {
              throw response.body
            }
          }).catch(error => {
            this.querying = false
            console.log(error)
          })
        }
      },
      computed: {
        validate_all () {
          return this.validate_number(this.peak_rpm) !== 'success' ||
              this.validate_number(this.highway_mpg) !== 'success' ||
              this.validate_number(this.horse_power) !== 'success' ||
              this.validate_number(this.wheel_base) !== 'success' ||
              this.validate_number(this.engine_size) !== 'success' ||
              this.validate_selection(this.body_style) !== 'success' ||
              this.validate_selection(this.fuel_system) !== 'success' ||
              this.validate_selection(this.brand) !== 'success'
        },
        price_string () {
          if (this.querying) {
            return 'Please Wait'
          } else {
            return this.price && 'Your car is worth $ ' + Number(this.price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
          }
        }
      }
    }
</script>

<style scoped>
    #car_form {
        width: 50%;
        margin: 0 auto;
        text-align: left;
    }
    #submit_button {
        margin: 0 auto;
    }
    #default_button {
        float: right;
    }
</style>
