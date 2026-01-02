# Demographics APIs
**Category**: Demographics
**Total Endpoints**: 23
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Demographics API provides comprehensive functionality for managing and analyzing demographics within the NER11 Gold cybersecurity platform.

## Endpoints (23 total)

### GET Requests (21 endpoints)

#### `GET /api/v2/demographics/dashboard/baseline`
**Summary**: Get Baseline Metrics

**Description**: GET /api/v2/demographics/dashboard/baseline

Get baseline metrics for psychohistory.

Returns key metrics used for psychohistory calculations:
- Population stability index
- Role diversity score
- Skill concentration risk
- Succession coverage
- Insider threat baseline

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/dashboard/baseline
```

#### `GET /api/v2/demographics/dashboard/indicators`
**Summary**: Get Demographic Indicators

**Description**: GET /api/v2/demographics/dashboard/indicators

Get key demographic indicators.

Returns monitored indicators with thresholds and health status.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/dashboard/indicators
```

#### `GET /api/v2/demographics/dashboard/summary`
**Summary**: Get Dashboard Summary

**Description**: GET /api/v2/demographics/dashboard/summary

Get demographics dashboard summary.

Returns comprehensive dashboard with population, workforce, and
organization summaries.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/dashboard/summary
```

#### `GET /api/v2/demographics/dashboard/trends`
**Summary**: Get Trend Analysis

**Description**: GET /api/v2/demographics/dashboard/trends

Get demographic trend analysis.

Returns trend analysis with forecasting for key demographic metrics.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/dashboard/trends
```

#### `GET /api/v2/demographics/organization/hierarchy`
**Summary**: Get Organization Hierarchy

**Description**: GET /api/v2/demographics/organization/hierarchy

Get organization hierarchy map.

Returns complete organizational structure with units and relationships.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/organization/hierarchy
```

#### `GET /api/v2/demographics/organization/relationships`
**Summary**: Get Organization Relationships

**Description**: GET /api/v2/demographics/organization/relationships

Get inter-unit relationships.

Returns relationships between organizational units.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/organization/relationships
```

#### `GET /api/v2/demographics/organization/units`
**Summary**: List Organization Units

**Description**: GET /api/v2/demographics/organization/units

List all organizational units.

Returns all units with basic information and employee counts.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/organization/units
```

#### `GET /api/v2/demographics/organization/{unit_id}/details`
**Summary**: Get Unit Details

**Description**: GET /api/v2/demographics/organization/{unit_id}/details

Get organization unit details with demographics.

Returns detailed unit information including demographics and criticality.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/organization/{unit_id}/details
```

#### `GET /api/v2/demographics/population/distribution`
**Summary**: Get Population Distribution

**Description**: GET /api/v2/demographics/population/distribution

Get population distribution by category.

Returns distribution by age group, tenure, education, and department.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/population/distribution
```

#### `GET /api/v2/demographics/population/summary`
**Summary**: Get Population Summary

**Description**: GET /api/v2/demographics/population/summary

Get population demographics summary.

Returns total population, active employees, contractors, growth rate,
and stability index.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/population/summary
```

#### `GET /api/v2/demographics/population/trends`
**Summary**: Get Population Trends

**Description**: GET /api/v2/demographics/population/trends

Get population trend analysis.

Returns historical trends and 90-day forecast.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/population/trends
```

#### `GET /api/v2/demographics/population/{org_unit_id}/profile`
**Summary**: Get Org Unit Population Profile

**Description**: GET /api/v2/demographics/population/{org_unit_id}/profile

Get organization unit population profile.

Returns demographic profile for specific organizational unit.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/population/{org_unit_id}/profile
```

#### `GET /api/v2/demographics/roles/access-patterns`
**Summary**: Get Access Patterns

**Description**: GET /api/v2/demographics/roles/access-patterns

Get role-based access patterns.

Returns normal access patterns and detected anomalies.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/roles/access-patterns
```

#### `GET /api/v2/demographics/roles/distribution`
**Summary**: Get Role Distribution

**Description**: GET /api/v2/demographics/roles/distribution

Get role distribution across organization.

Returns all roles with counts and security relevance.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/roles/distribution
```

#### `GET /api/v2/demographics/roles/security-relevant`
**Summary**: Get Security Relevant Roles

**Description**: GET /api/v2/demographics/roles/security-relevant

Get security-relevant roles analysis.

Returns roles with security implications and coverage metrics.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/roles/security-relevant
```

#### `GET /api/v2/demographics/roles/{role_id}/demographics`
**Summary**: Get Role Demographics

**Description**: GET /api/v2/demographics/roles/{role_id}/demographics

Get demographics for specific role.

Returns demographic profile for employees in the specified role.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/roles/{role_id}/demographics
```

#### `GET /api/v2/demographics/workforce/capacity`
**Summary**: Get Capacity Metrics

**Description**: GET /api/v2/demographics/workforce/capacity

Get capacity and utilization metrics.

Returns total capacity, utilization, and overutilized teams.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/workforce/capacity
```

#### `GET /api/v2/demographics/workforce/composition`
**Summary**: Get Workforce Composition

**Description**: GET /api/v2/demographics/workforce/composition

Get workforce composition breakdown.

Returns composition by role, department, and turnover metrics.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/workforce/composition
```

#### `GET /api/v2/demographics/workforce/skills`
**Summary**: Get Skills Inventory

**Description**: GET /api/v2/demographics/workforce/skills

Get skills inventory and distribution.

Returns skills by category, critical skills, and skill gaps.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/workforce/skills
```

#### `GET /api/v2/demographics/workforce/turnover`
**Summary**: Get Turnover Metrics

**Description**: GET /api/v2/demographics/workforce/turnover

Get turnover metrics and predictions.

Returns current turnover rate, predictions, and high-risk employees.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/workforce/turnover
```

#### `GET /api/v2/demographics/workforce/{team_id}/profile`
**Summary**: Get Team Profile

**Description**: GET /api/v2/demographics/workforce/{team_id}/profile

Get team demographic profile.

Returns team demographics, cohesion score, and diversity index.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/demographics/workforce/{team_id}/profile
```

### POST Requests (2 endpoints)

#### `POST /api/v2/demographics/organization/analyze`
**Summary**: Analyze Organization Structure

**Description**: POST /api/v2/demographics/organization/analyze

Analyze organization structure.

Supports various analysis types: span of control, depth analysis,
bottleneck detection, communication efficiency.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/demographics/organization/analyze \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/demographics/population/query`
**Summary**: Query Population

**Description**: POST /api/v2/demographics/population/query

Execute custom population query.

Supports filters, grouping, and aggregations for flexible querying.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/demographics/population/query \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

