// Test script to simulate frontend create listing request
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

async function testCreateListing() {
  try {
    const formData = new FormData();
    formData.append('title', 'Test från frontend simulation');
    formData.append('description', 'Test för att se vad som händer');
    formData.append('price', '1500');
    formData.append('amenities', JSON.stringify(['Wifi', 'Kök']));
    formData.append('keepImageIds', JSON.stringify([]));
    
    // Add an image
    const imageBuffer = fs.readFileSync('/Users/nm/Desktop/RentRight/backend/uploads/1777897833519-_--1-.jpeg');
    formData.append('images', imageBuffer, {
      filename: 'test.jpg',
      contentType: 'image/jpeg'
    });

    console.log('Skickar request...');
    
    const response = await fetch('http://localhost:3002/api/v1/listnings', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log('Status:', response.status);
    console.log('Headers:', response.headers.raw());
    
    const result = await response.json();
    console.log('Response:', result);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testCreateListing();
