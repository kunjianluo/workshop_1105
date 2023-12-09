//1.1地图上的声音标注
document.addEventListener("DOMContentLoaded", function() {
    const soundMarker1 = document.getElementById("soundMarker1");
    const soundMarker2 = document.getElementById("soundMarker2");
    // 添加更多变量以适应更多标注
    
    // 示例：在特定坐标显示标注
    soundMarker1.style.left = "100px";
    soundMarker1.style.top = "150px";
    soundMarker1.style.display = "block";
    
    // 对其他标注重复上述步骤
  });


// //1.2鼠标移动的磁铁效果:使用 JavaScript 监听鼠标移动事件，根据鼠标位置调整附近元素的位置，产生磁铁效果。
// document.addEventListener("mousemove", function(event) {
//     const mouseX = event.clientX;
//     const mouseY = event.clientY;
    
//     // 计算距离并根据需要调整附近元素的位置
//     // 示例：将 soundMarker1 吸引到鼠标位置
//     const markerX = parseFloat(soundMarker1.style.left) || 0;
//     const markerY = parseFloat(soundMarker1.style.top) || 0;
//     const distance = Math.sqrt((mouseX - markerX)**2 + (mouseY - markerY)**2);
    
//     if (distance < 20) { // 根据需要调整距离阈值
//       // 应用磁铁效果，例如将 soundMarker1 吸引到鼠标位置
//       // 可以使用 CSS 过渡实现更平滑的效果
//       soundMarker1.style.left = mouseX + "px";
//       soundMarker1.style.top = mouseY + "px";
//     }
    
//     // 对其他标注重复上述步骤
//   });


// //1.3随鼠标移动的收集器效果：为收集器创建一个临时框，使其随着鼠标移动。
// document.addEventListener("mousemove", function(event) {
//     const collector = document.getElementById("collector");
//     collector.style.left = event.clientX + "px";
//     collector.style.top = event.clientY + "px";
//     collector.style.display = "block";
//   });

//1.4收集器内声音效果：使用 JavaScript 根据鼠标移动的加速度在收集器内创建光点动画。
  document.addEventListener("mousemove", function(event) {
    const collector = document.getElementById("collector");
    const collectorX = collector.getBoundingClientRect().left + collector.offsetWidth / 2;
    const collectorY = collector.getBoundingClientRect().top + collector.offsetHeight / 2;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    const distance = Math.sqrt((mouseX - collectorX)**2 + (mouseY - collectorY)**2);
    const maxDistance = 200; // 根据需要调整
    
    // 计算基于距离的动画值
    const animationValue = Math.min(1, distance / maxDistance);
    
    // 将动画应用到收集器，根据需要调整
    collector.style.transform = `scale(${1 + animationValue})`;
    
    // 你还可以使用 animationValue 控制动画的其他方面
    // 例如，根据距离调整收集器的不透明度或颜色
  });


// //1.5把收集到的光点，在收集器移动到column2-1上方时，实现单击鼠标将光点放入column2-1的效果
// window.onload = function() {
//     const collector = document.getElementById("collector");
//     const column21 = document.querySelector(".column2-1");
  
//     let isCollectorAboveColumn21 = false;
  
//     // 计算收集器是否在 column2-1 上方
//     function checkCollectorPosition() {
//       const collectorRect = collector.getBoundingClientRect();
//       const column21Rect = column21.getBoundingClientRect();
  
//       isCollectorAboveColumn21 = collectorRect.bottom <= column21Rect.top;
//     } 
  
//     // 单击事件处理逻辑
//     document.addEventListener("click", function() {
//       if (isCollectorAboveColumn21) {
//         // 将光点放入 column2-1，可以通过创建新元素实现
//         const lightPoint = document.createElement("div");
//         lightPoint.className = "light-point";
//         column21.appendChild(lightPoint);
  
//         // 重置收集器位置和样式
//         collector.style.left = "0";
//         collector.style.top = "0";
//         collector.style.display = "none";
//       }
//     });
  
//     // 添加到鼠标移动事件中，用于实时检查收集器位置
//     document.addEventListener("mousemove", function(event) {
//       collector.style.left = event.clientX + "px";
//       collector.style.top = event.clientY + "px";
//       checkCollectorPosition();
//     });
//   };

// //6种声音可视化
let audioContext; // 定义音频上下文
const BIN = 64; // 定义频率数组的大小

// 初始化音频上下文的函数
function initAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
}

