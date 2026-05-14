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
    const serviceData = [
        {
            tag: "[ TI Gerenciado ]",
            title: "Suporte de TI Gerenciado",
            desc: "Somos responsáveis por gerenciar, monitorar e manter a infraestrutura e os sistemas de TI do cliente, garantindo que tudo funcione de maneira eficiente e segura."
        },
        {
            tag: "[ Cloud Backup ]",
            title: "Backup em Nuvem",
            desc: "Garantimos a proteção e disponibilidade dos dados críticos com soluções de backup automatizadas em nuvem."
        },
        {
            tag: "[ Managed AV ]",
            title: "Antivírus Gerenciado",
            desc: "Protegemos os sistemas contra vírus, malwares e outras ameaças cibernéticas com nossa solução de antivírus gerenciado."
        },
        {
            tag: "[ Recovery ]",
            title: "Disaster Recovery",
            desc: "Solução que permite a recuperação da infraestrutura de tecnologia e sistemas vitais de sua empresa, em consequência de desastres."
        }
    ];

    let serviceIndex = 0;
    const tagEl = document.getElementById('service-tag');
    const titleEl = document.getElementById('service-title');
    const descEl = document.getElementById('service-desc');

    // Initialize GSAP TextPlugin
    gsap.registerPlugin(TextPlugin);

    function updateService() {
        serviceIndex = (serviceIndex + 1) % serviceData.length;
        const data = serviceData[serviceIndex];

        // Fade out current content
        const tl = gsap.timeline();

        tl.to([tagEl, titleEl, descEl], {
            opacity: 0,
            y: -10,
            duration: 0.4,
            stagger: 0.1,
            onComplete: () => {
                // Set new content via TextPlugin
                gsap.set([tagEl, titleEl, descEl], { y: 10 });

                gsap.to(tagEl, {
                    duration: 0.5,
                    text: data.tag,
                    opacity: 1,
                    y: 0
                });

                gsap.to(titleEl, {
                    duration: 0.8,
                    text: data.title,
                    opacity: 1,
                    y: 0,
                    delay: 0.2
                });

                gsap.to(descEl, {
                    duration: 1.2,
                    text: data.desc,
                    opacity: 1,
                    y: 0,
                    delay: 0.4,
                    ease: "none"
                });
            }
        });
    }

    setInterval(updateService, 6000);

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
});
