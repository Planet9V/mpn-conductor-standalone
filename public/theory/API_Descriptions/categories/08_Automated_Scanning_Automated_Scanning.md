# Automated Scanning APIs
**Category**: Automated Scanning
**Total Endpoints**: 30
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Automated Scanning API provides comprehensive functionality for managing and analyzing automated scanning within the NER11 Gold cybersecurity platform.

## Endpoints (30 total)

### GET Requests (14 endpoints)

#### `GET /api/v2/scanning/dashboard/summary`
**Summary**: Get Dashboard Summary

**Description**: Get comprehensive scanning dashboard summary

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/dashboard/summary
```

#### `GET /api/v2/scanning/findings`
**Summary**: List Findings

**Description**: List all findings with optional filters

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/findings
```

#### `GET /api/v2/scanning/findings/by-severity/{severity}`
**Summary**: Get Findings By Severity

**Description**: Get findings by severity level

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/findings/by-severity/{severity}
```

#### `GET /api/v2/scanning/findings/{finding_id}`
**Summary**: Get Finding

**Description**: Get finding by ID

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/findings/{finding_id}
```

#### `GET /api/v2/scanning/jobs`
**Summary**: List Scan Jobs

**Description**: List scan jobs with optional filters

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/jobs
```

#### `GET /api/v2/scanning/jobs/running`
**Summary**: List Running Jobs

**Description**: List all currently running scan jobs

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/jobs/running
```

#### `GET /api/v2/scanning/jobs/{job_id}`
**Summary**: Get Scan Job Status

**Description**: Get scan job status and details

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/jobs/{job_id}
```

#### `GET /api/v2/scanning/jobs/{job_id}/findings`
**Summary**: Get Job Findings

**Description**: Get all findings for a specific job

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/jobs/{job_id}/findings
```

#### `GET /api/v2/scanning/profiles`
**Summary**: List Scan Profiles

**Description**: List scan profiles with optional filters

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/profiles
```

#### `GET /api/v2/scanning/profiles/by-type/{scan_type}`
**Summary**: Get Profiles By Type

**Description**: Get all profiles of a specific scan type

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/profiles/by-type/{scan_type}
```

#### `GET /api/v2/scanning/profiles/{profile_id}`
**Summary**: Get Scan Profile

**Description**: Get scan profile by ID

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/profiles/{profile_id}
```

#### `GET /api/v2/scanning/schedules`
**Summary**: List Schedules

**Description**: List scan schedules with optional filters

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/schedules
```

#### `GET /api/v2/scanning/schedules/{schedule_id}`
**Summary**: Get Schedule

**Description**: Get schedule by ID

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/schedules/{schedule_id}
```

#### `GET /api/v2/scanning/targets`
**Summary**: List Targets

**Description**: List scan targets with optional filters

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/scanning/targets
```

### POST Requests (9 endpoints)

#### `POST /api/v2/scanning/findings/search`
**Summary**: Search Findings

**Description**: Search findings with advanced filters

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/scanning/findings/search \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/scanning/jobs`
**Summary**: Start Scan Job

**Description**: Start a new scan job

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/scanning/jobs \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/scanning/jobs/{job_id}/cancel`
**Summary**: Cancel Scan Job

**Description**: Cancel a running scan job

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/scanning/jobs/{job_id}/cancel \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/scanning/profiles`
**Summary**: Create Scan Profile

**Description**: Create a new scan profile

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/scanning/profiles \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/scanning/profiles/{profile_id}/clone`
**Summary**: Clone Scan Profile

**Description**: Clone an existing scan profile

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/scanning/profiles/{profile_id}/clone \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/scanning/schedules`
**Summary**: Create Schedule

**Description**: Create a new scan schedule

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/scanning/schedules \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/scanning/schedules/{schedule_id}/disable`
**Summary**: Disable Schedule

**Description**: Disable a scan schedule

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/scanning/schedules/{schedule_id}/disable \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/scanning/schedules/{schedule_id}/enable`
**Summary**: Enable Schedule

**Description**: Enable a scan schedule

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/scanning/schedules/{schedule_id}/enable \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/scanning/targets`
**Summary**: Create Target

**Description**: Create a new scan target

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/scanning/targets \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

### PUT Requests (4 endpoints)

#### `PUT /api/v2/scanning/findings/{finding_id}/status`
**Summary**: Update Finding Status

**Description**: Update finding status

#### `PUT /api/v2/scanning/profiles/{profile_id}`
**Summary**: Update Scan Profile

**Description**: Update scan profile

#### `PUT /api/v2/scanning/schedules/{schedule_id}`
**Summary**: Update Schedule

**Description**: Update scan schedule

#### `PUT /api/v2/scanning/targets/{target_id}`
**Summary**: Update Target

**Description**: Update scan target

### DELETE Requests (3 endpoints)

#### `DELETE /api/v2/scanning/profiles/{profile_id}`
**Summary**: Delete Scan Profile

**Description**: Delete scan profile

#### `DELETE /api/v2/scanning/schedules/{schedule_id}`
**Summary**: Delete Schedule

**Description**: Delete scan schedule

#### `DELETE /api/v2/scanning/targets/{target_id}`
**Summary**: Delete Target

**Description**: Delete scan target

