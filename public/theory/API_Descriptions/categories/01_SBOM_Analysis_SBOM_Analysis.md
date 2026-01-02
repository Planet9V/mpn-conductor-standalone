# SBOM Analysis APIs
**Category**: SBOM Analysis
**Total Endpoints**: 36
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

SBOM Analysis API provides comprehensive functionality for managing and analyzing sbom analysis within the NER11 Gold cybersecurity platform.

## Endpoints (36 total)

### GET Requests (27 endpoints)

#### `GET /api/v2/sbom/components/high-risk`
**Summary**: Get High Risk Components

**Description**: Get all high-risk components (critical vulns, high license risk, or deprecated).

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/components/high-risk
```

#### `GET /api/v2/sbom/components/search`
**Summary**: Search Components

**Description**: Search components with semantic search and filters.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/components/search
```

#### `GET /api/v2/sbom/components/vulnerable`
**Summary**: Get Vulnerable Components

**Description**: Get all components with vulnerabilities above CVSS threshold.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/components/vulnerable
```

#### `GET /api/v2/sbom/components/{component_id}`
**Summary**: Get Component

**Description**: Get component by ID with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/components/{component_id}
```

#### `GET /api/v2/sbom/components/{component_id}/dependencies`
**Summary**: Get Dependency Tree

**Description**: Get dependency tree for a component.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/components/{component_id}/dependencies
```

#### `GET /api/v2/sbom/components/{component_id}/dependents`
**Summary**: Get Dependents

**Description**: Get all components that depend on this component (reverse dependencies).

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/components/{component_id}/dependents
```

#### `GET /api/v2/sbom/components/{component_id}/impact`
**Summary**: Get Impact Analysis

**Description**: Analyze the impact if a component has a vulnerability.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/components/{component_id}/impact
```

#### `GET /api/v2/sbom/components/{component_id}/vulnerabilities`
**Summary**: Get Vulnerabilities By Component

**Description**: Get all vulnerabilities for a specific component.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/components/{component_id}/vulnerabilities
```

#### `GET /api/v2/sbom/dashboard/summary`
**Summary**: Get Dashboard Summary

**Description**: Get customer-wide dashboard summary.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/dashboard/summary
```

#### `GET /api/v2/sbom/dependencies/path`
**Summary**: Find Dependency Path

**Description**: Find shortest dependency path between two components.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/dependencies/path
```

#### `GET /api/v2/sbom/sboms`
**Summary**: List Sboms

**Description**: List SBOMs with filters and customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/sboms
```

#### `GET /api/v2/sbom/sboms/{sbom_id}`
**Summary**: Get Sbom

**Description**: Get SBOM by ID with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/sboms/{sbom_id}
```

#### `GET /api/v2/sbom/sboms/{sbom_id}/components`
**Summary**: Get Components By Sbom

**Description**: Get all components for a specific SBOM.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/sboms/{sbom_id}/components
```

#### `GET /api/v2/sbom/sboms/{sbom_id}/cycles`
**Summary**: Detect Cycles

**Description**: Detect circular dependencies in an SBOM.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/sboms/{sbom_id}/cycles
```

#### `GET /api/v2/sbom/sboms/{sbom_id}/graph-stats`
**Summary**: Get Graph Stats

**Description**: Get comprehensive dependency graph statistics for an SBOM.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/sboms/{sbom_id}/graph-stats
```

#### `GET /api/v2/sbom/sboms/{sbom_id}/license-compliance`
**Summary**: Get License Compliance

**Description**: Get license compliance analysis for an SBOM.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/sboms/{sbom_id}/license-compliance
```

#### `GET /api/v2/sbom/sboms/{sbom_id}/remediation`
**Summary**: Get Remediation Report

**Description**: Generate remediation report for an SBOM.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/sboms/{sbom_id}/remediation
```

#### `GET /api/v2/sbom/sboms/{sbom_id}/risk-summary`
**Summary**: Get Sbom Risk Summary

**Description**: Get comprehensive risk summary for an SBOM.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/sboms/{sbom_id}/risk-summary
```

#### `GET /api/v2/sbom/sboms/{sbom_id}/vulnerable-paths`
**Summary**: Get Vulnerable Paths

