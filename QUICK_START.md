# 🎯 QUICK START REFERENCE

**Last Updated**: January 20, 2026  
**Ready to Deploy**: ✅ Yes  
**All Tests Passing**: ✅ Yes

---

## 🚀 30-SECOND SETUP

### Step 1: Install
```bash
npm install
# Already have all dependencies from package.json
```

### Step 2: Configure
Create `.env.local`:
```env
NEXT_PUBLIC_GEE_PROJECT_ID=blue-carbon-registry
NEXT_PUBLIC_GEE_API_KEY=your-api-key
NEXT_PUBLIC_MQTT_BROKER_URL=mqtt://localhost:1883
NEXT_PUBLIC_MQTT_USERNAME=user
NEXT_PUBLIC_MQTT_PASSWORD=pass
```

### Step 3: Run
```bash
npm run dev
# Open http://localhost:3000
```

### Step 4: View Dashboard
```
http://localhost:3000/dashboard
```

---

## 🎨 COMPONENT QUICK REFERENCE

### Main Dashboards

```tsx
// 1. Verification Pipeline (6 phases)
import { VerificationDashboard } from '@/components/verification-dashboard'
<VerificationDashboard projectId="my-project" />

// 2. Satellite Data (Earth observation)
import { SatelliteAnalysisViewer } from '@/components/satellite-analysis-viewer'
<SatelliteAnalysisViewer
  areaName="Sundarbans"
  north={22.5} south={22.0} east={88.5} west={88.0}
/>

// 3. Real-time Sensors (IoT monitoring)
import { SensorMonitoringDashboard } from '@/components/sensor-monitoring-dashboard'
<SensorMonitoringDashboard projectId="my-project" />

// 4. Analytics (trends & predictions)
import { AdvancedAnalyticsDashboard } from '@/components/analytics-dashboard'
<AdvancedAnalyticsDashboard projectId="my-project" />
```

### Card Components

```tsx
// Data Quality
import { DataQualityCard } from '@/components/dashboard-cards'
<DataQualityCard data={aggregatedData} />

// Anomaly Alerts
import { AnomalyAlertPanel } from '@/components/dashboard-cards'
<AnomalyAlertPanel anomalies={detectedAnomalies} />

// Verification Readiness
import { VerificationReadinessGauge } from '@/components/dashboard-cards'
<VerificationReadinessGauge readiness={readinessScore} />

// Carbon Sequestration
import { CarbonSequestrationDisplay } from '@/components/dashboard-cards'
<CarbonSequestrationDisplay data={carbonData} />

// Benefit Distribution
import { BenefitDistributionDisplay } from '@/components/dashboard-cards'
<BenefitDistributionDisplay creditsIssuable={1683} />

// Recommendations
import { RecommendationList } from '@/components/dashboard-cards'
<RecommendationList recommendations={recommendations} />

// Real-time Monitoring
import { RealTimeMonitoring } from '@/components/real-time-monitoring'
<RealTimeMonitoring transactionHash="0x..." />
```

---

## 📊 SERVICE QUICK REFERENCE

### Data Services

```typescript
// 1. Satellite Data Analysis
import { analyzeSatelliteImagery } from '@/lib/earth-engine-service'
const satellite = await analyzeSatelliteImagery({
  areaOfInterest: { north, south, east, west },
  startDate: '2024-01-01',
  endDate: '2025-01-20'
})

// 2. IoT Sensor Streaming
import { streamSensorData, getMqttSensorClient } from '@/lib/mqtt-sensor-service'
const client = getMqttSensorClient()
await client.connect()
const unsubscribe = await streamSensorData((reading) => {
  console.log(reading.summary.averageTemperature)
})

// 3. Complete Verification Pipeline
import { runCompleteVerificationPipeline } from '@/lib/verification-orchestrator'
const result = await runCompleteVerificationPipeline('project-id')

// 4. Smart Contract Verification
import { executeFullVerificationWorkflow } from '@/lib/smart-contract-verification'
const contract = await executeFullVerificationWorkflow(aggregatedData)
```

---

## 🔑 KEY FILES

### Core Services
```
lib/
├─ earth-engine-service.ts           (satellite data)
├─ mqtt-sensor-service.ts            (IoT sensors)
├─ verification-orchestrator.ts       (6-phase pipeline)
├─ smart-contract-verification.ts    (blockchain)
└─ data-aggregation-service.ts       (synthesis)
```

### Components
```
components/
├─ verification-dashboard.tsx         (main dashboard)
├─ satellite-analysis-viewer.tsx      (earth observation)
├─ sensor-monitoring-dashboard.tsx    (real-time sensors)
├─ dashboard-cards.tsx                (reusable cards)
└─ real-time-monitoring.tsx           (blockchain tracking)
```

### Documentation
```
├─ DASHBOARD_INTEGRATION_GUIDE.ts     (integration patterns)
├─ ADVANCED_FEATURES_INTEGRATION.md   (setup & config)
└─ SESSION_IMPLEMENTATION_SUMMARY.md  (this session)
```

---

## 📈 TYPICAL WORKFLOWS

