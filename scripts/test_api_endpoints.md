### Create new POST

```
curl -X POST "http://localhost:3000/api/modules/boards/post?boardId=YOUR_BOARD_ID" \
-H "Content-Type: application/json" \
-d '{
  "title": "Test Post Title",
  "description": "This is a hell of a description to test bad words."
}'
```
