# Pesapal API 3.0 Payment Integration Documentation

## Introduction

Pesapal API 3.0 provides REST-based payment integration services. All data entities are represented as HTTP resources and accessed using HTTP verbs GET and POST. Requests and responses are JSON encoded.

## Base URLs

| Environment | URL |
|-------------|-----|
| Sandbox | `https://cybqa.pesapal.com/pesapalv3` |
| Live | `https://pay.pesapal.com/v3` |

## Error Handling

When an error occurs during any API call, Pesapal responds with a JSON string in the following format:

```json
{
    "error": {
        "type": "error_type",
        "code": "response_code",
        "message": "Detailed error message goes here.."
    }
}
```

## API Endpoints

### 1. Authentication

**Endpoint:** `POST /api/Auth/RequestToken`

**URLs:**
- Sandbox: `https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken`
- Production: `https://pay.pesapal.com/v3/api/Auth/RequestToken`

**Description:** 
Generates an access token using your merchant credentials. The token is valid for a maximum of 5 minutes and must be sent as a Bearer Token for all other API endpoints.

**Headers:**
```json
{
    "Accept": "application/json",
    "Content-Type": "application/json"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| consumer_key | String | Yes | Merchant consumer key |
| consumer_secret | String | Yes | Merchant consumer secret |

**Request Example:**
```json
{
    "consumer_key": "xxxxx",
    "consumer_secret": "xxxxxx"
}
```

**Response Parameters:**

| Name | Type | Description |
|------|------|-------------|
| token | String | Access token issued by the server |
| expiryDate | String | Token expiration date/time (UTC) |
| error | Object | Error object |
| status | String | Response code |
| message | String | Brief description of the response |

**Response Example:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiryDate": "2021-08-26T12:29:30.5177702Z",
    "error": null,
    "status": "200",
    "message": "Request processed successfully"
}
```

**JavaScript Example:**
```javascript
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");

var raw = JSON.stringify({
  "consumer_key": "your_consumer_key",
  "consumer_secret": "your_consumer_secret"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

---

### 2. Register IPN URL

**Endpoint:** `POST /api/URLSetup/RegisterIPN`

**URLs:**
- Sandbox: `https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN`
- Production: `https://pay.pesapal.com/v3/api/URLSetup/RegisterIPN`

**Description:**
IPN (Instant Payment Notification) allows real-time alerts when payment status changes. This endpoint registers your IPN URL and returns an IPN ID required for order submissions.

**Important Notes:**
- IPN URL must be publicly available
- Whitelist calls from pesapal.com domain if you have strict server rules
- IP whitelisting is not feasible as IPs may change without notice

**Headers:**
```json
{
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer {token}"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | String | Yes | Notification URL for status alerts |
| ipn_notification_type | String | Yes | HTTP method: "GET" or "POST" |

**Request Example:**
```json
{
    "url": "https://www.myapplication.com/ipn",
    "ipn_notification_type": "GET"
}
```

**Response Parameters:**

| Name | Type | Description |
|------|------|-------------|
| url | String | The registered notification URL |
| created_date | String | Registration date/time (UTC) |
| ipn_id | String | Unique identifier (GUID) for the IPN endpoint |
| notification_type | Integer | Notification type code |
| ipn_notification_type_description | String | "GET" or "POST" |
| ipn_status | Integer | Status code |
| ipn_status_decription | String | Status description |
| error | Integer | Error code |
| status | String | Response code |

**Response Example:**
```json
{
  "url": "https://www.myapplication.com/ipn",
  "created_date": "2022-03-03T17:29:03.7208266Z",
  "ipn_id": "e32182ca-0983-4fa0-91bc-c3bb813ba750",
  "notification_type": 0,
  "ipn_notification_type_description": "GET",
  "ipn_status": 1,
  "ipn_status_decription": "Active",
  "error": null,
  "status": "200"
}
```

**Alternative Registration:**
- [Sandbox IPN Registration Form](https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN)
- [Production IPN Registration Form](https://pay.pesapal.com/v3/api/URLSetup/RegisterIPN)

---

### 3. Get IPN List

**Endpoint:** `GET /api/URLSetup/GetIpnList`

**URLs:**
- Sandbox: `https://cybqa.pesapal.com/pesapalv3/api/URLSetup/GetIpnList`
- Production: `https://pay.pesapal.com/v3/api/URLSetup/GetIpnList`

**Description:**
Fetches all registered IPN URLs for your merchant account.

**Headers:**
```json
{
    "Authorization": "Bearer {token}"
}
```

**Request:** No payload required

**Response Example:**
```json
[
    {
        "url": "https://www.myapplication.com/ipn",
        "created_date": "2022-03-03T17:29:03.7208266Z",
        "ipn_id": "e32182ca-0983-4fa0-91bc-c3bb813ba750",
        "error": null,
        "status": "200"
    },
    {
        "url": "https://ipn.myapplication.com/application2",
        "created_date": "2021-12-05T04:23:45.5509243Z",
        "ipn_id": "c3bb813ba750-0983-4fa0-91bc-e32182ca",
        "error": null,
        "status": "200"
    }
]
```

---

### 4. Submit Order Request

**Endpoint:** `POST /api/Transactions/SubmitOrderRequest`

**URLs:**
- Sandbox: `https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest`
- Production: `https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest`

**Description:**
Creates a payment request and returns a redirect URL for customer payment.

