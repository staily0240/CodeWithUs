function move() {
    const boxes = document.querySelectorAll('.box');
    
    boxes.forEach(box => {
        const progressCircle = box.querySelector('.progress-circle');
        const progressNum = box.querySelector('.progress-num');
        const progressValue = parseInt(box.getAttribute('data-progress'));
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = circumference - (circumference * progressValue) / 100;

        let width = 0; 
        const id = setInterval(frame, 30);
        function frame() {
            if (width >= progressValue) {
                clearInterval(id);
            } else {
                width++;
                progressCircle.style.strokeDashoffset = circumference - (circumference * width) / 100;
                progressNum.innerHTML = width + "<span>%</span>";
            }
        }
    });
}

window.onload = function() {
    move();
};
