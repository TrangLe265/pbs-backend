# My PBS Backend
This backend powers a Powerlifting records and calculation frontend application. Built with Node.js, Express, and PostgreSQL, it manages lift data, calculates DOTS scores for fair lifter comparison, and provides a RESTful API for all core features. It is built with Node.js, Express, and PostgreSQL.

DOTS (Dynamic Objective Team Scoring) is a widely used formula in powerlifting to fairly compare lifters of different body weights. By calculating a DOTS score for each lifter, the system enables objective ranking and classification regardless of weight class.

## Features
- Manage lift types (e.g., squat, bench, deadlift)
- Record user lifts and calculate DOTS scores
- DOTS score classification and coefficient endpoints
- RESTful API endpoints for interacting with the database

## Prerequisites
- Node.js (v16 or later)
- PostgreSQL (v13 or later)

---

## Base URL

```
http://localhost:3000/
```

---

## Endpoints

### **Lift Types**
- **GET `/lift-type`**  
  Get all available lift types.

---

### **Lifts**
- **GET `/lift/user/:userId/:liftTypeId`**  
  Get all lifts of a specific type for a user.

- **GET `/lift/:liftId`**  
  Get a specific lift by its ID.

- **POST `/lift`**  
  Add a new lift.  
  **Body:**
  ```json
  {
    "user_id": "uuid",
    "weight_lifted": number,
    "lift_type_id": "uuid",
    "date": "YYYY-MM-DD",
    "notes": "optional string"
  }
  ```

- **PUT `/lift/:liftId`**  
  Edit a lift by its ID.  
  **Body:** (same as POST)

- **DELETE `/lift/:liftId`**  
  Delete a lift by its ID.

---

### **DOTS Scores**
- **GET `/dots/user/:userId`**  
  Get all DOTS scores for a user.

- **GET `/dots/:scoreId`**  
  Get a specific DOTS score by its ID.

- **POST `/dots`**  
  Add a new DOTS score.  
  **Body:**
  ```json
  {
    "score": number,
    "user_id": "uuid",
    "bench_lift_id": "uuid",
    "squat_lift_id": "uuid",
    "deadlift_lift_id": "uuid"
  }
  ```

- **DELETE `/dots/:scoreId`**  
  Delete a DOTS score by its ID.

---

### **DOTS Classifications**
- **GET `/classification`**  
  Get all DOTS score classifications.

- **GET `/classification/score/:score`**  
  Get the classification label for a specific DOTS score.

---

### **DOTS Coefficients**
- **GET `/coefficients/:sex`**  
  Get DOTS calculation coefficients for a given sex (`male` or `female`).

---

## Validation

- POST endpoints for new lift use server-side validation (Joi) to ensure data integrity.

---

## Seeding

- On server start, initial user and lift data are seeded if not already present.

---

## Notes

- All endpoints return JSON.
- Ensure your database is set up and migrations are run before starting the server.

---
