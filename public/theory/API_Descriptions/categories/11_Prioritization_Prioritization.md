# Prioritization APIs
**Category**: Prioritization
**Total Endpoints**: 28
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Prioritization API provides comprehensive functionality for managing and analyzing prioritization within the NER11 Gold cybersecurity platform.

## Endpoints (28 total)

### GET Requests (19 endpoints)

#### `GET /api/v2/prioritization/dashboard/backlog`
**Summary**: Get Backlog Analysis

**Description**: Get backlog analysis with aging buckets.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/dashboard/backlog
```

#### `GET /api/v2/prioritization/dashboard/distribution`
**Summary**: Get Priority Distribution

**Description**: Get NOW/NEXT/NEVER distribution.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/dashboard/distribution
```

#### `GET /api/v2/prioritization/dashboard/efficiency`
**Summary**: Get Remediation Efficiency

**Description**: Get remediation efficiency metrics.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/dashboard/efficiency
```

#### `GET /api/v2/prioritization/dashboard/executive`
**Summary**: Get Executive View

**Description**: Get executive prioritization dashboard view.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/dashboard/executive
```

#### `GET /api/v2/prioritization/dashboard/summary`
**Summary**: Get Dashboard Summary

**Description**: Get comprehensive prioritization dashboard summary.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/dashboard/summary
```

#### `GET /api/v2/prioritization/dashboard/trends`
**Summary**: Get Priority Trends

**Description**: Get priority trends over time.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/dashboard/trends
```

#### `GET /api/v2/prioritization/never/items`
**Summary**: Get Never Items

**Description**: Get all items designated as NEVER priority.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/never/items
```

#### `GET /api/v2/prioritization/never/summary`
**Summary**: Get Never Summary

**Description**: Get NEVER category summary.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/never/summary
```

#### `GET /api/v2/prioritization/next/items`
**Summary**: Get Next Items

**Description**: Get all items scheduled for next action cycle.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/next/items
```

#### `GET /api/v2/prioritization/next/queue`
**Summary**: Get Next Queue

**Description**: Get ordered NEXT queue by priority score.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/next/queue
```

#### `GET /api/v2/prioritization/next/summary`
**Summary**: Get Next Summary

**Description**: Get NEXT category summary.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/next/summary
```

#### `GET /api/v2/prioritization/next/{item_id}/details`
**Summary**: Get Next Item Details

**Description**: Get detailed NEXT item information with scheduling.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/next/{item_id}/details
```

#### `GET /api/v2/prioritization/now/items`
**Summary**: Get Now Items

**Description**: Get all items requiring immediate action (NOW category).

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/now/items
```

#### `GET /api/v2/prioritization/now/sla-status`
**Summary**: Get Now Sla Status

**Description**: Get NOW items by SLA status.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/now/sla-status
```

#### `GET /api/v2/prioritization/now/summary`
**Summary**: Get Now Summary

**Description**: Get NOW category summary with SLA metrics.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/now/summary
```

#### `GET /api/v2/prioritization/now/{item_id}/details`
**Summary**: Get Now Item Details

**Description**: Get detailed item information with urgency factors.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/now/{item_id}/details
```

#### `GET /api/v2/prioritization/score/factors`
**Summary**: List Scoring Factors

**Description**: List all available scoring factors and their weights.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/score/factors
```

#### `GET /api/v2/prioritization/score/thresholds`
**Summary**: Get Priority Thresholds

**Description**: Get priority thresholds configuration.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/score/thresholds
```

#### `GET /api/v2/prioritization/score/{entity_id}/breakdown`
**Summary**: Get Score Breakdown

**Description**: Get priority score breakdown by factors.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/prioritization/score/{entity_id}/breakdown
```

### POST Requests (9 endpoints)

#### `POST /api/v2/prioritization/never/classify`
**Summary**: Classify As Never

**Description**: Classify item as NEVER priority.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/prioritization/never/classify \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/prioritization/never/reconsider`
**Summary**: Reconsider Never Item

**Description**: Move NEVER item for reconsideration (promotes to NEXT).

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/prioritization/never/reconsider \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/prioritization/next/promote`
**Summary**: Promote Next To Now

**Description**: Promote NEXT item to NOW priority.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/prioritization/next/promote \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/prioritization/next/schedule`
**Summary**: Schedule For Next

**Description**: Schedule item for NEXT priority.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/prioritization/next/schedule \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/prioritization/now/complete`
**Summary**: Complete Now Item

**Description**: Mark NOW item as complete (archives it).

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/prioritization/now/complete \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/prioritization/now/escalate`
**Summary**: Escalate To Now

**Description**: Escalate item to NOW priority.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/prioritization/now/escalate \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/prioritization/score/batch`
**Summary**: Batch Priority Calculation

**Description**: Batch priority calculation for multiple entities.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/prioritization/score/batch \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/prioritization/score/calculate`
**Summary**: Calculate Priority Score

**Description**: Calculate priority score for entity.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/prioritization/score/calculate \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/prioritization/score/weights`
**Summary**: Configure Scoring Weights

**Description**: Configure scoring weights for customer.

Requires ADMIN access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/prioritization/score/weights \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