class AudioPath {
  constructor(id, path, draw,color) {
    this.hasLoaded = false; // 是否已加载
    this.isPlaying = false; // 是否正在播放
    this.playingSounds = []
    this.audio = new Audio(); // 创建一个新的音频对象
    this.source; // 音频源

    this.id = id; // 音频ID
    this.path = path; // 音频路径
    this.draw = draw;

    this.audio.loop = true; // 设置音频循环播放
    this.color = color;
  }

  // 加载音频
  loadAudio() {
    fetch(this.path)
      .then(response => response.text())
      .then(text => {
        this.audio.src = `data:audio/x-wav;base64,${text}`; // 设置音频源
        this.hasLoaded = true; // 标记为已加载
        this.play(); // 播放音频
      })
  }

  // 播放音频
  play() {
    this.isPlaying = true;
    this.playingSounds.push(this.id); // 将当前音频的id添加到数组中

    if (!this.hasLoaded) {
      this.loadAudio(); // 如果未加载，则先加载音频
    } else {
      this.audio.play(); // 播放音频
      this.setUpAudioContext(); // 设置音频上下文
    }
  }

  // 暂停音频
  pause() {
    this.audio.pause(); // 暂停音频
    this.isPlaying = false; // 标记为不在播放
    this.playingSounds = this.playingSounds.filter(sound => sound !== this.id); // 从数组中移除当前音频的id
  }

  // 切换播放/暂停状态
  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // 设置音频上下文
  setUpAudioContext() {
    initAudioContext(); // 初始化音频上下文
    if (!this.source) {
      this.source = audioContext.createMediaElementSource(this.audio);
    }
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    this.source.connect(analyser);
    analyser.connect(audioContext.destination);
    const freqArray = new Uint8Array(BIN);

    function recursion(audio, draw) {
      if (audio.paused || audio.ended) {
        return;
      }
      analyser.getByteFrequencyData(freqArray);

      draw(freqArray);

      requestAnimationFrame(() => recursion(audio, draw))
    }
    recursion(this.audio, this.draw);
  }
}


// Visualizaiton
const WIDTH = 450;
const HEIGHT = 450;

const canvas1 = document.getElementById('canvas-1');
const context1 = canvas1.getContext('2d');
canvas1.width = WIDTH;
canvas1.height = HEIGHT;

const canvas2 = document.getElementById('canvas-2');
const context2 = canvas2.getContext('2d');
canvas2.width = WIDTH;
canvas2.height = HEIGHT;

const canvas3 = document.getElementById('canvas-3');
const context3 = canvas3.getContext('2d');
canvas3.width = WIDTH;
canvas3.height = HEIGHT;

const canvas4 = document.getElementById('canvas-4');
const context4 = canvas4.getContext('2d');
canvas4.width = WIDTH;
canvas4.height = HEIGHT;

const canvas5 = document.getElementById('canvas-5');
const context5 = canvas5.getContext('2d');
canvas5.width = WIDTH;
canvas5.height = HEIGHT;

const canvas6 = document.getElementById('canvas-6');
const context6 = canvas6.getContext('2d');
canvas6.width = WIDTH;
canvas6.height = HEIGHT;

class Particle {
  // 构造函数，用于初始化粒子属性
  constructor(x, y, vx, vy, size, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
    this.moveStep = 0;
  }
  // 绘制粒子
  drawParticle(context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.rect(this.x, this.y, this.size, this.size);
    context.fill();
  }
  // 更新粒子位置的方法
  update(freq, context) {
    this._resetPosition();

    this.moveStep++;
    // 每20帧更新归零一次，并且随机改变粒子运动方向，若没有，每帧都要随机，很可能就左右停在原地了
    if (this.moveStep >= 20) {
      this.moveStep = 0;
      this.vx = (Math.random() < 0.5 ? 1 : -1) * this.vx;//大于0.5=1，小于0,5=-1
      this.vy = (Math.random() < 0.5 ? 1 : -1) * this.vy;
    }
    // 频率改变运动速度，调参：freq可能100-200，需要乘以系数
    this.size = 20 + freq * 0.5;

    // 添加对 context 的检查
    if (context) {
      this.drawParticle(context);
    }
    this.x += this.vx * (freq * 0.03);
    this.y += this.vy * (freq * 0.03);
  }

  // _resetPosition方法用于调整粒子位置，确保它不会离开画布
  _resetPosition() {
    if (this.x < 0) this.x = WIDTH;
    if (this.x > WIDTH) this.x = 0;
    if (this.y < 0) this.y = HEIGHT;
    if (this.y > HEIGHT) this.y = 0;
  }
}
const colors = ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"]
const points = [];
for (let i = 0; i < BIN; i++) {
  points.push(new Particle(
    Math.random() * WIDTH,
    Math.random() * HEIGHT,
    2, 2, 20,
    colors[getValueIndex(i, BIN - 1, colors.length)]
  ))
}

