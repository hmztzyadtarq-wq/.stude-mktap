// إعداد المشهد والكاميرا والرندر
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 200;

// إضاءة
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(50,50,50);
scene.add(light);

// تحميل الخط
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
  const textGeo = new THREE.TextGeometry("Tech Roots Market", {
    font: font,
    size: 20,
    height: 5,
  });
  const material = new THREE.MeshPhongMaterial({color: 0xff69b4});
  const textMesh = new THREE.Mesh(textGeo, material);
  scene.add(textMesh);

  // نبدأ الحروف موزعة في دائرة (تورنيدو)
  textMesh.geometry.computeBoundingBox();
  const centerOffset = -0.5 * (textMesh.geometry.boundingBox.max.x - textMesh.geometry.boundingBox.min.x);
  textMesh.position.x = centerOffset;
  textMesh.position.y = 0;

  // GSAP Timeline
  gsap.timeline()
    .from(textMesh.rotation, { y: Math.PI * 4, duration: 2, ease: "power2.inOut" })
    .from(textMesh.position, { z: -500, duration: 2, ease: "power2.inOut" }, "<")
    .to(textMesh.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1, ease: "bounce.out" })
    .to(textMesh.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
});

// رندر مستمر
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
// التحقق من كلمة السر
if (localStorage.getItem('siteAuth') !== 'true') {
    window.location.href = 'index.html';
}

let studyMinutes = 30;
let totalSeconds = studyMinutes * 60;
let timerInterval = null;

function updateDisplay() {
    let mins = Math.floor(totalSeconds / 60);
    let secs = totalSeconds % 60;
    document.getElementById('timerDisplay').innerText = 
        (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
}

// دالة تغيير الأنظمة
function changeRemoteMode(study, breakTime, modeId) {
    studyMinutes = study;
    totalSeconds = study * 60;
    
    // تغيير شكل الزرار النشط
    document.querySelectorAll('.pomo-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    resetTimer();
}

// تشغيل العداد محلياً فوراً
function sendTimerCommand(command) {
    if (command === 'start') {
        if (timerInterval !== null) return;
        timerInterval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                alert('عاش يا وحوش! وقت المذاكرة خلص.. خدوا بريك ☕');
            }
        }, 1000);
    } else {
        resetTimer();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = studyMinutes * 60;
    updateDisplay();
}

// ======= عداد الامتحانات التنازلي =======
const examDate = new Date("June 1, 2026 09:00:00").getTime();
setInterval(function() {
    const now = new Date().getTime();
    const distance = examDate - now;
    if (distance < 0) return;

    document.getElementById("exam-days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
    document.getElementById("exam-hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById("exam-minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById("exam-seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000);
}, 1000);

// تشغيل العرض المبدئي للعداد أول ما الصفحة تفتح
updateDisplay();
