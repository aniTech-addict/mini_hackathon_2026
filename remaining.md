3.1 Patient Management

Method	Route
GET	/api/v1/doctor/patients
GET	/api/v1/doctor/patients/:patientId
GET	/api/v1/doctor/patients/:patientId/file
3.2 Medical Report Upload

Method	Route
POST	/api/v1/doctor/patients/:patientId/reports (multer)
GET	/api/v1/doctor/patients/:patientId/reports
GET	/api/v1/doctor/reports/:reportId
GET	/api/v1/doctor/reports/:reportId/status
3.3 OCR & AI Processing

Method	Route
POST	/api/v1/doctor/reports/:reportId/process
GET	/api/v1/doctor/reports/:reportId/extracted-data
PATCH	/api/v1/doctor/reports/:reportId/extracted-data
3.4 Recovery Plan Generation

Method	Route
POST	/api/v1/doctor/patients/:patientId/recovery-plans/generate
GET	/api/v1/doctor/patients/:patientId/recovery-plans
GET	/api/v1/doctor/recovery-plans/:planId
PATCH	/api/v1/doctor/recovery-plans/:planId
POST	/api/v1/doctor/recovery-plans/:planId/approve
POST	/api/v1/doctor/recovery-plans/:planId/cancel
    3.5 Recovery Tasks

    Method	Route
    POST	/api/v1/doctor/recovery-plans/:planId/tasks
    GET	/api/v1/doctor/recovery-plans/:planId/tasks
    GET	/api/v1/doctor/tasks/:taskId
    PATCH	/api/v1/doctor/tasks/:taskId
    DELETE	/api/v1/doctor/tasks/:taskId
    3.6 Adherence & Daily Reviews

Method	Route
GET	/api/v1/doctor/patients/:patientId/task-completions
GET	/api/v1/doctor/patients/:patientId/adherence
GET	/api/v1/doctor/patients/:patientId/daily-reviews
GET	/api/v1/doctor/patients/:patientId/daily-reviews/latest
3.7 Doctor Alerts

Method	Route
GET	/api/v1/doctor/alerts
GET	/api/v1/doctor/alerts/unread
PATCH	/api/v1/doctor/alerts/:alertId/read
PATCH	/api/v1/doctor/alerts/:alertId/resolve
