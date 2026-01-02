# Alert Management APIs
**Category**: Alert Management
**Total Endpoints**: 34
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Alert Management API provides comprehensive functionality for managing and analyzing alert management within the NER11 Gold cybersecurity platform.

## Endpoints (34 total)

### GET Requests (15 endpoints)

#### `GET /api/v2/alerts`
**Summary**: List Alerts

**Description**: List alerts with optional filters.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts
```

#### `GET /api/v2/alerts/by-severity/{severity}`
**Summary**: Get Alerts By Severity

**Description**: Get alerts by severity level.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts/by-severity/{severity}
```

#### `GET /api/v2/alerts/by-status/{status}`
**Summary**: Get Alerts By Status

**Description**: Get alerts by status.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts/by-status/{status}
```

#### `GET /api/v2/alerts/correlations`
**Summary**: List Alert Correlations

**Description**: List alert correlations.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts/correlations
```

#### `GET /api/v2/alerts/correlations/{correlation_id}`
**Summary**: Get Alert Correlation

**Description**: Get alert correlation by ID.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts/correlations/{correlation_id}
```

#### `GET /api/v2/alerts/dashboard/summary`
**Summary**: Get Alert Summary

**Description**: Get alert dashboard summary.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts/dashboard/summary
```

#### `GET /api/v2/alerts/escalations`
**Summary**: List Escalation Policies

**Description**: List escalation policies.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts/escalations
```

#### `GET /api/v2/alerts/escalations/{policy_id}`
**Summary**: Get Escalation Policy

**Description**: Get escalation policy by ID.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts/escalations/{policy_id}
```

#### `GET /api/v2/alerts/notifications`
**Summary**: List Notification Rules

**Description**: List notification rules.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts/notifications
```

#### `GET /api/v2/alerts/notifications/{notification_id}`
**Summary**: Get Notification Rule

**Description**: Get notification rule by ID.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts/notifications/{notification_id}
```

#### `GET /api/v2/alerts/rules`
**Summary**: List Alert Rules

**Description**: List alert rules.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts/rules
```

#### `GET /api/v2/alerts/rules/{rule_id}`
**Summary**: Get Alert Rule

**Description**: Get alert rule by ID.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts/rules/{rule_id}
```

#### `GET /api/v2/alerts/{alert_id}`
**Summary**: Get Alert

**Description**: Get alert by ID with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/alerts/{alert_id}
```

#### `GET /api/v2/demographics/dashboard/alerts`
**Summary**: Get Demographic Alerts

**Description**: GET /api/v2/demographics/dashboard/alerts

Get demographic alerts and anomalies.

Returns active alerts for demographic concerns requiring attention.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/dashboard/alerts
```

#### `GET /api/v2/economic-impact/dashboard/alerts`
**Summary**: Get Dashboard Alerts

**Description**: Get economic alerts and threshold violations

Active alerts for budget overruns, low ROI, high risk exposure.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/economic-impact/dashboard/alerts
```

### POST Requests (11 endpoints)

#### `POST /api/v2/alerts`
**Summary**: Create Alert

**Description**: Create a new alert.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/alerts \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/alerts/correlations`
**Summary**: Create Alert Correlation

**Description**: Create a new alert correlation.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/alerts/correlations \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/alerts/escalations`
**Summary**: Create Escalation Policy

**Description**: Create a new escalation policy.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/alerts/escalations \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/alerts/notifications`
**Summary**: Create Notification Rule

**Description**: Create a new notification rule.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/alerts/notifications \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/alerts/rules`
**Summary**: Create Alert Rule

**Description**: Create a new alert rule.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/alerts/rules \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/alerts/rules/{rule_id}/disable`
**Summary**: Disable Alert Rule

**Description**: Disable an alert rule.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/alerts/rules/{rule_id}/disable \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/alerts/rules/{rule_id}/enable`
**Summary**: Enable Alert Rule

**Description**: Enable an alert rule.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/alerts/rules/{rule_id}/enable \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/alerts/search`
**Summary**: Search Alerts Semantic

**Description**: Semantic search for alerts.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/alerts/search \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/alerts/{alert_id}/acknowledge`
**Summary**: Acknowledge Alert

**Description**: Acknowledge an alert.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/alerts/{alert_id}/acknowledge \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/alerts/{alert_id}/assign`
**Summary**: Assign Alert

**Description**: Assign an alert to a user.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/alerts/{alert_id}/assign \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/alerts/{alert_id}/resolve`
**Summary**: Resolve Alert

**Description**: Resolve an alert.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/alerts/{alert_id}/resolve \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

### PUT Requests (4 endpoints)

#### `PUT /api/v2/alerts/escalations/{policy_id}`
**Summary**: Update Escalation Policy

**Description**: Update an escalation policy.

Requires WRITE access level.

#### `PUT /api/v2/alerts/notifications/{notification_id}`
**Summary**: Update Notification Rule

**Description**: Update a notification rule.

Requires WRITE access level.

#### `PUT /api/v2/alerts/rules/{rule_id}`
**Summary**: Update Alert Rule

**Description**: Update an alert rule.

Requires WRITE access level.

#### `PUT /api/v2/alerts/{alert_id}`
**Summary**: Update Alert

**Description**: Update an existing alert.

Requires WRITE access level.

### DELETE Requests (4 endpoints)

#### `DELETE /api/v2/alerts/escalations/{policy_id}`
**Summary**: Delete Escalation Policy

**Description**: Delete an escalation policy.

Requires ADMIN access level.

#### `DELETE /api/v2/alerts/notifications/{notification_id}`
**Summary**: Delete Notification Rule

**Description**: Delete a notification rule.

Requires ADMIN access level.

#### `DELETE /api/v2/alerts/rules/{rule_id}`
**Summary**: Delete Alert Rule

**Description**: Delete an alert rule.

Requires ADMIN access level.

#### `DELETE /api/v2/alerts/{alert_id}`
**Summary**: Delete Alert

**Description**: Delete an alert.

Requires ADMIN access level.

