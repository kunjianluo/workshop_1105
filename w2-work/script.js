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


//1.2鼠标移动的磁铁效果:使用 JavaScript 监听鼠标移动事件，根据鼠标位置调整附近元素的位置，产生磁铁效果。
document.addEventListener("mousemove", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    // 计算距离并根据需要调整附近元素的位置
    // 示例：将 soundMarker1 吸引到鼠标位置
    const markerX = parseFloat(soundMarker1.style.left) || 0;
    const markerY = parseFloat(soundMarker1.style.top) || 0;
    const distance = Math.sqrt((mouseX - markerX)**2 + (mouseY - markerY)**2);
    
    if (distance < 20) { // 根据需要调整距离阈值
      // 应用磁铁效果，例如将 soundMarker1 吸引到鼠标位置
      // 可以使用 CSS 过渡实现更平滑的效果
      soundMarker1.style.left = mouseX + "px";
      soundMarker1.style.top = mouseY + "px";
    }
    
    // 对其他标注重复上述步骤
  });


//1.3随鼠标移动的收集器效果：为收集器创建一个临时框，使其随着鼠标移动。
document.addEventListener("mousemove", function(event) {
    const collector = document.getElementById("collector");
    collector.style.left = event.clientX + "px";
    collector.style.top = event.clientY + "px";
    collector.style.display = "block";
  });

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


//1.5把收集到的光点，在收集器移动到column2-1上方时，实现单击鼠标将光点放入column2-1的效果
window.onload = function() {
    const collector = document.getElementById("collector");
    const column21 = document.querySelector(".column2-1");
  
    let isCollectorAboveColumn21 = false;
  
    // 计算收集器是否在 column2-1 上方
    function checkCollectorPosition() {
      const collectorRect = collector.getBoundingClientRect();
      const column21Rect = column21.getBoundingClientRect();
  
      isCollectorAboveColumn21 = collectorRect.bottom <= column21Rect.top;
    } 
  
    // 单击事件处理逻辑
    document.addEventListener("click", function() {
      if (isCollectorAboveColumn21) {
        // 将光点放入 column2-1，可以通过创建新元素实现
        const lightPoint = document.createElement("div");
        lightPoint.className = "light-point";
        column21.appendChild(lightPoint);
  
        // 重置收集器位置和样式
        collector.style.left = "0";
        collector.style.top = "0";
        collector.style.display = "none";
      }
    });
  
    // 添加到鼠标移动事件中，用于实时检查收集器位置
    document.addEventListener("mousemove", function(event) {
      collector.style.left = event.clientX + "px";
      collector.style.top = event.clientY + "px";
      checkCollectorPosition();
    });
  };