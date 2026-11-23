```mermaid
sequenceDiagram
participant C as Client
participant A as API
participant DB as Database

C->>A: POST /api/auth/login
A->>DB: User.findOne({ email })
DB-->>A: User document
A->>A: bcrypt.compare(password, hash)

alt Correct password
    A->>A: jwt.sign({ userId })
    A-->>C: 200 OK { token }
else Incorrect password
    A-->>C: 401 Unauthorized
End
```


```mermaid
flowchart TD

Start([Incoming request]) --> Auth{Has valid JWT?}
Auth -->|No| Reject[401 Unauthorized]
Auth -->|Yes| Role{Has correct role?}
Role -->|No| Forbidden[403 Forbidden]
Role -->|Yes| Validate{Validate input}
Validate -->|Invalid| BadRequest[400 Bad Request]
Validate -->|Valid| Process[Process the request]
Process --> Response[200 OK]
```

```mermaid
erDiagram
    USER ||--o{ PROPERTY : "hosts"
    USER ||--o{ BOOKING : "makes"
    USER ||--o{ FAVORITE : "saves"
    USER ||--o{ MESSAGE : "sends/receives"
    USER ||--o{ ADMIN_LOG : "triggers (if admin)"
    
    PROPERTY ||--o{ BOOKING : "has"
    PROPERTY ||--o{ FAVORITE : "is_saved_in"
    PROPERTY ||--o{ MESSAGE : "referenced_in"

    USER {
        string id PK
        string name
        string email
        string password
        string role "guest / host / admin"
    }
    PROPERTY {
        string id PK
        string title
        string location
        number pricePerNight
        string owner FK
    }
    BOOKING {
        string id PK
        string userId FK
        string propertyId FK
        date startDate
        date endDate
        string status "confirmed / cancelled"
        string paymentStatus "paid / unpaid"
    }
```



 ```mermaid
graph TD
    A[Incoming Request] --> B{authMiddleware}
    B -- No Token / Invalid --> C[401 Unauthorized]
    B -- Valid Token --> D{roleMiddleware}
    
    D -- Unauthorized Role --> E[403 Forbidden]
    D -- Allowed Role --> F{Zod Validation / Schema Parse}
    
    F -- Bad Input Data --> G[400 Bad Request]
    F -- Valid Data --> H[Controller Execution]
    H --> I[Success Response]
 ```

 ```mermaid
    sequenceDiagram
    autonumber
    actor Frontend as Frontend Client
    participant API as Booking Controller
    participant DB as MongoDB
    participant Mail as Nodemailer

    Frontend->>API: POST /api/v1/bookings (dates, propertyId)
    API->>DB: Find overlapping non-cancelled bookings
    alt Conflict Found
        DB-->>API: Overlap Detected
        API-->>Frontend: 409 Conflict ("Boendet är redan bokat")
    else No Conflict
        API->>DB: Fetch Property pricePerNight
        API->>DB: Create Booking (status: confirmed, paymentStatus: unpaid)
        API->>DB: Fetch Guest Email Context
        critical Async Email Dispatch
            API->>Mail: Trigger sendBookingConfirmation()
        end
        API-->>Frontend: 201 Created (Booking Data)
    end
```

 ```mermaid
stateDiagram-v2
    [*] --> Guest : Registration default
    
    state Guest {
        [*] --> Browsing
        Browsing --> BookingStay
    }
    
    state Host {
        [*] --> Dashboard
        Dashboard --> CreatingListings
        Dashboard --> ReviewingBookings
    }

    Guest --> Host : switchRole() API call
    Host --> Guest : switchRole() API call
```
