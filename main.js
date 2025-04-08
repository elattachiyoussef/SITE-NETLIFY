document.addEventListener('DOMContentLoaded', function() {
    // Récupérer tous les liens de navigation
    const navLinks = document.querySelectorAll('.main-nav a, .floating-nav a');
    
    // Ajouter la classe active au lien correspondant à la page courante
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
        
        // Ajouter un événement click pour gérer l'état actif
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}); 