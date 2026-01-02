# Economic Impact APIs
**Category**: Economic Impact
**Total Endpoints**: 25
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Economic Impact API provides comprehensive functionality for managing and analyzing economic impact within the NER11 Gold cybersecurity platform.

## Endpoints (25 total)

### GET Requests (19 endpoints)

#### `GET /api/v2/economic-impact/costs/by-category`
**Summary**: Get Costs By Category

**Description**: Get costs by category (equipment, personnel, downtime, etc.)

Groups all costs by category with detailed breakdown.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/costs/by-category
```

#### `GET /api/v2/economic-impact/costs/historical`
**Summary**: Get Historical Costs

**Description**: Get historical cost trends

Shows cost trends over time with direction and percentage change.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/costs/historical
```

#### `GET /api/v2/economic-impact/costs/summary`
**Summary**: Get Cost Summary

**Description**: Get cost summary dashboard

Shows total costs, breakdown by category, and trends for specified period.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/costs/summary
```

#### `GET /api/v2/economic-impact/costs/{entity_id}/breakdown`
**Summary**: Get Entity Cost Breakdown

**Description**: Get detailed cost breakdown for specific entity

Shows direct costs, indirect costs, and allocated overhead.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/costs/{entity_id}/breakdown
```

#### `GET /api/v2/economic-impact/dashboard/executive`
**Summary**: Get Executive Summary

**Description**: Get executive summary view

High-level summary for executive reporting and decision-making.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/dashboard/executive
```

#### `GET /api/v2/economic-impact/dashboard/kpis`
**Summary**: Get Dashboard Kpis

**Description**: Get key performance indicators

Critical KPIs for security investment performance.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/dashboard/kpis
```

#### `GET /api/v2/economic-impact/dashboard/summary`
**Summary**: Get Dashboard Summary

**Description**: Get economic dashboard summary

Comprehensive dashboard with all key economic metrics.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/dashboard/summary
```

#### `GET /api/v2/economic-impact/dashboard/trends`
**Summary**: Get Dashboard Trends

**Description**: Get economic trends over time

Time-series data for costs, ROI, value, and incident impacts.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/dashboard/trends
```

#### `GET /api/v2/economic-impact/health`
**Summary**: Health Check

**Description**: Health check endpoint

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/health
```

#### `GET /api/v2/economic-impact/impact/historical`
**Summary**: Get Historical Impacts

**Description**: Get historical impact data

Shows actual vs estimated costs from past incidents.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/impact/historical
```

#### `GET /api/v2/economic-impact/impact/scenarios`
**Summary**: List Impact Scenarios

**Description**: List available impact scenarios

Shows all defined impact scenarios with estimated costs.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/impact/scenarios
```

#### `GET /api/v2/economic-impact/impact/{scenario_id}/results`
**Summary**: Get Simulation Results

**Description**: Get simulation results for scenario

Retrieves detailed results from previous simulation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/impact/{scenario_id}/results
```

#### `GET /api/v2/economic-impact/roi/by-category`
**Summary**: Get Roi By Category

**Description**: Get ROI grouped by investment category

Shows average ROI for each investment type (security tools, infrastructure, etc.)

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/roi/by-category
```

#### `GET /api/v2/economic-impact/roi/projections`
**Summary**: Get Roi Projections

**Description**: Get future ROI projections

Projects future ROI with confidence intervals based on growth assumptions.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/roi/projections
```

#### `GET /api/v2/economic-impact/roi/summary`
**Summary**: Get Roi Summary

**Description**: Get ROI summary for all investments

Shows aggregated ROI metrics, best/worst performers, and category breakdown.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/roi/summary
```

#### `GET /api/v2/economic-impact/roi/{investment_id}`
**Summary**: Get Roi By Id

**Description**: Get ROI for specific investment

Returns detailed ROI calculation including NPV, IRR, and payback period.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/roi/{investment_id}
```

#### `GET /api/v2/economic-impact/value/by-sector`
**Summary**: Get Value By Sector

**Description**: Get value metrics by industry sector

Industry-specific value analysis with benchmarking.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/value/by-sector
```

#### `GET /api/v2/economic-impact/value/metrics`
**Summary**: Get Value Metrics

**Description**: Get business value metrics dashboard

Shows total asset value, critical assets, and value distribution.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/value/metrics
```

#### `GET /api/v2/economic-impact/value/{asset_id}/assessment`
**Summary**: Get Value Assessment

**Description**: Get value assessment for specific asset

Detailed business value calculation with confidence score.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/value/{asset_id}/assessment
```

### POST Requests (6 endpoints)

#### `POST /api/v2/economic-impact/costs/calculate`
**Summary**: Calculate Costs

**Description**: Calculate costs for scenario

Estimates direct, indirect, and opportunity costs for given scenario.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/economic-impact/costs/calculate \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/economic-impact/impact/model`
**Summary**: Model Impact

**Description**: Model financial impact of incident

Simulates financial impact of security incident with detailed breakdown.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/economic-impact/impact/model \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/economic-impact/impact/simulate`
**Summary**: Run Impact Simulation

**Description**: Run Monte Carlo impact simulation

Runs multiple simulations to establish confidence intervals.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/economic-impact/impact/simulate \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/economic-impact/roi/calculate`
**Summary**: Calculate Roi

**Description**: Calculate ROI for proposed investment

Calculates ROI percentage, NPV, IRR, and payback period for investment proposal.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/economic-impact/roi/calculate \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/economic-impact/roi/comparison`
**Summary**: Compare Investments

**Description**: Compare multiple investment options

Side-by-side comparison with ranking and recommendations.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/economic-impact/roi/comparison \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/economic-impact/value/calculate`
**Summary**: Calculate Business Value

**Description**: Calculate business value for entity

Calculates total business value from multiple factors.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/economic-impact/value/calculate \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