**Headers:**
```json
{
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer {token}"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String | Yes | Unique merchant reference (max 50 chars) |
| currency | String | Yes | ISO currency code |
| amount | Float | Yes | Amount to process |
| description | String | Yes | Order description (max 100 chars) |
| callback_url | String | Yes | Redirect URL after payment |
| cancellation_url | String | No | Redirect URL if customer cancels |
| notification_id | GUID | Yes | IPN ID from registration |
| billing_address | Object | Yes | Customer address object |

**Billing Address Object:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| phone_number | String | Conditional* | Customer's phone number |
| email_address | String | Conditional* | Customer's email address |
| country_code | String | No | 2-char ISO 3166-1 country code |
| first_name | String | No | Customer's first name |
| middle_name | String | No | Customer's middle name |
| last_name | String | No | Customer's last name |
| line_1 | String | No | Main address |
| line_2 | String | No | Alternative address |
| city | String | No | City |
| state | String | No | State (max 3 chars) |
| postal_code | Integer | No | Postal code |
| zip_code | Integer | No | Zip code |

*Either phone_number or email_address must be provided

**Request Example:**
```json
{
    "id": "AA1122-3344ZZ",
    "currency": "KES",
    "amount": 100.00,
    "description": "Payment description goes here",
    "callback_url": "https://www.myapplication.com/response-page",
    "notification_id": "fe078e53-78da-4a83-aa89-e7ded5c456e6",
    "billing_address": {
        "email_address": "john.doe@example.com",
        "phone_number": "",
        "country_code": "KE",
        "first_name": "John",
        "middle_name": "",
        "last_name": "Doe",
        "line_1": "",
        "line_2": "",
        "city": "",
        "state": "",
        "postal_code": "",
        "zip_code": ""
    }
}
```

**Response Parameters:**

| Name | Type | Description |
|------|------|-------------|
| order_tracking_id | String | Unique Pesapal order ID |
| merchant_reference | String | Your application's unique ID |
| redirect_url | String | Payment URL (redirect or iframe) |
| error | Integer | Error code |
| message | String | Response message |
| status | String | Response code |

**Response Example:**
```json
{
    "order_tracking_id": "b945e4af-80a5-4ec1-8706-e03f8332fb04",
    "merchant_reference": "TEST1515111119",
    "redirect_url": "https://cybqa.pesapal.com/pesapaliframe/PesapalIframe3/Index/?OrderTrackingId=b945e4af-80a5-4ec1-8706-e03f8332fb04",
    "error": null,
    "status": "200"
}
```

**Callback Details:**

After payment, Pesapal redirects to your callback URL with these parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| OrderTrackingId | String | Pesapal order ID |
| OrderNotificationType | String | Value: "CALLBACKURL" |
| OrderMerchantReference | String | Your unique ID |

**Example Callback URL:**
```
https://www.myapplication.com/response-page?OrderTrackingId=b945e4af-80a5-4ec1-8706-e03f8332fb04&OrderMerchantReference=TEST1515111119&OrderNotificationType=CALLBACKURL
```

**IPN Details:**

Pesapal sends an alert to your IPN URL with these parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| OrderTrackingId | String | Pesapal order ID |
| OrderNotificationType | String | Value: "IPNCHANGE" |
| OrderMerchantReference | String | Your unique ID |

**Example IPN URL:**
```
https://www.myapplication.com/ipn?OrderTrackingId=b945e4af-80a5-4ec1-8706-e03f8332fb04&OrderMerchantReference=TEST1515111119&OrderNotificationType=IPNCHANGE
```

**Important:** Neither callback nor IPN calls include payment status for security. Use the GetTransactionStatus API to fetch the payment status.

---

### 5. Get Transaction Status

**Endpoint:** `GET /api/Transactions/GetTransactionStatus`

**URLs:**
- Sandbox: `https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus`
- Production: `https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus`

**Description:**
Retrieves the current status of a transaction using the order tracking ID.

**Headers:**
```json
{
    "Authorization": "Bearer {token}"
}
```

**Query Parameters:**
- `orderTrackingId`: The unique order tracking ID from Pesapal

**Usage:**
Call this endpoint when:
- Callback URL is triggered
- IPN notification is received
- You need to verify transaction status

---

## Integration Flow

1. **Authenticate**: Call `/Auth/RequestToken` to get bearer token
2. **Register IPN**: Call `/URLSetup/RegisterIPN` to register notification URL and get `ipn_id`
3. **Submit Order**: Call `/Transactions/SubmitOrderRequest` with order details
4. **Redirect Customer**: Direct customer to the `redirect_url` (iframe or full redirect)
5. **Handle Callback**: Process callback when customer returns
6. **Handle IPN**: Process IPN notifications for status changes
7. **Verify Status**: Call `/Transactions/GetTransactionStatus` to confirm payment status

## Security Best Practices

- Never expose your `consumer_key` and `consumer_secret` in client-side code
- Always validate IPN calls are from Pesapal domain
- Use HTTPS for all callback and IPN URLs
- Verify transaction status server-side before fulfilling orders
- Store tokens securely and refresh before expiry

## Testing

Use sandbox credentials and URLs for testing. Contact Pesapal for test credentials or create a sandbox merchant account.

## Support

For production credentials and merchant account setup, contact Pesapal support or visit their merchant portal.
