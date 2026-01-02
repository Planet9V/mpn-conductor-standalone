# Vendor Equipment APIs
**Category**: Vendor Equipment
**Total Endpoints**: 24
**Base URL**: http://172.30.253.47:8000
**Status**: ✅ Operational

## Overview

Vendor Equipment API provides comprehensive functionality for managing and analyzing vendor equipment within the NER11 Gold cybersecurity platform.

## Endpoints (24 total)

### GET Requests (16 endpoints)

#### `GET /api/v2/vendor-equipment/equipment`
**Summary**: Search Equipment

**Description**: Search equipment with filters and customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/equipment
```

#### `GET /api/v2/vendor-equipment/equipment/approaching-eol`
**Summary**: Get Equipment Approaching Eol

**Description**: Get all equipment approaching EOL within specified days.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/equipment/approaching-eol
```

#### `GET /api/v2/vendor-equipment/equipment/eol`
**Summary**: Get Eol Equipment

**Description**: Get all equipment that has passed EOL.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/equipment/eol
```

#### `GET /api/v2/vendor-equipment/equipment/{model_id}`
**Summary**: Get Equipment

**Description**: Get equipment model by ID with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/equipment/{model_id}
```

#### `GET /api/v2/vendor-equipment/maintenance-schedule`
**Summary**: Get Maintenance Schedule

**Description**: Get prioritized maintenance schedule.

Prioritized by:
1. EOL proximity
2. Vulnerability count
3. Criticality

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/maintenance-schedule
```

#### `GET /api/v2/vendor-equipment/maintenance-windows`
**Summary**: List Maintenance Windows

**Description**: List maintenance windows with optional filters.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/maintenance-windows
```

#### `GET /api/v2/vendor-equipment/maintenance-windows/{window_id}`
**Summary**: Get Maintenance Window

**Description**: Get maintenance window by ID.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/maintenance-windows/{window_id}
```

#### `GET /api/v2/vendor-equipment/predictive-maintenance/forecast`
**Summary**: Get Maintenance Forecast

**Description**: Get comprehensive maintenance forecast.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/predictive-maintenance/forecast
```

#### `GET /api/v2/vendor-equipment/predictive-maintenance/{equipment_id}`
**Summary**: Predict Maintenance

**Description**: Get maintenance predictions for specific equipment.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/predictive-maintenance/{equipment_id}
```

#### `GET /api/v2/vendor-equipment/vendors`
**Summary**: Search Vendors

**Description**: Search vendors with filters and customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/vendors
```

#### `GET /api/v2/vendor-equipment/vendors/high-risk`
**Summary**: Get High Risk Vendors

**Description**: Get all vendors with high risk scores.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/vendors/high-risk
```

#### `GET /api/v2/vendor-equipment/vendors/{vendor_id}`
**Summary**: Get Vendor

**Description**: Get vendor by ID with customer isolation.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/vendors/{vendor_id}
```

#### `GET /api/v2/vendor-equipment/vendors/{vendor_id}/risk-summary`
**Summary**: Get Vendor Risk Summary

**Description**: Get comprehensive risk summary for a vendor.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/vendors/{vendor_id}/risk-summary
```

#### `GET /api/v2/vendor-equipment/work-orders`
**Summary**: List Work Orders

**Description**: List work orders with optional filters.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/work-orders
```

#### `GET /api/v2/vendor-equipment/work-orders/summary`
**Summary**: Get Work Order Summary

**Description**: Get work order summary with status and priority breakdowns.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/work-orders/summary
```

#### `GET /api/v2/vendor-equipment/work-orders/{work_order_id}`
**Summary**: Get Work Order

**Description**: Get work order by ID.

**Usage**:
```bash
curl http://172.30.253.47:8000/api/v2/vendor-equipment/work-orders/{work_order_id}
```

### POST Requests (6 endpoints)

#### `POST /api/v2/vendor-equipment/equipment`
**Summary**: Create Equipment

**Description**: Create a new equipment model for the customer.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/vendor-equipment/equipment \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/vendor-equipment/maintenance-windows`
**Summary**: Create Maintenance Window

**Description**: Create a new maintenance window.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/vendor-equipment/maintenance-windows \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/vendor-equipment/maintenance-windows/check-conflict`
**Summary**: Check Maintenance Conflict

**Description**: Check for scheduling conflicts with existing maintenance windows.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/vendor-equipment/maintenance-windows/check-conflict \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/vendor-equipment/vendors`
**Summary**: Create Vendor

**Description**: Create a new vendor for the customer.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/vendor-equipment/vendors \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/vendor-equipment/vulnerabilities/flag`
**Summary**: Flag Vendor Vulnerability

**Description**: Flag a supply chain vulnerability affecting a vendor.

All equipment from the affected vendor will be flagged.
Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/vendor-equipment/vulnerabilities/flag \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

#### `POST /api/v2/vendor-equipment/work-orders`
**Summary**: Create Work Order

**Description**: Create a new work order.

Requires WRITE access level.

**Usage**:
```bash
curl -X POST http://172.30.253.47:8000/api/v2/vendor-equipment/work-orders \\
  -H "Content-Type: application/json" \\
  -d '{}'  # Add request body
```

### PATCH Requests (1 endpoints)

#### `PATCH /api/v2/vendor-equipment/work-orders/{work_order_id}/status`
**Summary**: Update Work Order Status

**Description**: Update work order status.

Requires WRITE access level.

### DELETE Requests (1 endpoints)

#### `DELETE /api/v2/vendor-equipment/maintenance-windows/{window_id}`
**Summary**: Delete Maintenance Window

**Description**: Delete a maintenance window.

Requires WRITE access level.

