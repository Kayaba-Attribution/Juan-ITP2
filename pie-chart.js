function PieChart(x, y, diameter) {

  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;

  this.get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  };

  this.draw = function(data, labels, colours, title) {
    background(73, 73, 73);

    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => {
      return array.length == data.length;
    })) {
      alert(`Data (length: ${data.length})
Labels (length: ${labels.length})
Colours (length: ${colours.length})
Arrays must be the same length!`);
    }

    // https://p5js.org/examples/form-pie-chart.html

    var angles = this.get_radians(data);
    var lastAngle = 0;
    var colour;
    var angles_intervals = []

    for (var i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }

      fill(colour);
      strokeWeight(73, 73, 73);
      strokeWeight(1);

      arc(this.x, this.y,
          this.diameter, this.diameter,
          lastAngle, lastAngle + angles[i] + 0.001); // Hack for 0!

      //Save the last angle and new angle to an array
      start = lastAngle
      finish = lastAngle + angles[i] + 0.001
      angles_intervals.push([start, finish])

      // ADDITION TO MAKE THE PIE A DONUT
      ellipseMode(CENTER);
      fill(73, 73, 73);
      ellipse(this.x, this.y, this.diameter/2);
      
      if (labels) {
        this.makeLegendItem(labels[i], i, colour);
      }

      lastAngle += angles[i];
    }

    if (title) {
      noStroke();
      textAlign('center', 'center');
      textSize(24);
      fill(240, 248, 255)
      text(title, this.x, this.y - this.diameter * 0.6);
    }
    
    /*only get angle from mouse when is inside the donut*/
    
    distance_from_center = dist(this.x, this.y, mouseX, mouseY)
    
    if ((distance_from_center < this.diameter /2) && (distance_from_center > this.diameter /4)){

      /*Make a triangle ABC where a is the angle in radians*/
      C = mouseX - this.x
      B = this.y - mouseY
      a = Math.atan(B / C);

      /*manipulate values to make them work all around the circle*/
      if (mouseX < this.x){
        a = Math.PI - (Math.atan(B / C));
      }
      if (mouseX > this.x && mouseY > this.y){
        B = (this.y - mouseY) * -1
        a = a * -1
      }
      if (mouseX > this.x && mouseY < this.y){
        a = Math.PI*2 - (Math.atan(B / C)) ;
      }
      
      //itereate over the previous array and if a (the angle) is between the values then show the label for ir
      for (var i = 0; i < angles_intervals.length; i++) {
      if ((angles_intervals[i][0]<= a) & (a <=angles_intervals[i][1])){
  
        textSize(30);
        textFont('Georgia');
        fill(240, 248, 255)
        text(labels[i], this.x, this.y)

      }

      }
   

  

  }
    
    
  };

  this.makeLegendItem = function(label, i, colour) {
    var x = this.x + 50 + this.diameter / 2;
    var y = this.y + (this.labelSpace * i) - this.diameter / 3;
    var boxWidth = this.labelSpace / 2;
    var boxHeight = this.labelSpace / 2;

    fill(colour);
    rect(x, y, boxWidth+30, boxHeight);

    fill('black');
    noStroke();
    textAlign('left', 'center');
    textSize(18);
    fill(240, 248, 255);
    text(label, x + boxWidth + 40, y + boxWidth / 2);
  };
}
