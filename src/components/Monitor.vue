<script lang="ts" setup>
import { store } from '../store'
import { isDesktop, formatTime, formatFullTime } from '@/functions/utility'
import { useSessionStorage } from '@vueuse/core'
import { getDatabase, set, ref as fb_ref, get, Database, DatabaseReference } from 'firebase/database'

let db: Database = getDatabase()
let dbRef: DatabaseReference

const chartOption = (min: Number, max: Number) => {
  return {
    responsive: false,
    maintainAspectRatio: true,
    scales: {
      y: {
        min: min,
        max: max
      }
    }
  }
}

const table_width = isDesktop() ? "400px" : "330px"
const table_color = "#1e1e1e"

const pinia = store()
const time = ref('')
const full_time = ref('')
const checkSensor = ref()
const sensorStatus = useSessionStorage('sensorStatus', false)
const localIP = ref('')
const currentTemp = ref(0)
const currentHumidity = ref(0)
const totalChickens = ref(0);
const totalPigs = ref(0);
const deceasedChickens = ref(0);
const deceasedPigs = ref(0);
const soldChicken = ref(0);
const soldPigs = ref(0);
const timeList = ref()
const tempList = ref()
const humidityList = ref()
const chartReady = ref(false)

const updateData = () => {
  if (Object.keys(pinia.data).length > 0) {
    if (chartReady.value === false) {
      chartReady.value = true
    }
    time.value = formatTime(pinia.data.uptime)
    full_time.value = formatFullTime(pinia.data.uptime)
    localIP.value = pinia.data.localip
    totalChickens.value = pinia.data.num_chickens
    totalPigs.value = pinia.data.num_pigs
    const log: any = Object.values(pinia.data.log).slice(-1)[0]
    currentTemp.value = log.temp
    currentHumidity.value = log?.humidity
    deceasedChickens.value = log?.deceased_chicken
    deceasedPigs.value = log?.decereased_pigs
    soldChicken.value = log?.sold_chicken
    soldPigs.value = log?.sold_pigs
    timeList.value = Object.values(pinia.data.log).map((log: any) => {
      const d = new Date(log.ts * 1000)
      return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    }).slice(-6)
    tempList.value = Object.values(pinia.data.log).map((log: any) => log.temp).slice(-6)
    humidityList.value = Object.values(pinia.data.log).map((log: any) => log.humidity).slice(-6)
  }
}
updateData()

const checkSensorCallback = (time: number) => {
  // console.log("CHECK SENSOR START")
  const lastUpdateTime = ref(time)
  const missedCount = ref(0)

  const intervalID = setInterval(() => {
    if (pinia.data.uptime <= lastUpdateTime.value) {
      // console.log("Missed update, retrying...")
      missedCount.value += 1
    } else {
      // console.log("Checking sensor status")
      missedCount.value = 0
      sensorStatus.value = true
    }
    if (missedCount.value > pinia.data.retry_value) {
      sensorStatus.value = false
    }
    lastUpdateTime.value = pinia.data.uptime
  }, pinia.data.logging_interval * 1000 + 1000)

  const clearCheckTime = () => {
    clearInterval(intervalID)
  }

  return { clearCheckTime }
}

checkSensor.value = checkSensorCallback(pinia.data.uptime)

watch(() => pinia.data, () => {
  updateData()
})

watch([() => pinia.data.logging_interval, () => pinia.data.retry_value], () => {
  console.log("RESET CHECK SENSOR")
  checkSensor.value.clearCheckTime()
  checkSensor.value = checkSensorCallback(pinia.data.uptime)
})

watch(() => pinia.data.heating, () => {
  dbRef = fb_ref(db, `${pinia.user.email.replace('.', '')}/heating`)
  set(dbRef, pinia.data.heating)
})

watch(() => pinia.data.cooling, () => {
  dbRef = fb_ref(db, `${pinia.user.email.replace('.', '')}/cooling`)
  set(dbRef, pinia.data.cooling)
})

