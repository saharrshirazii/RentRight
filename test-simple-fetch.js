// Test simple fetch from frontend context
fetch('http://localhost:3002/api/v1/listnings', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Simple test',
    description: 'Test description',
    price: 1000,
    amenities: ['Wifi'],
    images: []
  })
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Success:', data);
})
.catch(error => {
  console.error('Error:', error);
});
