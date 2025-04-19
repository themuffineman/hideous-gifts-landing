function loadParticles() {
  particlesJS.load("particles-js", "assets/particles.json", function () {
    console.log("callback - particles.js config loaded");
  });
}
function createSkyBackground() {
  const skyContainer = document.querySelector("#sky-model");
  const scene = new THREE.Scene();

  //the camera settings
  const camera = new THREE.PerspectiveCamera(
    75, // fov
    window.innerWidth / window.innerHeight,
    0.1, // near
    1000 // far
  );
  camera.position.set(0, 0, 5); // Set initial position further back for zooming
  camera.position.z += 1; // Adjust zoom speed

  // Add zoom functionality
  function handleScroll(event) {
    camera.position.z += 1; // Adjust zoom speed
    camera.position.z = Math.max(1, Math.min(100, camera.position.z)); // Clamp zoom range
  }
  //   window.addEventListener("wheel", handleScroll);

  camera.updateProjectionMatrix();

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  skyContainer.appendChild(renderer.domElement);

  // lighting setup
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  //   const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  //   scene.add(ambientLight);

  //   const pointLight = new THREE.PointLight(0xffffff, 1);
  //   pointLight.position.set(10, 5, 10);
  //   scene.add(pointLight);

  //   const spotLight = new THREE.SpotLight(0xffffff, 2);
  //   spotLight.position.set(0, 50, 10);
  //   spotLight.angle = 0.15;
  //   spotLight.penumbra = 1;
  //   scene.add(spotLight);

  const hemisphereLight = new THREE.HemisphereLight(0xb1e1ff, 0x000000, 1);
  scene.add(hemisphereLight);

  // State variables
  let skyModel;
  let currentRotation = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };
  let isRotating = false; // You can control this from outside if needed

  // Load sky model
  const loader = new THREE.GLTFLoader();
  loader.load(
    "./assets/sky.glb", // model path
    function (gltf) {
      skyModel = gltf.scene;
      scene.add(skyModel);
    },
    undefined,
    function (error) {
      console.error("Error loading sky model:", error);
    }
  );

  // Mouse movement handler
  async function handleMouseMove(event) {
    setTimeout(() => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      const smoothFactor = 0.5; // Adjust this value for smoother or faster transitions
      const targetX = y * 0.1;
      const targetY = x * 0.1;

      // Smoothly interpolate target rotation
      targetRotation.x += (targetX - targetRotation.x) * smoothFactor;
      targetRotation.y += (targetY - targetRotation.y) * smoothFactor;
    }, 100);
  }
  //loop
  function animate(time) {
    requestAnimationFrame(animate);

    if (skyModel) {
      // Smoothly interpolate rotation
      currentRotation.x = THREE.MathUtils.lerp(
        currentRotation.x,
        targetRotation.x,
        0.2
      );
      currentRotation.y = THREE.MathUtils.lerp(
        currentRotation.y,
        targetRotation.y,
        0.2
      );

      skyModel.rotation.x = currentRotation.x;
      skyModel.rotation.y = currentRotation.y;

      // Optional rotation if isRotating is true
      if (isRotating) {
        skyModel.rotation.y += (0.1 * (time - lastTime)) / 1000;
      }
    }

    renderer.render(scene, camera);
    lastTime = time;
  }
  let lastTime = 0;

  // Handle window resize
  function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // Event listeners
  // window.addEventListener("resize", onResize);
  window.addEventListener("mousemove", handleMouseMove);

  // Start animation
  animate(0);

  // Add to page
  document.body.prepend(skyContainer);

  // Return cleanup function (similar to React useEffect cleanup)
  return function cleanup() {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", handleMouseMove);
    skyContainer.remove();
  };
}
function animateHeroText() {
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  gsap.to(".h1-span", {
    y: "0px",
    duration: 3,
    ease: "elastic.out(0.5,0.3)",
    stagger: 0.1,
  });
  gsap.to(".hero-h2", {
    y: "-5px",
    duration: 0.8,
    delay: 0.1,
  });
}
function animateGiftModel() {
  const loader = new THREE.GLTFLoader();
  const giftContainer = document.querySelector("div#gift-model");
  const scene = new THREE.Scene();
  const confettiSound = new Audio("./assets/confetti.mp3");

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);
  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  giftContainer.appendChild(renderer.domElement);

  // Lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1);
  mainLight.position.set(5, 10, 7.5);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 3);
  fillLight.position.set(-5, 0, -5);
  scene.add(fillLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
  hemiLight.position.set(0, 25, 0);
  scene.add(hemiLight);

  // Load the gift model
  loader.load(
    "./assets/gift_box.glb", // Replace with the path to your model
    function (gltf) {
      const giftModel = gltf.scene;
      scene.add(giftModel);
      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001; // Get time in seconds
        giftModel.position.y = Math.sin(time) * 0.4; // Hover effect
        renderer.render(scene, camera);
      }
      giftModel.scale.set(0, 0, 0);
      const scaleFactor = window.innerWidth > 768 ? 1.2 : 0.8; // Larger scale for wider screens
      gsap.to(giftModel.scale, {
        x: scaleFactor,
        y: scaleFactor,
        z: scaleFactor,
        duration: 1,
        ease: "power2.out",
        // onUpdate: () => {
        //   giftModel.rotation.y += 0.2; // the spinning effect during scaling
        // },
      });
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        trigger: ".model-exit",
        start: "top center",
        onEnter: () => {
          gsap.to(giftModel.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
              confetti({
                particleCount: 800,
                spread: 150,
                origin: { y: 1 },
              });
              confettiSound.play();
            },
          });
        },
        onLeaveBack: () => {
          const scaleFactor = window.innerWidth > 768 ? 1.2 : 0.8;
          gsap.to(giftModel.scale, {
            x: scaleFactor,
            y: scaleFactor,
            z: scaleFactor,
            duration: 0.5,
            ease: "power2.out",
          });
        },
        once: false,
      });

      // Add scroll-triggered rotation
      window.addEventListener("scroll", () => {
        // Get scroll progress (0 to 1)
        const scrollProgress =
          window.scrollY / (document.body.scrollHeight - window.innerHeight);

        // Rotate the model based on scroll progress
        giftModel.rotation.y = scrollProgress * Math.PI * 4; // 4 full rotations (adjust as needed)
      });

      animate();
    },
    undefined,
    function (error) {
      console.error("Error loading gift model:", error);
    }
  );
  // Handle window resize
  function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    // Scale down the model on resize
  }

  // window.addEventListener("resize", onResize);
}
function scaleButton() {
  gsap.to(".hero-button", {
    scale: 1,
    duration: 2,
    ease: "elastic.out(0.5,0.3)",
    delay: 0.5,
  });
}
function moveHeroImages() {
  const scaleFactor = window.innerWidth < 500 ? 0.0 : 1.1; // Scale down for small screens
  gsap.to(".hero-img-1", {
    scale: scaleFactor,
    duration: 1,
    ease: "elastic.out(0.5,0.3)",
    rotate: 20,
  });
  gsap.to(".hero-img-4", {
    scale: scaleFactor,
    duration: 2,
    ease: "elastic.out(0.5,0.3)",
    rotate: -20,
  });
  gsap.to(".hero-img-2", {
    scale: scaleFactor,
    duration: 2,
    rotate: 20,
    ease: "elastic.out(0.5,0.3)",
  });
  gsap.to(".hero-img-3", {
    scale: scaleFactor,
    duration: 2.5,
    rotate: -20,
    ease: "elastic.out(0.5,0.3)",
  });
}
function heroImageScrollTrigger() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".hero-img-1", {
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
    x: "-300px",
  });
  gsap.to(".hero-img-4", {
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 2,
    },
    x: "-300px",
  });
  gsap.to(".hero-img-2", {
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
    x: "300px",
  });
  gsap.to(".hero-img-3", {
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 2,
    },
    x: "300px",
  });
}
function kidsSection() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".kids-top-image", {
    scrollTrigger: {
      trigger: ".kids-gallery",
      start: "top 30%",
      end: "bottom bottom",
      pin: true,
      scrub: true,
    },
    clipPath: "inset(0% 0% 100% 0%)",
    ease: "none",
  });
}
function adultsSection() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".adults-top-image-1", {
    scrollTrigger: {
      trigger: ".adults-gallery",
      start: "top 30%",
      end: "bottom bottom",
      pin: true,
      scrub: true,
    },
    clipPath: "inset(0% 0% 100% 0%)",
    ease: "none",
  });
}
function adultsSection2() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".adults-top-image-2", {
    scrollTrigger: {
      trigger: ".adults-gallery-2",
      start: "top 30%",
      end: "bottom bottom",
      pin: true,
      scrub: true,
    },
    clipPath: "inset(0% 0% 100% 0%)",
    ease: "none",
  });
}
function adultsSection3() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".adults-top-image-3", {
    scrollTrigger: {
      trigger: ".adults-gallery-3",
      start: "top 30%",
      end: "bottom bottom",
      pin: true,
      scrub: true,
    },
    clipPath: "inset(0% 0% 100% 0%)",
    ease: "none",
  });
}
function adultsSection4() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".adults-top-image-4", {
    scrollTrigger: {
      trigger: ".adults-gallery-4",
      start: "top center",
      end: "bottom bottom",
      pin: true,
      scrub: true,
    },
    clipPath: "inset(0% 0% 100% 0%)",
    ease: "none",
  });
}
function cardFlipSection() {
  gsap.registerPlugin(ScrollTrigger);
  const cards = document.querySelectorAll(".flip-box-inner");
  cards.forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: ".flip-box-inner",
        start: "top 20%",
        end: "bottom top",
        scrub: true,
        ease: "none",
      },
      rotateY: 180,
      stagger: 2,
    });
  });
}
function flipCardsMobile() {
  gsap.registerPlugin(ScrollTrigger);
  const cards = document.querySelectorAll(".flip-box-inner");
  cards.forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: `bottom center`,
        scrub: true,
      },
      rotateY: 180,
    });
  });
}
function pinFlipCards() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".flip-box-container", {
    scrollTrigger: {
      trigger: ".flip-box-container",
      start: "top 20%",
      end: "+=1000px",
      pin: true,
    },
  });
}
function cardsAnimation() {
  if (window.innerWidth > 768) {
    cardFlipSection();
    pinFlipCards();
  } else {
    flipCardsMobile();
  }
}
function embla() {
  function emblaBtns() {
    const addTogglePrevNextBtnsActive = (emblaApi, prevBtn, nextBtn) => {
      const togglePrevNextBtnsState = () => {
        if (emblaApi.canScrollPrev()) prevBtn.removeAttribute("disabled");
        else prevBtn.setAttribute("disabled", "disabled");

        if (emblaApi.canScrollNext()) nextBtn.removeAttribute("disabled");
        else nextBtn.setAttribute("disabled", "disabled");
      };

      emblaApi
        .on("select", togglePrevNextBtnsState)
        .on("init", togglePrevNextBtnsState)
        .on("reInit", togglePrevNextBtnsState);

      return () => {
        prevBtn.removeAttribute("disabled");
        nextBtn.removeAttribute("disabled");
      };
    };

    return (addPrevNextBtnsClickHandlers = (emblaApi, prevBtn, nextBtn) => {
      const scrollPrev = () => {
        emblaApi.scrollPrev();
      };
      const scrollNext = () => {
        emblaApi.scrollNext();
      };
      prevBtn.addEventListener("click", scrollPrev, false);
      nextBtn.addEventListener("click", scrollNext, false);

      const removeTogglePrevNextBtnsActive = addTogglePrevNextBtnsActive(
        emblaApi,
        prevBtn,
        nextBtn
      );

      return () => {
        removeTogglePrevNextBtnsActive();
        prevBtn.removeEventListener("click", scrollPrev, false);
        nextBtn.removeEventListener("click", scrollNext, false);
      };
    });
  }
  const OPTIONS = { loop: false };

  const emblaNode = document.querySelector(".embla");
  const viewportNode = emblaNode.querySelector(".embla__viewport");
  const prevBtn = emblaNode.querySelector(".embla__button--prev");
  const nextBtn = emblaNode.querySelector(".embla__button--next");

  const emblaApi = EmblaCarousel(viewportNode, OPTIONS);
  const removefunc = emblaBtns();
  const removePrevNextBtnsClickHandlers = removefunc(
    emblaApi,
    prevBtn,
    nextBtn
  );
  emblaApi.on("destroy", removePrevNextBtnsClickHandlers);
}
function modelExit() {
  gsap.to(model.rotation, {
    y: model.rotation.y + Math.PI * 2,
    duration: 1,
    ease: "power2.inOut",
    onComplete: () => {
      gsap.to(model.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(scanContainer, {
            scale: 0,
            duration: 0.5,
            ease: "power2.in",
          });
        },
      });
      confetti({
        particleCount: 800,
        spread: 150,
        origin: { y: 1 },
      });
    },
  });
}
// Wait for the entire page content
window.addEventListener("load", function () {
  // Get the loading screen element
  const loadingScreen = document.getElementById("loading-screen");

  if (loadingScreen) {
    // Add the 'hidden' class to start the fade-out transition
    loadingScreen.classList.add("hidden");

    // Optional: Completely remove the loading screen element
    // from the DOM after the transition finishes.
    // This is good practice to prevent any potential interference.
    loadingScreen.addEventListener(
      "transitionend",
      function handleTransitionEnd(event) {
        // Ensure the transition that ended is the opacity transition
        if (event.propertyName === "opacity") {
          // Check if the element still exists before trying to remove
          if (loadingScreen.parentNode) {
            loadingScreen.parentNode.removeChild(loadingScreen);
          }
          // Clean up the event listener
          loadingScreen.removeEventListener(
            "transitionend",
            handleTransitionEnd
          );
        }
      },
      { once: false }
    ); // Use { once: false } and check propertyName for robustness

    // Fallback: If transitionend doesn't fire (e.g., due to display:none interfering),
    // remove after a slightly longer delay than the transition.
    setTimeout(() => {
      if (loadingScreen.parentNode) {
        loadingScreen.parentNode.removeChild(loadingScreen);
      }
    }, 600); // 500ms transition + 100ms buffer
  } else {
    console.warn("Loading screen element not found!");
  }
});
const maxLoadTime = 20000; // 10 seconds
const timeoutId = setTimeout(() => {
  console.warn("Page load timed out. Hiding loader.");
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen && !loadingScreen.classList.contains("hidden")) {
    loadingScreen.classList.add("hidden");
  }
}, maxLoadTime);
window.addEventListener("load", () => {
  clearTimeout(timeoutId);
});
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loadParticles();
    createSkyBackground();
    animateGiftModel();
    animateHeroText();
    scaleButton();
    moveHeroImages();
    heroImageScrollTrigger();
    embla();
    kidsSection();
    adultsSection();
    adultsSection2();
    adultsSection3();
    // adultsSection4();
    // cardsAnimation();
  }, 500);
});
