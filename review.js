document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('review-form');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const formData = {
        name: form.name.value,
        email: form.email.value,
        rating: form.rating.value,
        review: form.review.value,
      };
  
      try {
        const response = await fetch('/submit-review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          alert('Review submitted successfully!');
          form.reset();
        } else {
          alert('Failed to submit review.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the review.');
      }
    });
  });