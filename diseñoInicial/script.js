// 1. Inicializar Iconos Lucide
lucide.createIcons();

// 2. Navbar Scroll Effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
        navbar.classList.remove('bg-transparent');
    } else {
        navbar.classList.remove('navbar-scrolled');
        navbar.classList.add('bg-transparent');
    }
});

// 3. Menú Móvil
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if(mobileBtn){
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });
}