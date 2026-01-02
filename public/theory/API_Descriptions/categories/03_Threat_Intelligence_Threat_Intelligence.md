# Threat Intelligence APIs
**Category**: Threat Intelligence
**Total Endpoints**: 26
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Threat Intelligence API provides comprehensive functionality for managing and analyzing threat intelligence within the NER11 Gold cybersecurity platform.

## Endpoints (26 total)

### GET Requests (19 endpoints)

#### `GET /api/v2/threat-intel/actors/active`
**Summary**: Get Active Threat Actors

**Description**: Get all currently active threat actors.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/actors/active
```

#### `GET /api/v2/threat-intel/actors/by-sector/{sector}`
**Summary**: Get Actors By Sector

**Description**: Get threat actors targeting a specific sector.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/actors/by-sector/{sector}
```

#### `GET /api/v2/threat-intel/actors/search`
**Summary**: Search Threat Actors

**Description**: Search threat actors with semantic search and filters.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/actors/search
```

#### `GET /api/v2/threat-intel/actors/{actor_id}`
**Summary**: Get Threat Actor

**Description**: Get threat actor by ID with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/actors/{actor_id}
```

#### `GET /api/v2/threat-intel/actors/{actor_id}/campaigns`
**Summary**: Get Actor Campaigns

**Description**: Get campaigns associated with a threat actor.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/actors/{actor_id}/campaigns
```

#### `GET /api/v2/threat-intel/actors/{actor_id}/cves`
**Summary**: Get Actor Cves

**Description**: Get CVEs associated with a threat actor.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/actors/{actor_id}/cves
```

#### `GET /api/v2/threat-intel/campaigns/active`
**Summary**: Get Active Campaigns

**Description**: Get all currently active campaigns.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/campaigns/active
```

#### `GET /api/v2/threat-intel/campaigns/search`
**Summary**: Search Campaigns

**Description**: Search campaigns with semantic search and filters.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/campaigns/search
```

#### `GET /api/v2/threat-intel/campaigns/{campaign_id}`
**Summary**: Get Campaign

**Description**: Get campaign by ID with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/campaigns/{campaign_id}
```

#### `GET /api/v2/threat-intel/campaigns/{campaign_id}/iocs`
**Summary**: Get Campaign Iocs

**Description**: Get IOCs associated with a campaign.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/campaigns/{campaign_id}/iocs
```

#### `GET /api/v2/threat-intel/dashboard/summary`
**Summary**: Get Threat Intel Summary

**Description**: Get threat intelligence dashboard summary.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/dashboard/summary
```

#### `GET /api/v2/threat-intel/feeds`
**Summary**: List Threat Feeds

**Description**: List threat feeds.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/feeds
```

#### `GET /api/v2/threat-intel/iocs/active`
**Summary**: Get Active Iocs

**Description**: Get all currently active IOCs.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/iocs/active
```

#### `GET /api/v2/threat-intel/iocs/by-type/{ioc_type}`
**Summary**: Get Iocs By Type

**Description**: Get IOCs by type.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/iocs/by-type/{ioc_type}
```

#### `GET /api/v2/threat-intel/iocs/search`
**Summary**: Search Iocs

**Description**: Search IOCs with semantic search and filters.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/iocs/search
```

#### `GET /api/v2/threat-intel/mitre/coverage`
**Summary**: Get Mitre Coverage

**Description**: Get MITRE ATT&CK coverage summary.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/mitre/coverage
```

#### `GET /api/v2/threat-intel/mitre/gaps`
**Summary**: Get Mitre Gaps

**Description**: Get MITRE ATT&CK coverage gaps.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/mitre/gaps
```

#### `GET /api/v2/threat-intel/mitre/mappings/entity/{entity_type}/{entity_id}`
**Summary**: Get Entity Mitre Mappings

**Description**: Get MITRE ATT&CK mappings for an entity.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/mitre/mappings/entity/{entity_type}/{entity_id}
```

#### `GET /api/v2/threat-intel/mitre/techniques/{technique_id}/actors`
**Summary**: Get Actors Using Technique

**Description**: Get threat actors using a specific MITRE ATT&CK technique.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/threat-intel/mitre/techniques/{technique_id}/actors
```

### POST Requests (6 endpoints)

#### `POST /api/v2/threat-intel/actors`
**Summary**: Create Threat Actor

**Description**: Create a new threat actor.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/threat-intel/actors \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/threat-intel/campaigns`
**Summary**: Create Campaign

**Description**: Create a new campaign.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/threat-intel/campaigns \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/threat-intel/feeds`
**Summary**: Create Threat Feed

**Description**: Create a new threat feed.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/threat-intel/feeds \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/threat-intel/iocs`
**Summary**: Create Ioc

**Description**: Create a new IOC.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/threat-intel/iocs \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/threat-intel/iocs/bulk`
**Summary**: Bulk Import Iocs

**Description**: Bulk import IOCs.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/threat-intel/iocs/bulk \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/threat-intel/mitre/mappings`
**Summary**: Create Mitre Mapping

**Description**: Create a new MITRE ATT&CK mapping.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/threat-intel/mitre/mappings \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

### PUT Requests (1 endpoints)

#### `PUT /api/v2/threat-intel/feeds/{feed_id}/refresh`
**Summary**: Trigger Feed Refresh

**Description**: Trigger threat feed refresh.

Requires WRITE access level.

