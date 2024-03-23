import { handler } from "../../src/infrastructure/web/routes/Brand/handler";

handler(
  {
    httpMethod: "POST",
    headers: {
      IdToken:
        "eyJraWQiOiJTRFkxQmN5UklUdytUdURjZ1pJNng3bjgrTkhMd2gzdmFwaDd1MFF0eitjPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiR0JCWVFESy1lajJiVHpfX3draXY0ZyIsInN1YiI6IjFjMTI0YjY0LWU0YWUtNGE1YS04MzA1LTQzN2U5YmU4MThiYyIsImNvZ25pdG86Z3JvdXBzIjpbImFkbWluLXVzZXItZ3JvdXAiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1BscU1haHg3WSIsInBob25lX251bWJlcl92ZXJpZmllZCI6dHJ1ZSwiY29nbml0bzp1c2VybmFtZSI6IjFjMTI0YjY0LWU0YWUtNGE1YS04MzA1LTQzN2U5YmU4MThiYyIsImdpdmVuX25hbWUiOiJBbcOtbGNhciBBbGVqYW5kcm8iLCJvcmlnaW5fanRpIjoiMWE4ODZjMjQtM2Q3OS00NjFmLWE0YjctZGUyYjllZWQ2MDU2IiwiYXVkIjoiN2wwc21sajA1MGg0c3YwOTljdDd1cmhuaTIiLCJldmVudF9pZCI6IjhiNGE0OWZjLWNhNDAtNDAyNS04YzBlLWZiNWJjNWNkYWFiOCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzEwOTk0NTQwLCJwaG9uZV9udW1iZXIiOiIrNTIzMzEzNjEyNzM1IiwiZXhwIjoxNzEwOTk4MTQwLCJpYXQiOjE3MTA5OTQ1NDAsImZhbWlseV9uYW1lIjoiU8OhbmNoZXogU29sdGVybyIsImp0aSI6Ijg0MmI1ZmIxLWZjZTgtNGYyYi05M2ZiLTYxZmJkYjhlNGZiYyIsImVtYWlsIjoiYW1pbGNhci5zYW5jaGV6QGV2b21vdG9ycy5jb20ubXgifQ.1o9g6VE5nuc645K-LPmBetKgXCM8XaBIDJNdluLkO3i9tjbJuhtZmC8dhpoQJZV5ZPtgcJkTbicGCkhjZoaEj7uK4-vzFMnfe-niqYorMUGf0DUp8t9HnUkqA6I98y2sc4_7MZyGmhAMdKFifNH0Cdm7SxwDCgQapsTbzZgSsPud-BUkDG-YqWg6pOgEb0iUs4WDxpj0UMFcEv8LQ2CbllJImuyMuqzOdfPkmq1DL35OjNka_Lz-RcVgORUNmrlMb63LALBngy0WMfMdl63DjjoS9rVnGxQ8VJI6b0UC5p5164Rum4L96vQehRlrPk8lNze2l5EpxboP58x9BRsHRQ",
      Authorization:
        "eyJraWQiOiI1ek5uNTNoeDlYZnVrRlRUZE9YS3p0YXdSQmFIeFpEQ0dmdkdGZFNwekNVPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxYzEyNGI2NC1lNGFlLTRhNWEtODMwNS00MzdlOWJlODE4YmMiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbi11c2VyLWdyb3VwIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1BscU1haHg3WSIsInZlcnNpb24iOjIsImNsaWVudF9pZCI6IjdsMHNtbGowNTBoNHN2MDk5Y3Q3dXJobmkyIiwib3JpZ2luX2p0aSI6IjFhODg2YzI0LTNkNzktNDYxZi1hNGI3LWRlMmI5ZWVkNjA1NiIsImV2ZW50X2lkIjoiOGI0YTQ5ZmMtY2E0MC00MDI1LThjMGUtZmI1YmM1Y2RhYWI4IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiBwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTcxMDk5NDU0MCwiZXhwIjoxNzEwOTk4MTQwLCJpYXQiOjE3MTA5OTQ1NDAsImp0aSI6IjI4YTAyYmQzLTJhOWItNDc5OC1iOTM3LTg0MjYxZTRjODg4YyIsInVzZXJuYW1lIjoiMWMxMjRiNjQtZTRhZS00YTVhLTgzMDUtNDM3ZTliZTgxOGJjIn0.mNOQE5Kr1AS4QiARRbPwlkFsX3NcAt5WdCHdvTG9sr8Zng7Ss41qYrmSijupXotEFyc1kvRIamYyzNWGk_0qflKJnbE3BFqjvMDjMsgbI_BLWLt1fp1UnXaY-Rax6Dc5nsGG9Ki1Yo4yQU17DCO5tQF75jKkjbjqWKIZDkyvxRnAIJ09rL4-tH0Vgsi4xX0t0wxyn1xlaQ1WZcvq8eijeBhHm-vKU0qlPfGTXrrUnR83cQa1w-b7QK8swRrEo8IiDYLJCDG-_Bp7h5t93Zf5WImIDMDjbgouRLjZjWkvpg2nCHTEAbUnMzR8bj9yDeULLQAXWFrSUHsctWbw1PBxrg",
    },
    body: JSON.stringify({
      name: "Audi",
    }),
  } as any,
  {} as any,
);