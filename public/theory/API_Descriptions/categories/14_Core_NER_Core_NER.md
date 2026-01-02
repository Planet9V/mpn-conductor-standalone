# Core NER APIs
**Category**: Core NER
**Total Endpoints**: 6
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Core NER API provides comprehensive functionality for managing and analyzing core ner within the NER11 Gold cybersecurity platform.

## Endpoints (6 total)

### GET Requests (4 endpoints)

#### `GET /api/v2/search/customers/{customer_id}/stats`
**Summary**: Customer Search Statistics

**Description**: Get search statistics for a specific customer.

Returns entity counts and metadata for the customer's isolated data.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/search/customers/{customer_id}/stats
```

#### `GET /api/v2/search/health`
**Summary**: Service Health Check

**Description**: Check semantic search service health.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/search/health
```

#### `GET /health`
**Summary**: Health Check

**Description**: Health check endpoint with service status and model validation.

**Usage**:
```bash
curl http://172.30.253.47:8000/health
```

#### `GET /info`
**Summary**: Model Info

**Description**: Model information and capabilities.

**Usage**:
```bash
curl http://172.30.253.47:8000/info
```

### POST Requests (2 endpoints)

#### `POST /ner`
**Summary**: Extract Entities

**Description**: Extract named entities from text using enhanced multi-layer NER approach.

Strategy (in priority order):
1. Pattern-based extraction (HIGH confidence for CVE, APT, MITRE patterns)
2. Fallback model (en_core_web_trf) for general NER
3. Custom NER11 model for cybersecurity-specific entities

The pattern-based extraction addresses the context-dependency issue where
transformer models require longer context to identify short entities like
"APT29", "CVE-2024-12345", or "T1566".

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/ner \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /search/hybrid`
**Summary**: Hybrid Search

**Description**: Hybrid search combining semantic similarity (Qdrant) with graph expansion (Neo4j).

This is the core Phase 3 feature that provides:
1. Semantic search via Qdrant vector similarity
2. Graph expansion via Neo4j relationship traversal
3. Re-ranking based on combined scores
4. Hierarchical filtering (Tier 1 + Tier 2)

Example usage:
```
POST /search/hybrid
{
    "query": "APT29 ransomware attack",
    "expand_graph": true,
    "hop_depth": 2,
    "relationship_types": ["USES", "TARGETS", "ATTRIBUTED_TO"]
}
```

Returns entities with their graph context and related entities.
Performance target: <500ms.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/search/hybrid \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

