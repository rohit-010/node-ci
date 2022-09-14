// Temporary file 

fetch('/api/post', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  credentials: 'same-origin',
  body: JSON.stringify({
    title: 'My title',
    content: 'My content'
  })
})