document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // GSAP Mouse Follower Rope Effect
    const followers = document.querySelectorAll('.mouse-follower');
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    // Set initial styles for each dot
    followers.forEach((dot, i) => {
        const scale = 1 - (i * 0.08);
        const opacity = 1 - (i * 0.1);
        gsap.set(dot, {
            scale: scale,
            opacity: 0,
            xPercent: -50,
            yPercent: -50
        });
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Show dots on first move
        gsap.to(followers, { opacity: (i) => 1 - (i * 0.1), duration: 0.5, overwrite: 'auto' });
    });

    // Smooth follow logic using GSAP Ticker
    gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - 0.35, gsap.ticker.deltaRatio());

        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;

        followers.forEach((dot, i) => {
            // Each dot follows the previous one with increasing lag
            const lag = 0.15 + (i * 0.05);
            gsap.to(dot, {
                x: mouse.x,
                y: mouse.y,
                duration: lag,
                ease: "power2.out"
            });
        });
    });

    document.addEventListener('mouseleave', () => {
        gsap.to(followers, { opacity: 0, duration: 0.5 });
    });

    document.addEventListener('mouseenter', () => {
        gsap.to(followers, { opacity: (i) => 1 - (i * 0.1), duration: 0.5 });
    });

    // Animate Text (Typewriter/Reveal) Logic
    // Specialities Interaction Logic
    const specialitiesData = {
        'ti-gerenciado': {
            title: 'TI Gerenciado',
            subtitle: 'Gestão Integral de Infraestrutura',
            features: [
                'Monitoramento 24/7 de todos os ativos de rede',
                'Suporte preventivo e corretivo ilimitado',
                'Gestão de patchs e atualizações críticas',
                'Relatórios mensais de saúde do ambiente'
            ]
        },
        'backup': {
            title: 'Backup Nuvem',
            subtitle: 'Segurança e Continuidade de Dados',
            features: [
                'Backup automatizado e criptografado',
                'Retenção personalizada conforme sua necessidade',
                'Recuperação rápida em caso de ransomware',
                'Armazenamento em datacenters globais'
            ]
        },
        'antivirus': {
            title: 'Antivírus',
            subtitle: 'Proteção de Endpoint Enterprise',
            features: [
                'Proteção contra ameaças zero-day',
                'Firewall de host e controle de dispositivos',
                'Análise comportamental baseada em IA',
                'Console de gerenciamento centralizado'
            ]
        },
        'recovery': {
            title: 'Recovery',
            subtitle: 'Disaster Recovery as a Service',
            features: [
                'Planejamento de continuidade de negócios',
                'Testes de restauração periódicos',
                'Replicação de servidores em tempo real',
                'RTO e RPO definidos por aplicação'
            ]
        }
    };

    const specialityItems = document.querySelectorAll('.speciality-item');
    const displayTitle = document.getElementById('display-title');
    const displaySubtitle = document.getElementById('display-subtitle');
    const displayFeatures = document.getElementById('display-features');
    const specialityGlow = document.querySelector('.speciality-glow');
    const displayWrapper = document.getElementById('display-content-wrapper');

    function updateSpecialityDisplay(id) {
        const data = specialitiesData[id];
        if (!data) return;

        // Transition content
        gsap.to(displayWrapper, {
            opacity: 0,
            x: 20,
            duration: 0.3,
            onComplete: () => {
                displayTitle.innerText = data.title;
                displaySubtitle.innerText = data.subtitle;

                // Clear and rebuild features
                displayFeatures.innerHTML = '';
                data.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.className = 'flex items-center gap-4 text-zinc-300';
                    li.innerHTML = `
                        <div class="w-1.5 h-1.5 rounded-full bg-[#ef233c]"></div>
                        <span class="text-sm uppercase tracking-wider">${feature}</span>
                    `;
                    displayFeatures.appendChild(li);
                });

                gsap.fromTo(displayWrapper,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
                );

                // Stagger features reveal
                gsap.fromTo('#display-features li',
                    { opacity: 0, x: -10 },
                    { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "power2.out" }
                );
            }
        });

        // Glow effect pulse
        gsap.fromTo(specialityGlow,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1.1, duration: 0.8, yoyo: true, repeat: 1, ease: "power2.inOut" }
        );
    }

    specialityItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;

            // Remove active from others
            specialityItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const id = item.getAttribute('data-speciality');
            updateSpecialityDisplay(id);
        });

        // Spotlight effect
        item.addEventListener('mousemove', e => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    // Responsive Line Split Animation
    gsap.registerPlugin(ScrollTrigger);

    const splitElements = document.querySelectorAll('.reveal-type');

    splitElements.forEach(element => {
        const text = element.innerText;
        element.innerHTML = '';

        // Split text into words
        const words = text.split(' ');
        words.forEach(word => {
            const span = document.createElement('span');
            span.innerHTML = word + '&nbsp;';
            span.style.display = 'inline-block';
            span.classList.add('reveal-word');
            element.appendChild(span);
        });

        // Animate words on scroll
        gsap.from(element.querySelectorAll('.reveal-word'), {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                end: "bottom 70%",
                scrub: 1,
            },
            opacity: 0.2,
            y: 20,
            stagger: 0.05,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Horizontal Scroll Gallery Animation
    const horizontalSection = document.querySelector('.horizontal-gallery-wrapper');
    const scrollContainer = document.querySelector('.horizontal-scroll-container');

    if (horizontalSection && scrollContainer) {
        gsap.to(scrollContainer, {
            x: () => -(scrollContainer.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: horizontalSection,
                pin: true,
                start: "top top",
                end: () => "+=" + (scrollContainer.scrollWidth - window.innerWidth),
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });
    }
    // Preloader Animation
    const preloader = document.getElementById('preloader');
    const percentageEl = document.getElementById('preloader-percentage');
    const progressEl = document.getElementById('preloader-progress');
    const loaderLogo = document.getElementById('loader-logo');

    const loaderTimeline = gsap.timeline();

    loaderTimeline.to(loaderLogo, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    }).to(percentageEl, {
        opacity: 0.1,
        duration: 0.5
    }, "-=0.5");

    let count = { val: 0 };
    gsap.to(count, {
        val: 100,
        duration: 3,
        ease: "power2.inOut",
        onUpdate: () => {
            const rounded = Math.floor(count.val);
            percentageEl.innerText = rounded;
            progressEl.style.width = rounded + "%";
        },
        onComplete: () => {
            gsap.to(preloader, {
                yPercent: -100,
                duration: 1.5,
                ease: "power4.inOut",
                delay: 0.2,
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.classList.remove('overflow-hidden');
                }
            });

            // Subtle entrance for the logo and elements already present
            const mainTl = gsap.timeline();

            mainTl.to("#main-nav", {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out"
            }, "+=0.2")
                .to(".hero-title", {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.8")
                .to(".hero-subtitle", {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.6")
                .to(".hero-cta", {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.6");
        }
    });

    // Smooth Scroll for Anchors
    gsap.registerPlugin(ScrollToPlugin);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            if (target === '#') return;

            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: target,
                    offsetY: 80 // Offset for the fixed header
                },
                ease: "power4.inOut"
            });
        });
    });

    // Smooth Scroll for Logo/Home click
    const logoBtn = document.querySelector('[onclick="window.scrollTo(0,0)"]');
    if (logoBtn) {
        logoBtn.removeAttribute('onclick');
        logoBtn.addEventListener('click', () => {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: 0,
                ease: "power4.inOut"
            });
        });
    }

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        const toggleMenu = () => {
            const isOpen = mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            if (isOpen) {
                document.body.style.overflow = 'hidden';
                // Premium stagger entrance with blur
                gsap.fromTo('.mobile-link', 
                    { y: 50, opacity: 0, filter: 'blur(10px)', scale: 0.8 }, 
                    { 
                        y: 0, 
                        opacity: 1, 
                        filter: 'blur(0px)', 
                        scale: 1,
                        duration: 0.8, 
                        stagger: 0.1, 
                        ease: "power4.out", 
                        delay: 0.3 
                    }
                );
            } else {
                document.body.style.overflow = '';
                // Smoothly fade out links when closing
                gsap.to('.mobile-link', {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    ease: "power2.in"
                });
            }
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.getAttribute('href');
                
                if (target.startsWith('#')) {
                    e.preventDefault();
                    
                    // Close menu smoothly
                    mobileMenuBtn.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';

                    // Scroll to section
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: {
                            y: target,
                            offsetY: 80
                        },
                        ease: "power4.inOut"
                    });
                }
            });
        });
    }
});