// 获取给定值在固定范围内的索引
function getValueIndex(value, max, n) {
  const unit = max / n;
  return Math.min(Math.floor(value / unit), n - 1);
}
// 指定范围内的随机整数
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}


const audio1 = new AudioPath('Rain', 'audition/rain.txt', (freqs) => {
  draw2(freqs, context1,'rgba(28, 80, 113 ,0.05)');
});
const audio2 = new AudioPath('Wave', 'audition/ocean.txt', (freqs) => {
  draw2(freqs, context2,'rgba(83, 194, 146, 0.05)');
});
const audio3 = new AudioPath('Lighting', 'audition/thunder2.txt', (freqs) => {
  draw2(freqs, context3,'rgba(96, 92, 184, 0.03)');
});
const audio4 = new AudioPath('Footsteps', 'audition/footsteps.txt', (freqs) => {
  draw2(freqs, context4,'rgba(255, 230, 128, 0.05)');
});
const audio5 = new AudioPath('Hawking', 'audition/hawking.txt', (freqs) => {
  draw1(freqs, context5,'rgba(251, 150, 73, 0.03)');
});
const audio6 = new AudioPath('Subway', 'audition/subway.txt', (freqs) => {
  draw1(freqs, context6,'rgba(230, 70, 64, 0.02)');
});

document.getElementById('Rain').addEventListener('click', function () {
  audio1.toggle();
  updateDuetDescription();
});

document.getElementById('Wave').addEventListener('click', function () {
  audio2.toggle();
  updateDuetDescription();
});

document.getElementById('Lighting').addEventListener('click', function () {
  audio3.toggle();
  updateDuetDescription();
});

document.getElementById('Footsteps').addEventListener('click', function () {
  audio4.toggle();
  updateDuetDescription();
});

document.getElementById('Hawking').addEventListener('click', function () {
  audio5.toggle();
  updateDuetDescription();
});

document.getElementById('Subway').addEventListener('click', function () {
  audio6.toggle();
  updateDuetDescription();
});
/**
 * Visualization code, same as week4/5
 */

function draw1(freqs, context){
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.beginPath();
  context.fillStyle='rgba(206, 220, 239, 0.5)';
  
  context.arc(WIDTH/2, HEIGHT/2, freqs[0], 0, Math.PI * 2);
  context.fill();
}

function draw2(freqs, context,color){
  // context.clearRect(0, 0, WIDTH, HEIGHT);
  // 使用 filter 方法筛选出每十个点中的第一个点，并更新这些点的位置
  const renderPoints = points.filter((point, index) => {
    point.update(freqs[index]);
    return index % 10 === 0;
  });

  context.beginPath();
  context.moveTo(renderPoints[0].x, renderPoints[0].y);

  // 遍历筛选后的点，使用二次贝塞尔曲线连接它们
  for (let i = 1; i < renderPoints.length - 2; i++) {
    const { x, y } = renderPoints[i];
    const { x: nextX, y: nextY } = renderPoints[i + 1];

    const cx = (x + nextX) / 2;
    const cy = (y + nextY) / 2;
    context.quadraticCurveTo(x, y, cx, cy);
   // 传递 context 给 drawParticle 方法
  }
  // 设置曲线的样式，比如颜色、宽度等
  context.strokeStyle = color;
  context.lineWidth = 2;
  // 绘制曲线
  context.stroke();
}

function draw3(freqs, context) {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.beginPath();

  // 遍历频率数组，每个元素对应一个点
  for (let i = 0; i < freqs.length - 1; i++) {
    const point = points[i];
    point.update(freqs[i]);

    if (freqs[i] > 50) {
      context.lineTo(point.x, point.y);
      context.arc(point.x, point.y, 5, 0, Math.PI * 2);
    }
  }
  context.closePath();
  context.stroke();
}

//在页面底部更新留言
function updateDuetDescription() {
  const duetDescription = document.getElementById('duetDescription');
  // 获取所有音频的正在播放的音频名称
  const playingSounds = [audio1,audio2,audio3,audio4,audio5,audio6
  ].filter(audio => audio.isPlaying).map(audio => audio.id);
  // 更新title2内容
  duetDescription.textContent = `“A duet of ${playingSounds.join(' ')}”`;
}