### Workflow 1: Verify a Project
```typescript
// 1. Run verification
const result = await runCompleteVerificationPipeline('project-id')

// 2. Get results
const carbon = result.phases.dataAggregation.carbonSequestered
const credits = result.creditsIssuable
const ready = result.phases.dataAggregation.readinessForVerification.readyForVerification

// 3. Display
<VerificationDashboard projectId="project-id" />

// 4. Submit to blockchain (if ready)
if (ready) {
  const contract = await executeFullVerificationWorkflow(result.phases.dataAggregation)
}
```

### Workflow 2: Monitor Satellite Imagery
```typescript
// 1. Get satellite data
const satellite = await analyzeSatelliteImagery({
  areaOfInterest: { north: 22.5, south: 22.0, east: 88.5, west: 88.0 },
  startDate: '2024-01-01',
  endDate: '2025-01-20'
})

// 2. Check for deforestation
if (satellite.deforestation.areaDeforested > 0) {
  console.log('🚨 Deforestation detected!')
}

// 3. Display
<SatelliteAnalysisViewer areaName="Sundarbans" {...bounds} />
```

### Workflow 3: Stream Real-time Sensors
```typescript
// 1. Connect
const client = await initializeSensorNetwork()

// 2. Subscribe
await client.subscribe('sensors/+/data', (data) => {
  if (data.status === 'warning' || data.status === 'error') {
    console.log('🚨 Sensor alert:', data)
  }
})

// 3. Get aggregated readings
const readings = client.getAggregatedReadings()
console.log('Temp:', readings.summary.averageTemperature)
console.log('Alerts:', readings.summary.alertCount)

// 4. Display
<SensorMonitoringDashboard projectId="project-id" />
```

---

## ⚙️ CONFIGURATION

### Environment Variables
```env
# Earth Engine
NEXT_PUBLIC_GEE_PROJECT_ID=blue-carbon-registry
NEXT_PUBLIC_GEE_API_KEY=your-api-key

# MQTT
NEXT_PUBLIC_MQTT_BROKER_URL=mqtt://localhost:1883
NEXT_PUBLIC_MQTT_USERNAME=mqtt-user
NEXT_PUBLIC_MQTT_PASSWORD=mqtt-pass

# Smart Contracts (optional)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=https://rpc.mainnet.com
```

### Component Props

All components support:
- `projectId` - Project identifier
- `autoRefresh` - Enable auto-refresh (default: true)
- `refreshInterval` - Update interval in ms (default: varies)
- `onAnalysisComplete` - Callback on data load
- `onAnomalyDetected` - Callback on anomalies

---

## 🧪 TESTING

### Test Satellite Data
```bash
curl -X POST http://localhost:3000/api/earth-engine/vegetation-indices \
  -H "Content-Type: application/json" \
  -d '{
    "areaOfInterest": {"north": 22.5, "south": 22.0, "east": 88.5, "west": 88.0},
    "startDate": "2024-01-01",
    "endDate": "2025-01-20"
  }'
```

### Test MQTT
```bash
# Subscribe
mosquitto_sub -h localhost -t "sensors/+/data"

# Publish
mosquitto_pub -h localhost -t "sensors/001/data" \
  -m '{"id":"001","type":"temperature","value":25.5,"battery":85}'
```

### Test Verification
```typescript
import { runCompleteVerificationPipeline } from '@/lib/verification-orchestrator'

const result = await runCompleteVerificationPipeline('test-project')
console.log(result) // Complete 6-phase result
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Earth Engine 401 Unauthorized
**Fix**: Check API key and project ID in `.env.local`

### Issue: MQTT Connection Refused
**Fix**: Ensure MQTT broker running on configured host/port

### Issue: Satellite Data Returns Empty
**Fix**: Check date range and geographic bounds

### Issue: Sensors Not Updating
**Fix**: Check broker connection and topic names

### Issue: Performance Slow
**Fix**: Reduce `refreshInterval` or data range

---

## 📚 DOCUMENTATION LINKS

1. **Integration Guide**: `DASHBOARD_INTEGRATION_GUIDE.ts`
   - 5 usage patterns
   - Props reference
   - Code examples

2. **Advanced Features**: `ADVANCED_FEATURES_INTEGRATION.md`
   - Earth Engine setup
   - MQTT configuration
   - Deployment checklist

3. **Inline Comments**: Every function has JSDoc
   - Type definitions
   - Usage examples
   - Error scenarios

---

## ✅ VERIFICATION CHECKLIST

Before deploying:
- [ ] All environment variables set
- [ ] Earth Engine credentials working
- [ ] MQTT broker accessible
- [ ] Database connected
- [ ] Smart contracts deployed
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance metrics good

---

## 🎯 NEXT STEPS

1. **Configure credentials** (5 min)
   - Set Earth Engine API key
   - Configure MQTT broker
   - Update environment variables

2. **Deploy to staging** (15 min)
   - Run tests
   - Check dashboards
   - Verify data flows

3. **Go live** (1 hour)
   - Monitor metrics
   - Watch error logs
   - Track user feedback

4. **Iterate** (ongoing)
   - Add reporting features
   - Optimize performance
   - Gather feedback

---

## 📞 QUICK LINKS

| Resource | Location |
|----------|----------|
| **Main Dashboard** | `app/dashboard-example.tsx` |
| **Components** | `components/` directory |
| **Services** | `lib/` directory |
| **Examples** | Inline in files |
| **Guides** | `*.md` files |

---

**Status**: ✅ **READY TO DEPLOY**

Start building now! 🚀
