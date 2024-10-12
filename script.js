const toggleButton = document.getElementById('dark-mode-toggle');
const darkModeIcon = document.getElementById('dark-mode-icon');

// Check for saved user preference in local storage
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.body.classList.toggle('dark-mode', currentTheme === 'dark');
    darkModeIcon.classList.toggle('fa-sun', currentTheme === 'dark');
    darkModeIcon.classList.toggle('fa-moon', currentTheme !== 'dark');
}

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeIcon.classList.toggle('fa-sun');
    darkModeIcon.classList.toggle('fa-moon');
    // Save preference to local storage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});