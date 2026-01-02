# Psychometrics APIs
**Category**: Psychometrics
**Total Endpoints**: 9
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Psychometrics API provides comprehensive functionality for managing and analyzing psychometrics within the NER11 Gold cybersecurity platform.

## Endpoints (9 total)

### GET Requests (8 endpoints)

#### `GET /api/v2/psychometrics/actors/by-trait/{trait_id}`
**Summary**: Get Actors By Trait

**Description**: Get all actors exhibiting a specific trait

Returns threat actors associated with the given trait

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/psychometrics/actors/by-trait/{trait_id}
```

#### `GET /api/v2/psychometrics/actors/{actor_id}/profile`
**Summary**: Get Actor Profile

**Description**: Get psychological profile for a threat actor

Returns all traits associated with the actor

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/psychometrics/actors/{actor_id}/profile
```

#### `GET /api/v2/psychometrics/biases`
**Summary**: List Biases

**Description**: List all cognitive biases

Returns all Cognitive_Bias nodes with optional filtering

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/psychometrics/biases
```

#### `GET /api/v2/psychometrics/biases/{bias_id}`
**Summary**: Get Bias Details

**Description**: Get detailed information about a specific cognitive bias

Includes related actors and examples

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/psychometrics/biases/{bias_id}
```

#### `GET /api/v2/psychometrics/dashboard`
**Summary**: Get Dashboard

**Description**: Get psychometric dashboard statistics

Returns comprehensive overview of all psychometric data

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/psychometrics/dashboard
```

#### `GET /api/v2/psychometrics/lacanian/registers`
**Summary**: Get Lacanian Registers

**Description**: Get Lacanian psychoanalytic framework registers

Returns the three registers: Real, Imaginary, Symbolic with associated traits

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/psychometrics/lacanian/registers
```

#### `GET /api/v2/psychometrics/traits`
**Summary**: List Traits

**Description**: List all psychological traits

Returns all PsychTrait nodes with optional filtering.
Supports both GET and POST methods.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/psychometrics/traits
```

#### `GET /api/v2/psychometrics/traits/{trait_id}`
**Summary**: Get Trait Details

**Description**: Get detailed information about a specific trait

Includes related actors and trait relationships

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/psychometrics/traits/{trait_id}
```

### POST Requests (1 endpoints)

#### `POST /api/v2/psychometrics/traits`
**Summary**: List Traits

**Description**: List all psychological traits

Returns all PsychTrait nodes with optional filtering.
Supports both GET and POST methods.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/psychometrics/traits \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

