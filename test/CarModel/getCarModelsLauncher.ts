import { handler } from "../../src/infrastructure/web/routes/CarModel/handler";

handler(
  {
    httpMethod: "GET",
    headers: {
      idtoken:
        "eyJraWQiOiJTRFkxQmN5UklUdytUdURjZ1pJNng3bjgrTkhMd2gzdmFwaDd1MFF0eitjPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoieVNtcU5PM2otdDVGS1pCMzh0Qk91ZyIsInN1YiI6IjFjMTI0YjY0LWU0YWUtNGE1YS04MzA1LTQzN2U5YmU4MThiYyIsImNvZ25pdG86Z3JvdXBzIjpbImFkbWluLXVzZXItZ3JvdXAiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1BscU1haHg3WSIsInBob25lX251bWJlcl92ZXJpZmllZCI6dHJ1ZSwiY29nbml0bzp1c2VybmFtZSI6IjFjMTI0YjY0LWU0YWUtNGE1YS04MzA1LTQzN2U5YmU4MThiYyIsImdpdmVuX25hbWUiOiJBbcOtbGNhciBBbGVqYW5kcm8iLCJvcmlnaW5fanRpIjoiMTQ1NmI2ZGUtMmRhYi00ZjQ2LWE2NzMtMTU0MDA2MzRlY2RkIiwiYXVkIjoiN2wwc21sajA1MGg0c3YwOTljdDd1cmhuaTIiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcxMDk5MDczMiwicGhvbmVfbnVtYmVyIjoiKzUyMzMxMzYxMjczNSIsImV4cCI6MTcxMDk5NDMzMiwiaWF0IjoxNzEwOTkwNzMyLCJmYW1pbHlfbmFtZSI6IlPDoW5jaGV6IFNvbHRlcm8iLCJqdGkiOiJjNGI5ZThmNi1mODFiLTQzN2QtOGQ5OS1kM2Q2YWEwNDNkMzciLCJlbWFpbCI6ImFtaWxjYXIuc2FuY2hlekBldm9tb3RvcnMuY29tLm14In0.KRNoYa5l3Y9K9cK4LKDhS-r85gvGi3jrADZ7B_SE3gtvdMBCieY_NXJlbWR5vEcoH0OltDtv-btL8DLGOxCijLq43kds_29mcjDqIRGqBRcHpAtXvxpBiXZjIx4drCI4rNDdsaKYQb681EPQZ1zB43LJBDRm43AV9uFQMq2H3LVnU7CORfsLqDg3zx7F_6XkwwUw36d_RsAMOx2-szQ-ObNE7amm-GvQEbU3jgzkTAxIel5sVECttLHjfQZKq0979ECKiN59dLrDC4DYE9gx_dmd4tmXKJ7Pr2KcL-BC8Z1DvNG0DVDtw5oW5mrnNv1Zk5O6wxlf2DLGwwhqg1m7Yw",
      Authorization:
        "eyJraWQiOiI1ek5uNTNoeDlYZnVrRlRUZE9YS3p0YXdSQmFIeFpEQ0dmdkdGZFNwekNVPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxYzEyNGI2NC1lNGFlLTRhNWEtODMwNS00MzdlOWJlODE4YmMiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbi11c2VyLWdyb3VwIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1BscU1haHg3WSIsInZlcnNpb24iOjIsImNsaWVudF9pZCI6IjdsMHNtbGowNTBoNHN2MDk5Y3Q3dXJobmkyIiwib3JpZ2luX2p0aSI6IjY1ZWMxOWUxLTNjNTItNDA0NS1hMzQyLWI4MzQ4MWRiZTc4NiIsImV2ZW50X2lkIjoiNWFhNTRmNjYtNjRiOC00NDM2LWI2OGMtMmQwN2ZmYjliYTgzIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiBwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTcyOTg5NjY4OCwiZXhwIjoxNzI5OTAwMjg4LCJpYXQiOjE3Mjk4OTY2ODgsImp0aSI6ImRjMDA0MjgyLWU5NTEtNDBmYy04MjczLTJjYzQ1Nzg1N2RkZiIsInVzZXJuYW1lIjoiMWMxMjRiNjQtZTRhZS00YTVhLTgzMDUtNDM3ZTliZTgxOGJjIn0.MNqMZwPAFOwmww_nmhK1Qw0CuFErFiDDjR_7iRJabHa7kHYH8xecR5FbYx5YBFrgLoPLLYHlnvzvS7eDq0qpP7c7HE2g1FFE1Pw8zAunvkuQHgFZluu1iDcXYocteK0bEL1Rp_AdVxGfZ-K4oYHcl-xJwk6N2kZCbN_Y4X32Iy0FZdaDcygYz3938WyrJNegzz_siCxOpe10cpk2gl2xjWQnr_q8k6oZlOTxDIBhVUmLu4qV78NVmnP9aRDE6ElS6ocEGL0wHsMZEcaQ8yqx_FRS3vaDJhUY8wf5ty5H4d80KW1pOYUdqh6yq-fu-zRzJrO-tO3qOtPzKyKaDcFHYA",
    },
    requestContext: {
      http: {
        method: "GET",
      },
    },
  } as any,
  {} as any,
);
