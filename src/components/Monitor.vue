<script lang="ts" setup>
import { store } from '../store'
import { isDesktop, formatTime, formatFullTime } from '@/functions/utility'
import { useSessionStorage } from '@vueuse/core';

const table_width = isDesktop() ? "400px" : "330px"
const table_color = "#1e1e1e"

const props = defineProps({
  index: {
    type: Number,
    required: true
  }
})
const pinia = store()
const currentLight = ref()
const currentTemp = ref()
const currentHumidity = ref()
const currentPH = ref()
const time = ref('')
const full_time = ref('')
const checkSensor = ref()
const sensorStatus = useSessionStorage('sensorStatus' + String(props.index), false)
const localIP = ref('')

const updateData = (index: number) => {
  if (Object.keys(pinia.data[index]).length > 0) {
    currentLight.value = pinia.data[index].light['current']
    currentTemp.value = pinia.data[index].temperature['current']
    currentHumidity.value = pinia.data[index].humidity['current']
    currentPH.value = pinia.data[index].ph['current']
    time.value = formatTime(pinia.data[index].uptime)
    full_time.value = formatFullTime(pinia.data[index].uptime)
    localIP.value = pinia.data[index].localip
    // const keys = Object.keys(pinia.data).filter((key) => key !== 'logging_interval')
    // for (let i = 0; i < keys.length; i++) {
    //   config.value[i] = {
    //     type: 'line',
    //     data: {
    //       labels: Object.keys(pinia.data[keys[i]]).map(convertUnixToTime).slice(0, -1),
    //       datasets: [
    //         {
    //           label: keys[i],
    //           data: Object.values(pinia.data[keys[i]]).slice(0, -1),
    //           backgroundColor: 'rgba(255, 99, 132, 0.2)',
    //           borderColor: 'rgba(255, 99, 132, 1)',
    //           borderWidth: 1,
    //         },
    //       ],
    //     }
    //   }
    //   chartKeys.value[i] = -1 * chartKeys.value[i]
    // }
  }
}
updateData(props.index)

const checkSensorCallback = (time: number) => {
  // console.log("CHECK SENSOR START")
  const lastUpdateTime = ref(time)
  const missedCount = ref(0)

  const intervalID = setInterval(() => {
    if (pinia.data[props.index].uptime <= lastUpdateTime.value) {
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
    lastUpdateTime.value = pinia.data[props.index].uptime
  }, pinia.data.logging_interval * 1000 + 1000)

  const clearCheckTime = () => {
    clearInterval(intervalID)
  }

  return { clearCheckTime }
}

const updateFirmware = () => {
  if (sensorStatus.value) {
    window.open(`http://${pinia.data[props.index].localip}/update`, '_blank')
  }
}

checkSensor.value = checkSensorCallback(pinia.data[props.index].uptime)

watch(() => pinia.data, () => {
  updateData(props.index)
})

watch([() => pinia.data.logging_interval, () => pinia.data.retry_value], () => {
  console.log("RESET CHECK SENSOR")
  checkSensor.value.clearCheckTime()
  checkSensor.value = checkSensorCallback(pinia.data[props.index].uptime)
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
          <div class="flex justify-between mt-[-5px]">
            <h3>
              Monitor {{ props.index + 1 }}
              <ion-chip @click="updateFirmware" v-if="localIP" :color="sensorStatus ? 'primary' : 'medium'">
                <span class="mr-1">
                  {{ localIP }}
                </span>
                <ion-label>
                  <i-mdi:file-upload-outline />
                </ion-label>
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
              <th>Values</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>pH</td>
              <td>{{ currentPH }}</td>
            </tr>
            <tr>
              <td>Humidity</td>
              <td>{{ currentHumidity }}%</td>
            </tr>
            <tr>
              <td>Temperature</td>
              <td>{{ currentTemp }}&deg;C</td>
            </tr>
            <tr>
              <td>Light Intensity</td>
              <td>{{ Number(currentLight / 40.95).toFixed(2) }}%</td>
            </tr>
          </tbody>
        </table>
      </ion-card-content>
    </ion-card>
  </cDiv>
  <!-- <cDiv class="m-5" v-for="(conf, index) in config" :key="chartKeys[index]">
                                                                                              <Chart :config="conf" />
                                                                                            </cDiv> -->
</template>

<style scoped>
.uptime {
  top: 50%;
  transform: translateY(-50%);
  position: relative;
  margin-top: 0.125rem;
  padding: 0.35rem 0.45rem;
}

.ip {
  top: 50%;
  transform: translateY(-50%);
  position: relative;
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