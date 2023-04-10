## File Sharing Web App - Backend (Nestjs)
.
.
## How to run

1. Clone the repository in your local computer

1. Go to the root directory

1. Run npm install (be sure that you have npm and node installed in your pc)

1. Create an `.env` file and put the information according to `.env.example`

1. Now Run `npm run start:dev`
.
.
### Example .env
```
#Configurable Options
FOLDER="uploads"
TIMEZONE="Asia/Dhaka"
DOWNLOAD_LIMIT=5  #chose any intiger number
DOWNLOAD_LIMIT_DURATION="1MIN"
JWT_SECRET="anyarbitratrylongtext"

#DB Settings
DATABASE_HOST="yourdbhost"
DATABASE_PORT=3306 #we are using mysql
DATABASE_USER="yourdbuser"
DATABASE_PASSWORD="yourdbpassword"
DATABASE_NAME="yourdbname"

#AWS settings
AWS_ACCESS_KEY="aws_access_key"
AWS_SECRET_ACCESS="aws_secret_access"
AWS_PUBLIC_BUCKET_NAME='public bucket name including subfolder'
AWS_ELASTICACHE_ENDPOINT="aws elasticache endpoint"
```  
.
.
.
## API documentation

  .
  .
  .

### File Upload (with simple string keypair)

Endpoint: `/files`

Method: `POST`

Request Body (form data):

|key| value  |
|--|--|
| storage_location | `onserver` or `cloud` |
| file | select file from your machine |


Response Body (sample):

```json
{
"publickey":  "688a81cc7afb9709",
"privatekey":  "52682f7de378f4b8"
}
```
.
.
.
### File Upload (with rsa keypair): [not recommended]

Endpoint: `/filesRSA`

Method: `POST`

Request Body (form data):

|key| value  |
|--|--|
| storage_location | `onserver` or `cloud` |
| file | select file from your machine |

Response Body (sample):

```json
{
    "publickey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2JT1X7RF2MBPHJh5JiHwXkUMO91tTvzPCcLD31ejqkJhnaY7cMs77YcB6D5sujkxuVpqUOs6IGXtoIuDmWnnTVwugV3wTsgcM3UyipKueMGkwZbHw0l4MzBkyxFvDa8Wmk1f+yLxLkHZgJJsK5IjSLoMZ66niwZ2wwWNlGPkMhJbN/iNOEP8H80si3JTkxQ5d1skqB79iRThlSLjScr+L1ylVF81rUmLdrEeGZ9gzzw5sI84kfsazCsKB1i2c8iD7SIprXqAfgpSo9J7olHOIIZUtZ6DrUewc+hCo9wAo/D9SE32ZVbmzpqNCuClMOYR7BN4L/d60WeAHjlDM0adsQIDAQAB",
    "privatekey": "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDYlPVftEXYwE8cmHkmIfBeRQw73W1O/M8JwsPfV6OqQmGdpjtwyzvthwHoPmy6OTG5WmpQ6zogZe2gi4OZaedNXC6BXfBOyBwzdTKKkq54waTBlsfDSXgzMGTLEW8NrxaaTV/7IvEuQdmAkmwrkiNIugxnrqeLBnbDBY2UY+QyEls3+I04Q/wfzSyLclOTFDl3WySoHv2JFOGVIuNJyv4vXKVUXzWtSYt2sR4Zn2DPPDmwjziR+xrMKwoHWLZzyIPtIimteoB+ClKj0nuiUc4ghlS1noOtR7Bz6EKj3ACj8P1ITfZlVubOmo0K4KUw5hHsE3gv93rRZ4AeOUMzRp2xAgMBAAECggEAFJzYsusYBVuy1n3hydyhC9fLz5wbXdEhw0QOGvY0VW1L7RJ3xccR77anBSYrzZgelg13i4wCVDhfN/sPOKKjqPEvsTryNrfvjIDdoTf58vQ7F1GfttkJ35VTgnV+TvHDAkcq7gk9UFxkCaCQkEpa9qj+VT/Xd5vTNxcS38nssKHHGtcSL+NtEI4iiJxuOPqNQbC6l9SN4/AzaQplPjMuqPCwITfW8N/liaZ6CAOPGRUBXWanUw7iVw9L2N5xD5LZ4K59v2JNCo77KAHMNq3pzLUq1yFzFaBG8/klTkf4kSas1Zdx7RURdJFSrF3u1djHQlEUdxLR3+arV90wT16nIQKBgQDylNcWIejNqZZ0MTgMsoZrf86rSOKisKZ/RRB6nD1ykJkZ/rTZRMtqPWZQhiIq9I3b4pudtJWSjyAUJyrZiyPhJlSP+WGeet2hzK0vMo7xJ2nrM4P492X1zIPA1+KKMKIC6hZd5LinL8zf/+e5TsZtAero2JqbKNLLlRtm3bEJjwKBgQDkj/FSBumW7l3Godl2e/BhcFpjyaeZNfqBPFoPA+Prb/JYJNpK+f9YGntbQ7DMC8O3yCZp+wVvCk0Otra0KnrgXEtr0oWaO9Aw78mEWFyCWgPqCxEJ0W8q4g2Na/2PP8oUrfBdUujz0JkP+DtVrJ6BG4F7alOkHccjI4bQi7HEvwKBgCE+Hl+NFA8i/1g66nhq+pq+r/6vBUfQN3DXcROsV4tcn259hiEEGXAcq+m7B/GlA8+vNS4eciTcckPwviGDvM3857e3MBZ8teSXXOBL6GTJxu0RaTN0C8fsV93Ud9oCIiGOHLSPRHK8zTGhKwss7WpAygVQsZczt/doHpIxLTKnAoGARVbN1R63uswxstLjECjlcgoNwfwpVjej+ZT/lVKO0Jwznz3+44QYTPgruDI+7ogbJiQYU0qOCXPMkMwpfVrt0Cbv0pQZaAMBU/dK4VWVKw535YbZ8mqRGSdfCSpb0BuACOoD46wFdAIyjT+3cHRf2bcofvJw0XcfNK/QdHAMzC0CgYEAqRvHtGqRZeytsZvoQKmPj0xFpgz1r4V5OGBgffrWfPshOSvAqC4LIYV86EdPaXZ+6Ul+3R/6cEhI38QEy87NiQGyk4h16dNb0gYj2EVfx02Xbed3mdq/+ChfGbt6VuXK9M5av90LSGhzo1/A7AG3rw9HXZdbnc01dJY5M1xdA7s="
}
```
.
.
.
### File Download

Endpoint: `/files/:publickey`

Method: `GET`

Response Body (sample):

**Note: If you want to provide an RSA public key in the url path it must need to be url encoded**. You can encode it online from this  site: https://www.urlencoder.io/

```json
The file will be downloaded automatically
```
.
.
.
### File Deletion

Endpoint: `/files/:privatekey`

Method: `DELETE`

Response Body (sample):

**File deletion with RSA private key has some problem as of now.** So I recommend always use Simple KeyPair while uploading as there is no encryption happening inside the code**

```json
{
"status_code":  200,
"message":  "File has successfully been deleted!"
}
```
