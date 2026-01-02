# Compliance APIs
**Category**: Compliance
**Total Endpoints**: 29
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Compliance API provides comprehensive functionality for managing and analyzing compliance within the NER11 Gold cybersecurity platform.

## Endpoints (29 total)

### GET Requests (15 endpoints)

#### `GET /api/v2/compliance/assessments`
**Summary**: List Assessments

**Description**: List assessments with optional filters.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/assessments
```

#### `GET /api/v2/compliance/assessments/by-framework/{framework}`
**Summary**: Get Assessments By Framework

**Description**: Get assessments for a specific framework.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/assessments/by-framework/{framework}
```

#### `GET /api/v2/compliance/assessments/{assessment_id}`
**Summary**: Get Assessment

**Description**: Get assessment by ID with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/assessments/{assessment_id}
```

#### `GET /api/v2/compliance/controls`
**Summary**: List Controls

**Description**: List controls with optional filters.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/controls
```

#### `GET /api/v2/compliance/controls/by-framework/{framework}`
**Summary**: Get Controls By Framework

**Description**: Get controls for a specific framework.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/controls/by-framework/{framework}
```

#### `GET /api/v2/compliance/controls/{control_id}`
**Summary**: Get Control

**Description**: Get control by ID with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/controls/{control_id}
```

#### `GET /api/v2/compliance/dashboard/posture`
**Summary**: Get Compliance Posture

**Description**: Get compliance posture analysis.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/dashboard/posture
```

#### `GET /api/v2/compliance/dashboard/summary`
**Summary**: Get Compliance Summary

**Description**: Get compliance dashboard summary.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/dashboard/summary
```

#### `GET /api/v2/compliance/evidence/by-control/{control_id}`
**Summary**: Get Evidence For Control

**Description**: Get evidence for a specific control.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/evidence/by-control/{control_id}
```

#### `GET /api/v2/compliance/evidence/{evidence_id}`
**Summary**: Get Evidence

**Description**: Get evidence by ID with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/evidence/{evidence_id}
```

#### `GET /api/v2/compliance/gaps`
**Summary**: List Gaps

**Description**: List gaps with optional filters.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/gaps
```

#### `GET /api/v2/compliance/gaps/by-framework/{framework}`
**Summary**: Get Gaps By Framework

**Description**: Get gaps for a specific framework.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/gaps/by-framework/{framework}
```

#### `GET /api/v2/compliance/mappings/between/{source}/{target}`
**Summary**: Get Cross Framework Mappings

**Description**: Get cross-framework mappings.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/mappings/between/{source}/{target}
```

#### `GET /api/v2/compliance/mappings/by-control/{control_id}`
**Summary**: Get Mappings For Control

**Description**: Get all mappings for a control.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/mappings/by-control/{control_id}
```

#### `GET /api/v2/compliance/mappings/{mapping_id}`
**Summary**: Get Mapping

**Description**: Get mapping by ID with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/compliance/mappings/{mapping_id}
```

### POST Requests (8 endpoints)

#### `POST /api/v2/compliance/assessments`
**Summary**: Create Assessment

**Description**: Create a new compliance assessment.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/compliance/assessments \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/compliance/assessments/{assessment_id}/complete`
**Summary**: Complete Assessment

**Description**: Mark an assessment as completed.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/compliance/assessments/{assessment_id}/complete \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/compliance/controls`
**Summary**: Create Control

**Description**: Create a new compliance control.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/compliance/controls \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/compliance/controls/search`
**Summary**: Search Controls Semantic

**Description**: Semantic search controls.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/compliance/controls/search \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/compliance/evidence`
**Summary**: Upload Evidence

**Description**: Upload compliance evidence.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/compliance/evidence \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/compliance/gaps`
**Summary**: Create Gap

**Description**: Create a new compliance gap.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/compliance/gaps \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/compliance/mappings`
**Summary**: Create Mapping

**Description**: Create a new framework mapping.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/compliance/mappings \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/compliance/mappings/auto-map`
**Summary**: Auto Generate Mappings

**Description**: Auto-generate framework mappings using semantic similarity.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/compliance/mappings/auto-map \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

### PUT Requests (3 endpoints)

#### `PUT /api/v2/compliance/assessments/{assessment_id}`
**Summary**: Update Assessment

**Description**: Update an existing assessment.

Requires WRITE access level.

#### `PUT /api/v2/compliance/controls/{control_id}`
**Summary**: Update Control

**Description**: Update an existing control.

Requires WRITE access level.

#### `PUT /api/v2/compliance/gaps/{gap_id}/remediate`
**Summary**: Update Gap Remediation

**Description**: Update gap remediation status.

Requires WRITE access level.

### DELETE Requests (3 endpoints)

#### `DELETE /api/v2/compliance/controls/{control_id}`
**Summary**: Delete Control

**Description**: Delete a control.

Requires WRITE access level.

#### `DELETE /api/v2/compliance/evidence/{evidence_id}`
**Summary**: Delete Evidence

**Description**: Delete evidence.

Requires WRITE access level.

#### `DELETE /api/v2/compliance/mappings/{mapping_id}`
**Summary**: Delete Mapping

**Description**: Delete mapping by ID with customer isolation.