onUnmounted(() => {
  checkSensor.value.clearCheckTime()
})
</script>

<template>
  <cDiv>
    <ion-card>
      <ion-card-header>
        <ion-card-title>
          <div class="flex justify-between mt-[-15px]">
            <h3>
              Monitor
              <ion-chip v-if="localIP" :color="sensorStatus ? 'primary' : 'medium'">
                <span class="mr-1">
                  {{ localIP }}
                </span>
              </ion-chip>
              <ion-chip v-else color="danger">unknown</ion-chip>
            </h3>
            <ion-label class="relative">
              <ion-badge class="uptime" v-if="sensorStatus">
                UpTime: {{ pinia.uptimeFormat ? full_time : time }}
              </ion-badge>
              <ion-badge class="uptime" v-else color="danger">Offline</ion-badge>
            </ion-label>
          </div>
        </ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <table class="styled-table">
          <thead>
            <tr>
              <th>Sensors</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <ion-label>Humidity: {{ currentHumidity }}%</ion-label>
                <Chart class="mt-4" v-if="chartReady" :chartData="{
                  labels: timeList,
                  datasets: [
                    {
                      data: humidityList,
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1
                    }
                  ]
                }" :options="chartOption(50, 100)" />
              </td>
            </tr>
            <tr>
              <td>
                Temperature: {{ currentTemp }}&deg;C
                <Chart class="mt-4" v-if="chartReady" :chartData="{
                  labels: timeList,
                  datasets: [
                    {
                      data: tempList,
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1
                    }
                  ]
                }" :options="chartOption(20, 45)" />
              </td>
            </tr>
          </tbody>
        </table>
        <br>
        <br>
        <cDiv>
          <table class="styled-table">
            <thead>
              <th>Animals</th>
              <th>Number in Farm</th>
            </thead>
            <tbody>
              <tr>
                <td>Total Chickens</td>
                <td>
                  <ion-input class="ion-text-center" type="number" v-model="totalChickens" />
                </td>
              </tr>
              <tr>
                <td>Total Pigs</td>
                <td>
                  <ion-input class="ion-text-center" type="number" v-model="totalPigs"></ion-input>
                </td>
              </tr>
            </tbody>
          </table>
        </cDiv>
        <br>
        <br>
        <cDiv>
          <table class="styled-table">
            <thead>
              <tr>
                <th>System(s)</th>
                <th>Toggle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Heating</td>
                <td><ion-toggle :enable-on-off-labels="true" v-model="pinia.data.heating"></ion-toggle>
                </td>
              </tr>
              <tr>
                <td>Cooling</td>
                <td><ion-toggle :enable-on-off-labels="true" v-model="pinia.data.cooling"></ion-toggle>
                </td>
              </tr>
            </tbody>
          </table>
        </cDiv>
      </ion-card-content>
    </ion-card>
  </cDiv>
  <!-- <cDiv class="m-5" v-for="(conf, index) in config" :key="chartKeys[index]">
                                                                                              <Chart :config="conf" />
                                                                                            </cDiv> -->
</template>

<style scoped>
ion-input {
  .text-input {
    text-align: center;
  }
}

.uptime {
  top: 50%;
  transform: translateY(-50%);
  position: relative;
  margin-top: 0.125rem;
  padding: 0.35rem 0.45rem;
}

@media (prefers-color-scheme: light) {
  .styled-table {
    background-color: #ffffff;
    color: black;
  }
}

@media (prefers-color-scheme: dark) {
  .styled-table {
    background-color: #1b1b1b;
    color: white;
  }
}

.styled-table {
  border-collapse: collapse;
  font-size: 1.1em;
  font-family: sans-serif;
  min-width: v-bind(table_width);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.styled-table thead tr {
  background-color: v-bind(table_color);
  color: #ffffff;
  text-align: left;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid v-bind(table_color);
}
</style>