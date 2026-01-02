# Customer Isolation APIs
**Category**: Customer Isolation
**Total Endpoints**: 3
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Customer Isolation API provides comprehensive functionality for managing and analyzing customer isolation within the NER11 Gold cybersecurity platform.

## Endpoints (3 total)

### POST Requests (3 endpoints)

#### `POST /api/v2/search/semantic`
**Summary**: Customer-Isolated Semantic Search

**Description**: Semantic search with automatic customer isolation.

    All results are filtered by customer_id to ensure multi-tenant data isolation.
    Optionally includes SYSTEM entities (shared CVEs, CWEs, CAPECs).

    **Hierarchical Filtering:**
    - Tier 1: label_filter (60 NER labels)
    - Tier 2: fine_grained_filter (566 fine-grained types)

    **Required Headers:**
    - X-Customer-ID: Customer identifier

    **Optional Headers:**
    - X-Namespace: Customer namespace
    - X-User-ID: User identifier for audit

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/search/semantic \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/search/semantic/body`
**Summary**: Semantic Search with JSON Body

**Description**: Alternative endpoint accepting full request body.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/search/semantic/body \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /search/semantic`
**Summary**: Semantic Search

**Description**: Semantic search with hierarchical filtering (Task 1.5).

Search entities using semantic similarity with hierarchical taxonomy filtering:
- Tier 1 filtering: label_filter (60 NER labels)
- Tier 2 filtering: fine_grained_filter (566 fine-grained types) - KEY FEATURE
- Confidence filtering: confidence_threshold

Example queries:
- "ransomware attack" → Find semantically similar malware entities
- "SCADA systems" with fine_grained_filter="SCADA_SERVER" → Precise infrastructure search
- "threat actors" with label_filter="THREAT_ACTOR" → Category-filtered search

Returns results with complete hierarchy_path for each entity.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/search/semantic \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

