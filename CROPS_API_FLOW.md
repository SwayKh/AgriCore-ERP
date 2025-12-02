# AgriCore ERP - Crops Module API & Frontend Interaction Flow

This document outlines the data models, API endpoints, and interaction logic required for the **Crops Module**. It includes integration with the **Inventory Module** to create a cohesive ERP system.

---

## 1. Overview

The Crops Module will allow users to track farm crops from planting to harvest. Key functionality includes creating new crop entries, monitoring their status, and recording the final harvest. This process is deeply integrated with the inventory system to automatically track resource consumption (e.g., seeds, fertilizers) and harvested yield.

---

## 2. Data Models

### A. `Crop` Model

This is the primary model for the Crops module.

| Field                 | Type     | Description                                                                 | Example                               | Required |
| --------------------- | -------- | --------------------------------------------------------------------------- | ------------------------------------- | -------- |
| `_id`                 | ObjectId | Unique identifier for the crop entry.                                       | `60d5f1b3b5a7b1234567890c`            | Yes      |
| `cropName`            | String   | The common name of the crop.                                                | "Corn"                                | Yes      |
| `variety`             | String   | The specific variety of the crop.                                           | "Golden Bantam"                       | Yes      |
| `plantingDate`        | Date     | The date the crop was planted.                                              | `2025-11-18T00:00:00.000Z`            | Yes      |
| `expectedHarvestDate`  | Date     | The estimated date for the harvest.                                         | `2026-03-20T00:00:00.000Z`            | Yes      |
| `fieldLocation`       | String   | A reference to the field or area where the crop is planted.                 | "North Field 1"                       | Yes      |
| `status`              | String   | The current stage of the crop cycle. (Enum)                                 | "Planted", "Growing", "Harvested"     | Yes      |
| `notes`               | String   | Any additional notes or observations.                                       | "Initial growth looks strong."        | No       |
| `harvestedQuantity`   | Number   | The final yield quantity after harvesting. Only present after harvest.      | 5000                                  | No       |
| `harvestedUnit`       | String   | The unit for the harvested quantity (e.g., kg, bushels).                    | "kg"                                  | No       |

### B. `Item` and `Stock` Models (Inventory)

These existing models will be used for the integration. No changes are needed to their schema, but they are central to the interaction logic.

---

## 3. API Endpoints & Interaction Logic

### A. Create a New Crop (with Inventory Deduction)

This is the most critical interaction. The endpoint must handle the creation of a crop and the simultaneous deduction of consumed resources from inventory in a single, atomic transaction.

- **Endpoint:** `POST /api/v1/crops`
- **Description:** Creates a new crop entry and decrements the stock of consumed items (seeds, fertilizers, etc.).
- **Backend Logic:**
  1.  Receive the request containing crop details and a `consumedResources` array.
  2.  Start a database transaction.
  3.  For each item in `consumedResources`:
      a. Check if sufficient stock exists for the `itemId`.
      b. If not, abort the transaction and return a `400 Bad Request` error with a message like "Insufficient stock for [Item Name]".
      c. If sufficient, decrement the `quantity` in the corresponding `Stock` document.
  4.  If all stock updates succeed, create the new `Crop` document with the provided details.
  5.  Commit the transaction.
  6.  Return the newly created crop object with a `201 Created` status.

- **Request Body Example:**
  ```json
  {
    "cropName": "Corn",
    "variety": "Golden Bantam",
    "plantingDate": "2025-11-18",
    "expectedHarvestDate": "2026-03-20",
    "fieldLocation": "North Field 1",
    "consumedResources": [
      {
        "itemId": "60d5f1b3b5a7b1234567890a",
        "quantity": 10
      },
      {
        "itemId": "60d5f1b3b5a7b1234567890b",
        "quantity": 25
      }
    ]
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d5f1b3b5a7b1234567890c",
      "cropName": "Corn",
      "variety": "Golden Bantam",
      // ... all other crop fields
    }
  }
  ```

### B. Get All Crops

- **Endpoint:** `GET /api/v1/crops`
- **Description:** Retrieves a list of all crops.
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "60d5f1b3b5a7b1234567890c",
        "cropName": "Corn",
        "status": "Growing",
        // ... other fields
      }
    ]
  }
  ```

### C. Harvest a Crop (with Inventory Addition)

This endpoint handles the harvesting process, which updates the crop's status and adds the yield to the inventory.

- **Endpoint:** `POST /api/v1/crops/:id/harvest`
- **Description:** Marks a crop as "Harvested" and adds the resulting yield to the inventory.
- **Backend Logic:**
  1.  Find the crop by its `id`.
  2.  Start a database transaction.
  3.  Update the crop's `status` to "Harvested" and set the `harvestedQuantity` and `harvestedUnit` from the request body.
  4.  Find the inventory `Item` that corresponds to the harvested product (e.g., "Corn Grain").
      - If it doesn't exist, a new `Item` may need to be created first. The `itemNameForHarvest` in the request body will define this.
  5.  Increase the `quantity` in the `Stock` document for that item.
  6.  Commit the transaction.
  7.  Return a success message.

- **Request Body Example:**
  ```json
  {
    "itemNameForHarvest": "Corn Grain",
    "quantity": 5000,
    "unit": "kg"
  }
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Crop harvested successfully and inventory updated."
  }
  ```

### D. Update Crop Details

- **Endpoint:** `PATCH /api/v1/crops/:id`
- **Description:** For making simple updates to a crop's fields, such as adding `notes` or changing the `expectedHarvestDate`. This should not be used for status changes that affect inventory.
- **Request Body Example:**
  ```json
  {
    "notes": "Weather has been favorable. Growth is ahead of schedule."
  }
  ```

### E. Delete a Crop

- **Endpoint:** `DELETE /api/v1/crops/:id`
- **Description:** Removes a crop entry. **Note:** This should generally be disallowed if the crop has consumed inventory or has been harvested, to preserve historical data integrity. A soft-delete (e.g., setting an `isActive: false` flag) might be preferable.

---

## 4. Frontend Implementation Plan

1.  **`CropsContext.jsx`:** Create a new context to manage state for crops, including the crop list, loading status, and error messages. It will expose functions like `fetchCrops`, `addCrop`, and `harvestCrop`.
2.  **`CropsTable.jsx`:**
    -   Fetch and display all crops from `GET /api/v1/crops`.
    -   Include an "Add New Crop" button.
    -   For each row, include "Edit" and "Delete" buttons, plus a "Harvest" button if `status` is "Growing".
3.  **`CropDialog.jsx` (for Add/Edit):**
    -   A modal form for creating and editing basic crop details.
    -   When adding a crop, it will include a dynamic list of fields to select `consumedResources` (seeds, fertilizers) from inventory. This will require an endpoint to fetch inventory items, e.g., `GET /api/v1/items?category=Seed`.
4.  **`HarvestDialog.jsx`:**
    -   A simple modal that appears when the "Harvest" button is clicked.
    -   It will have inputs for `quantity` and `unit` of the harvest.
    -   On submit, it will call the `POST /api/v1/crops/:id/harvest` endpoint.
