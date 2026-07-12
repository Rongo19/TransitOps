POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/vehicles
POST   /api/vehicles
GET    /api/vehicles/:id
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id

GET    /api/drivers
POST   /api/drivers
GET    /api/drivers/:id
PUT    /api/drivers/:id

GET    /api/trips
POST   /api/trips              (create as DRAFT)
PATCH  /api/trips/:id/dispatch
PATCH  /api/trips/:id/complete
PATCH  /api/trips/:id/cancel

POST   /api/maintenance
PATCH  /api/maintenance/:id/close
GET    /api/maintenance

POST   /api/fuel-logs
POST   /api/expenses

GET    /api/dashboard/kpis
GET    /api/analytics/fuel-efficiency
GET    /api/analytics/utilization
GET    /api/analytics/cost
GET    /api/reports/export?format=csv