# Remediation APIs
**Category**: Remediation
**Total Endpoints**: 29
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Remediation API provides comprehensive functionality for managing and analyzing remediation within the NER11 Gold cybersecurity platform.

## Endpoints (29 total)

### GET Requests (22 endpoints)

#### `GET /api/v2/remediation/dashboard/summary`
**Summary**: Get Dashboard Summary

**Description**: Get remediation dashboard summary.

Returns comprehensive dashboard data for remediation overview.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/dashboard/summary
```

#### `GET /api/v2/remediation/dashboard/workload`
**Summary**: Get Workload Distribution

**Description**: Get team workload distribution.

Returns task distribution by assignee and team.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/dashboard/workload
```

#### `GET /api/v2/remediation/metrics/backlog`
**Summary**: Get Backlog Metrics

**Description**: Get vulnerability backlog metrics.

Returns backlog size and trend.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/metrics/backlog
```

#### `GET /api/v2/remediation/metrics/mttr`
**Summary**: Get Mttr By Severity

**Description**: Get Mean Time To Remediate by severity.

Returns average remediation time for each severity level.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/metrics/mttr
```

#### `GET /api/v2/remediation/metrics/sla-compliance`
**Summary**: Get Sla Compliance

**Description**: Get SLA compliance rate.

Returns percentage of tasks completed within SLA.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/metrics/sla-compliance
```

#### `GET /api/v2/remediation/metrics/summary`
**Summary**: Get Metrics Summary

**Description**: Get remediation metrics summary.

Returns overall remediation performance metrics.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/metrics/summary
```

#### `GET /api/v2/remediation/metrics/trends`
**Summary**: Get Remediation Trends

**Description**: Get remediation trends over time.

Returns time-series metrics for the specified period.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/metrics/trends
```

#### `GET /api/v2/remediation/plans`
**Summary**: List Plans

**Description**: List all remediation plans.

Returns plans with optional status filter.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/plans
```

#### `GET /api/v2/remediation/plans/active`
**Summary**: Get Active Plans

**Description**: Get active remediation plans.

Returns plans with status ACTIVE.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/plans/active
```

#### `GET /api/v2/remediation/plans/{plan_id}`
**Summary**: Get Plan

**Description**: Get plan details by ID.

Returns detailed information about a remediation plan.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/plans/{plan_id}
```

#### `GET /api/v2/remediation/plans/{plan_id}/progress`
**Summary**: Get Plan Progress

**Description**: Get plan progress metrics.

Returns completion percentage and task status breakdown.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/plans/{plan_id}/progress
```

#### `GET /api/v2/remediation/sla/at-risk`
**Summary**: Get At Risk Tasks

**Description**: Get tasks at risk of SLA breach.

Returns tasks with less than 20% time remaining.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/sla/at-risk
```

#### `GET /api/v2/remediation/sla/breaches`
**Summary**: Get Sla Breaches

**Description**: Get SLA breaches.

Returns tasks that have breached SLA deadlines.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/sla/breaches
```

#### `GET /api/v2/remediation/sla/policies`
**Summary**: List Sla Policies

**Description**: List SLA policies.

Returns all SLA policies for the customer.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/sla/policies
```

#### `GET /api/v2/remediation/sla/policies/{policy_id}`
**Summary**: Get Sla Policy

**Description**: Get SLA policy by ID.

Returns detailed SLA policy configuration.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/sla/policies/{policy_id}
```

#### `GET /api/v2/remediation/tasks/by-priority/{priority}`
**Summary**: Get Tasks By Priority

**Description**: Get tasks by priority level.

Returns all tasks with the specified priority (critical, high, medium, low, emergency).

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/tasks/by-priority/{priority}
```

#### `GET /api/v2/remediation/tasks/by-status/{status}`
**Summary**: Get Tasks By Status

**Description**: Get tasks by status.

Returns all tasks with the specified status.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/tasks/by-status/{status}
```

#### `GET /api/v2/remediation/tasks/open`
**Summary**: Get Open Tasks

**Description**: Get all open tasks.

Returns tasks that are not completed (open, in_progress, pending_verification).

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/tasks/open
```

#### `GET /api/v2/remediation/tasks/overdue`
**Summary**: Get Overdue Tasks

**Description**: Get overdue tasks.

Returns tasks that have breached their SLA deadline.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/tasks/overdue
```

#### `GET /api/v2/remediation/tasks/search`
**Summary**: Search Tasks

**Description**: Search remediation tasks.

Search tasks with optional filters and semantic search.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/tasks/search
```

#### `GET /api/v2/remediation/tasks/{task_id}`
**Summary**: Get Task

**Description**: Get task details by ID.

Returns detailed information about a specific remediation task.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/tasks/{task_id}
```

#### `GET /api/v2/remediation/tasks/{task_id}/history`
**Summary**: Get Task History

**Description**: Get task action history.

Returns complete audit trail for a task.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/remediation/tasks/{task_id}/history
```

### POST Requests (3 endpoints)

#### `POST /api/v2/remediation/plans`
**Summary**: Create Plan

**Description**: Create a remediation plan.

Creates a plan to coordinate multiple remediation tasks.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/remediation/plans \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/remediation/sla/policies`
**Summary**: Create Sla Policy

**Description**: Create SLA policy.

Defines remediation SLA thresholds by severity.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/remediation/sla/policies \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/remediation/tasks`
**Summary**: Create Task

**Description**: Create a new remediation task.

Creates a remediation task for vulnerability remediation with SLA tracking.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/remediation/tasks \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

### PUT Requests (4 endpoints)

#### `PUT /api/v2/remediation/plans/{plan_id}/status`
**Summary**: Update Plan Status

**Description**: Update plan status.

Changes plan status (DRAFT, ACTIVE, COMPLETED, CANCELLED).

#### `PUT /api/v2/remediation/sla/policies/{policy_id}`
**Summary**: Update Sla Policy

**Description**: Update SLA policy.

Modifies SLA policy configuration.

#### `PUT /api/v2/remediation/tasks/{task_id}/assign`
**Summary**: Assign Task

**Description**: Assign task to user or team.

Updates task assignment with audit trail.

#### `PUT /api/v2/remediation/tasks/{task_id}/status`
**Summary**: Update Task Status

**Description**: Update task status.

Changes task status with audit trail recording.

