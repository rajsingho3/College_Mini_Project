// Load the Google API client library
function loadGapiClient() {
  var script = document.createElement('script');
  script.src = 'https://apis.google.com/js/platform.js';
  script.onload = initClient;
  document.head.appendChild(script);
}

// Initialize the Google API client
function initClient() {
  gapi.load('auth2', function() {
    gapi.auth2.init({
      client_id: '33157572429-io4s5e7oj3p42i9evbrc0g6k8n7isj1t.apps.googleusercontent.com',
    });
  });
}

// Attach the click event to the Google Sign-Up button
document.getElementById('google-signup-btn').addEventListener('click', function() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signIn().then(function(googleUser) {
    // Get the ID token
    var id_token = googleUser.getAuthResponse().id_token;
    
    // Send the ID token to your server
    fetch('/google-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: id_token }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
});

// Function to handle sign-in success
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  document.getElementById('user-image').src = profile.getImageUrl();
  document.getElementById('user-name').innerText = profile.getName();
  document.getElementById('user-email').innerText = profile.getEmail();
  document.getElementById('user-details').style.display = 'block';
  document.querySelector('.g-signin2').style.display = 'none';
}

// Function to handle sign-out
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    document.getElementById('user-details').style.display = 'none';
    document.querySelector('.g-signin2').style.display = 'block';
  });
}

// Load the client library on window load
window.onload = function() {
  loadGapiClient();
};