document.addEventListener('DOMContentLoaded', (event) => {
  
  console.log('PEPEGA')
  var navBar = document.getElementById('navBar');
  
  window.onscroll = (e) => {
    if (window.pageYOffset > 20) {
        navBar.style.backgroundColor = '#FFF';
    } else if (window.pageYOffset <= 20) {
        // navBar.style.backgroundColor = 'rgba(255,255,255,0)';
    }
  }
})