**Description**: Find all paths to vulnerable components in an SBOM.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/sboms/{sbom_id}/vulnerable-paths
```

#### `GET /api/v2/sbom/summary`
**Summary**: Get SBOM summary statistics

**Description**: Aggregate SBOM statistics including total counts and vulnerability risk levels.

    **ICE Score: 8.0**
    - Impact: 8 (Important for dashboards)
    - Confidence: 10 (Simple aggregation)
    - Ease: 8 (Straightforward query)

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/summary
```

#### `GET /api/v2/sbom/vulnerabilities/by-apt`
**Summary**: Get Apt Vulnerability Report

**Description**: Get vulnerability report grouped by APT groups.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/vulnerabilities/by-apt
```

#### `GET /api/v2/sbom/vulnerabilities/critical`
**Summary**: Get Critical Vulnerabilities

**Description**: Get all critical vulnerabilities (CISA KEV, in-the-wild, or CVSS >= 9.0).

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/vulnerabilities/critical
```

#### `GET /api/v2/sbom/vulnerabilities/epss-prioritized`
**Summary**: Get Epss Prioritized Vulns

**Description**: Get vulnerabilities prioritized by EPSS score (exploit probability).

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/vulnerabilities/epss-prioritized
```

#### `GET /api/v2/sbom/vulnerabilities/kev`
**Summary**: Get Kev Vulnerabilities

**Description**: Get all CISA Known Exploited Vulnerabilities (KEV).

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/vulnerabilities/kev
```

#### `GET /api/v2/sbom/vulnerabilities/search`
**Summary**: Search Vulnerabilities

**Description**: Search vulnerabilities with semantic search and filters.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/vulnerabilities/search
```

#### `GET /api/v2/sbom/vulnerabilities/{vulnerability_id}`
**Summary**: Get Vulnerability

**Description**: Get vulnerability by ID.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/vulnerabilities/{vulnerability_id}
```

#### `GET /api/v2/sbom/{sbom_id}`
**Summary**: Get SBOM details

**Description**: Retrieve detailed SBOM information including components, vulnerabilities, and metadata.

    **ICE Score: 9.0**
    - Impact: 9 (Essential for SBOM inspection)
    - Confidence: 10 (Straightforward graph query)
    - Ease: 9 (Simple Neo4j query)

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/sbom/{sbom_id}
```

### POST Requests (8 endpoints)

#### `POST /api/v2/sbom/analyze`
**Summary**: Analyze and store SBOM

**Description**: Parse SBOM file (CycloneDX or SPDX format), extract components and dependencies,
    store in Neo4j graph database, and create Qdrant embeddings for semantic search.

    **ICE Score: 8.1**
    - Impact: 9 (Critical for vulnerability tracking)
    - Confidence: 9 (Well-defined SBOM standards)
    - Ease: 7 (Complex parsing and storage)

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/sbom/analyze \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/sbom/components`
**Summary**: Create Component

**Description**: Create a new software component.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/sbom/components \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/sbom/components/search`
**Summary**: Semantic search for SBOM components

**Description**: Semantic search across SBOM components using Qdrant vector similarity.
    Enables natural language queries like "find all Apache components with vulnerabilities".

    **ICE Score: 7.29**
    - Impact: 8 (Useful for discovery)
    - Confidence: 9 (Proven vector search)
    - Ease: 8 (Qdrant integration)

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/sbom/components/search \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/sbom/dependencies`
**Summary**: Create Dependency

**Description**: Create a new dependency relation.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/sbom/dependencies \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/sbom/sboms`
**Summary**: Create Sbom

**Description**: Create a new SBOM for the customer.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/sbom/sboms \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/sbom/sboms/{sbom_id}/correlate-equipment`
**Summary**: Correlate With Equipment

**Description**: Correlate SBOM vulnerabilities with E15 equipment.

Links software vulnerabilities to physical equipment for risk assessment.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/sbom/sboms/{sbom_id}/correlate-equipment \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/sbom/vulnerabilities`
**Summary**: Create Vulnerability

**Description**: Create a new vulnerability record.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/sbom/vulnerabilities \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/sbom/vulnerabilities/{vulnerability_id}/acknowledge`
**Summary**: Acknowledge Vulnerability

**Description**: Acknowledge a vulnerability (mark as reviewed).

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/sbom/vulnerabilities/{vulnerability_id}/acknowledge \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

### DELETE Requests (1 endpoints)

#### `DELETE /api/v2/sbom/sboms/{sbom_id}`
**Summary**: Delete Sbom

**Description**: Delete an SBOM and all its components.

Requires WRITE access level.

