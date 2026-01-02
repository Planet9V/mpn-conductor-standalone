# Risk Scoring APIs
**Category**: Risk Scoring
**Total Endpoints**: 25
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Risk Scoring API provides comprehensive functionality for managing and analyzing risk scoring within the NER11 Gold cybersecurity platform.

## Endpoints (25 total)

### GET Requests (20 endpoints)

#### `GET /api/v2/economic-impact/value/risk-adjusted`
**Summary**: Get Risk Adjusted Value

**Description**: Get risk-adjusted business value

Adjusts business value based on risk exposure and vulnerability.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/value/risk-adjusted
```

#### `GET /api/v2/risk/aggregation/by-asset-type`
**Summary**: Get Risk By Asset Type

**Description**: Get risk aggregated by asset type.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/aggregation/by-asset-type
```

#### `GET /api/v2/risk/aggregation/by-sector`
**Summary**: Get Risk By Sector

**Description**: Get risk aggregated by sector.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/aggregation/by-sector
```

#### `GET /api/v2/risk/aggregation/by-vendor`
**Summary**: Get Risk By Vendor

**Description**: Get risk aggregated by vendor.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/aggregation/by-vendor
```

#### `GET /api/v2/risk/aggregation/{aggregation_type}/{group_id}`
**Summary**: Get Risk Aggregation

**Description**: Get specific risk aggregation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/aggregation/{aggregation_type}/{group_id}
```

#### `GET /api/v2/risk/assets/by-criticality/{level}`
**Summary**: Get Assets By Criticality

**Description**: Get assets by criticality level.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/assets/by-criticality/{level}
```

#### `GET /api/v2/risk/assets/criticality/summary`
**Summary**: Get Criticality Summary

**Description**: Get criticality distribution summary.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/assets/criticality/summary
```

#### `GET /api/v2/risk/assets/mission-critical`
**Summary**: Get Mission Critical Assets

**Description**: Get all mission-critical assets.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/assets/mission-critical
```

#### `GET /api/v2/risk/assets/{asset_id}/criticality`
**Summary**: Get Asset Criticality

**Description**: Get asset criticality rating with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/assets/{asset_id}/criticality
```

#### `GET /api/v2/risk/dashboard/risk-matrix`
**Summary**: Get Risk Matrix

**Description**: Get risk matrix data (likelihood vs impact).

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/dashboard/risk-matrix
```

#### `GET /api/v2/risk/dashboard/summary`
**Summary**: Get Dashboard Summary

**Description**: Get comprehensive risk dashboard summary.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/dashboard/summary
```

#### `GET /api/v2/risk/exposure/attack-surface`
**Summary**: Get Attack Surface Summary

**Description**: Get attack surface summary.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/exposure/attack-surface
```

#### `GET /api/v2/risk/exposure/high-exposure`
**Summary**: Get High Exposure Assets

**Description**: Get assets with high exposure scores.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/exposure/high-exposure
```

#### `GET /api/v2/risk/exposure/internet-facing`
**Summary**: Get Internet Facing Assets

**Description**: Get all internet-facing assets.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/exposure/internet-facing
```

#### `GET /api/v2/risk/exposure/{asset_id}`
**Summary**: Get Exposure Score

**Description**: Get asset exposure score with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/exposure/{asset_id}
```

#### `GET /api/v2/risk/scores/high-risk`
**Summary**: Get High Risk Entities

**Description**: Get all entities with high or critical risk scores.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/scores/high-risk
```

#### `GET /api/v2/risk/scores/history/{entity_type}/{entity_id}`
**Summary**: Get Risk History

**Description**: Get risk score history for entity.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/scores/history/{entity_type}/{entity_id}
```

#### `GET /api/v2/risk/scores/search`
**Summary**: Search Risk Scores

**Description**: Search risk scores with filters and customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/scores/search
```

#### `GET /api/v2/risk/scores/trending`
**Summary**: Get Trending Entities

**Description**: Get entities with specific risk trend.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/scores/trending
```

#### `GET /api/v2/risk/scores/{entity_type}/{entity_id}`
**Summary**: Get Risk Score

**Description**: Get most recent risk score for entity with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/risk/scores/{entity_type}/{entity_id}
```

### POST Requests (4 endpoints)

#### `POST /api/v2/risk/assets/criticality`
**Summary**: Set Asset Criticality

**Description**: Set asset criticality rating.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/risk/assets/criticality \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/risk/exposure`
**Summary**: Calculate Exposure Score

**Description**: Calculate exposure score for asset.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/risk/exposure \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/risk/scores`
**Summary**: Calculate Risk Score

**Description**: Calculate and store risk score for an entity.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/risk/scores \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/risk/scores/recalculate/{entity_type}/{entity_id}`
**Summary**: Recalculate Risk Score

**Description**: Force recalculation of risk score using existing factors.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/risk/scores/recalculate/{entity_type}/{entity_id} \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

### PUT Requests (1 endpoints)

#### `PUT /api/v2/risk/assets/{asset_id}/criticality`
**Summary**: Update Asset Criticality

**Description**: Update asset criticality rating.

Requires WRITE access level.

