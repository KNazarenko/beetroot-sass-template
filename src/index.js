document.addEventListener('DOMContentLoaded', init);

function init() {
  const d = document;
  const page = d.getElementById('homepage') || d.getElementById('about');
  const id = page.getAttribute('id');

  switch (id) {
    case 'homepage': {
      console.log('Hello, from Homepage');
      break;
    }
    case 'about': {
      console.log('Hello, from About page');
      break;
    }
    default: {
      // ...
    }
  }
}
