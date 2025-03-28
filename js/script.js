const menuButton = document.getElementById('menu-button');
const closeMenuButton = document.getElementById('close-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden');
}

menuButton.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMobileMenu();
});

closeMenuButton.addEventListener('click', toggleMobileMenu);

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
});

document.addEventListener('click', (event) => {
    if (mobileMenu.classList.contains('active') && !mobileMenu.contains(event.target) && event.target !== menuButton) {
        toggleMobileMenu();
    }
});

function updateActiveNavLink() {
    let currentSectionId = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('ativo');
        if (link.getAttribute('href').slice(1) === currentSectionId) {
            link.classList.add('ativo');
        } else {
             link.classList.remove('ativo');
        }
    });
    mobileMenuLinks.forEach(link => {
        link.classList.remove('ativo');
        if (link.getAttribute('href').slice(1) === currentSectionId) {
            link.classList.add('ativo');
        }else {
            link.classList.remove('ativo');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let nome = document.getElementById('nome').value.trim();
    let email = document.getElementById('email').value.trim();
    let mensagem = document.getElementById('mensagem').value.trim();
    let hasErrors = false;

    document.getElementById('nome-error').style.display = 'none';
    document.getElementById('email-error').style.display = 'none';
    document.getElementById('mensagem-error').style.display = 'none';

    if (nome === '') {
        document.getElementById('nome-error').textContent = 'Por favor, preencha o seu nome.';
        document.getElementById('nome-error').style.display = 'block';
        hasErrors = true;
    }

    if (email === '') {
        document.getElementById('email-error').textContent = 'Por favor, preencha o seu email.';
        document.getElementById('email-error').style.display = 'block';
        hasErrors = true;
    } else if (!isValidEmail(email)) {
        document.getElementById('email-error').textContent = 'Por favor, insira um email válido.';
        document.getElementById('email-error').style.display = 'block';
        hasErrors = true;
    }

    if (mensagem === '') {
        document.getElementById('mensagem-error').textContent = 'Por favor, preencha a sua mensagem.';
        document.getElementById('mensagem-error').style.display = 'block';
        hasErrors = true;
    }

    if (!hasErrors) {
        let formData = new FormData(this);

        fetch('enviar_email.php', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao enviar a mensagem.');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('form-message').textContent = data;
                document.getElementById('form-message').style.color = 'green';
                this.reset();
            })
            .catch(error => {
                document.getElementById('form-message').textContent = error.message;
                document.getElementById('form-message').style.color = 'red';
            });
    }
});

function isValidEmail(email) {
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
}
