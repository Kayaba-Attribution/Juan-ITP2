function PayGapByJob2017() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap by job: 2017 Info on Hover';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-by-job-2017';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.
  this.pad = 20;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;

  this.coordinates_info = "";

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
    this.men_symbol = loadImage('data/images/men.png')
    this.women_symbol = loadImage('data/images/women.png')

  };

  this.setup = function() {
  };

  this.destroy = function() {
  };
  
  this.ParseFloat = function(float,val) {
    str = float.toString();
    str = str.slice(0, (str.indexOf(".")) + val + 1); 
    return Number(str);   
  }
  this.mousePressed = function(){
    return true
  }
  
  this.draw = function() {
    push();
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    image(this.men_symbol, -80, 30)
    image(this.women_symbol, 600, 40)
    //Add the extension title and general info
    document.getElementById("extension_title").innerHTML = "Occupation Pay Gap: Gap between hourly wages by gender and type of work"
    document.getElementById("extension_explanation").innerHTML = "On the graph below the circle size is the number of jobs by occupation and the color it the size of the pay gap. On <u>circle hover</u> more details are revealed, and all the other circles with the same job sector are higlighted. Press the click anywhere on the graph to get information on the position."


    // Draw the axes.
    this.addAxes();

    // Get data from the table object.
    var jobs = this.data.getColumn('job_subtype');
    var propFemale = this.data.getColumn('proportion_female');
    var payGap = this.data.getColumn('pay_gap');
    var numJobs = this.data.getColumn('num_jobs');
    var code = this.data.getColumn('job_type_code');
    var job_type = this.data.getColumn('job_type');

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);

    // Set ranges for axes.
    //
    // Use full 100% for x-axis (proportion of women in roles).
    var propFemaleMin = 0;
    var propFemaleMax = 100;

    // For y-axis (pay gap) use a symmetrical axis equal to the
    // largest gap direction so that equal pay (0% pay gap) is in the
    // centre of the canvas. Above the line means men are paid
    // more. Below the line means women are paid more.
    var payGapMin = -20;
    var payGapMax = 20;

    // Find smallest and largest numbers of people across all
    // categories to scale the size of the dots.
    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    fill(255);
    stroke(0);
    strokeWeight(1);

    var coordinates = []

    for (i = 0; i < this.data.getRowCount(); i++) {
      // Draw an ellipse for each point.
      // x = propFemale
      // y = payGap
      // size = numJobs

      x = map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad);
      y = map(payGap[i], payGapMin, payGapMax,  height - this.pad, this.pad);
      size = map(numJobs[i], numJobsMin, numJobsMax, this.dotSizeMin, this.dotSizeMax)
      job_code = code[i]
      job_type_ = job_type[i]
      //console.log(job_code)
  
      // Gradient to show how far is it from the centre
      gap_radient = map(y, this.pad, height / 2 - 10, 0, 180)
      fill(230, gap_radient, gap_radient);
      ellipse(x, y, size);

      if ((mouseX > this.pad)&&(mouseX < width - this.pad)&&(mouseIsPressed)){
        stroke(0);
        fill(255)
        textSize(18);
        strokeWeight(4);
        textAlign('center', 'center');
        strokeWeight(1);
        female = this.ParseFloat(map(mouseX, this.pad, width - this.pad,0, 100),2);
        male = this.ParseFloat(100 - female, 1)
        gap = this.ParseFloat(map(mouseY, height - this.pad, this.pad, -20, 20),2);
        if(mouseX < 750){
          text("Male: " + male + "%" + " | Female: " + female + "%" + "\nPay Gap: " + gap + "%", mouseX+150, mouseY )
        }
        else{
          text("Male: " + male + "%" + " | Female: " + female + "%" + "\nPay Gap: " + gap + "%", mouseX-150, mouseY )
        }
      
        console.log(mouseX)


        

      }

      

      if(coordinates.length < 26){
        coordinates.push([x,y,size,job_code,i])
        //console.log(coordinates.length)
  
      }
      if (coordinates.length == 25){
        //console.log(coordinates)
        this.coordinates_info = coordinates
        
      }
  
      
      // calculate distance from mouse to all circles
      dist_from_center_circle = dist(x,y,mouseX,mouseY)
      radius = size/2
      
      function ParseFloat(float,val) {
        str = float.toString();
        str = str.slice(0, (str.indexOf(".")) + val + 1); 
        return Number(str);   
      }

      
    

      // if mouse is between bounds then display information
      if(dist_from_center_circle < radius){
        //console.log(coordinates)
        textSize(18);
        fill(201,201,201);
        female_perc = "Prop Female: " + ParseFloat(propFemale[i],2) + "%\n"
        pay_gap = "Pay gap: " + ParseFloat(payGap[i],2) + "%\n"
        number_jobs = "Number Jobs: " + ParseFloat(numJobs[i],2) + ""
        rect(60,336,400,200)
        fill(0)
        textAlign('center', 'center');
        text("\nSector:\n" + job_type[i] + "\nJob:\n" + jobs[i] + "\n\n" + female_perc + pay_gap + number_jobs,60,240,400,200)
        fill(255);
        this.groupSelected(i)
        

      }

      
      

      
    }
    pop();



  };

  this.groupSelected = async function(i){

    for(var j = 0; j < 25; j++){
      if(this.coordinates_info[i][3] == this.coordinates_info[j][3]){
        //console.log("ON TOP OF: \n", coordinates[i],"MATCH: \n", coordinates[j])
        stroke(255, 204, 0);
        strokeWeight(2.5)
        fill(0,0,0,0)
        ellipse(this.coordinates_info[j][0],this.coordinates_info[j][1],this.coordinates_info[j][2]+20)
        fill(255)
        //text(this.coordinates_info[j][3], this.coordinates_info[j][0],this.coordinates_info[j][1]-20)
        stroke(0)
        strokeWeight(1)
      }
      }

  }




  this.addAxes = function () {
    stroke(200);

    // Add vertical line.
    line(width / 2,
         0 + this.pad,
         width / 2,
         height - this.pad);

    // Add horizontal line.
    line(0 + this.pad,
         height / 2,
         width - this.pad,
         height / 2);
  };

  function colorGradient(fadeFraction, rgbColor1, rgbColor2, rgbColor3) {
    var color1 = rgbColor1;
    var color2 = rgbColor2;
    var fade = fadeFraction;

    // Do we have 3 colors for the gradient? Need to adjust the params.
    if (rgbColor3) {
      fade = fade * 2;

      // Find which interval to use and adjust the fade percentage
      if (fade >= 1) {
        fade -= 1;
        color1 = rgbColor2;
        color2 = rgbColor3;
      }
    }

    var diffRed = color2.red - color1.red;
    var diffGreen = color2.green - color1.green;
    var diffBlue = color2.blue - color1.blue;

    var gradient = {
      red: parseInt(Math.floor(color1.red + (diffRed * fade)), 10),
      green: parseInt(Math.floor(color1.green + (diffGreen * fade)), 10),
      blue: parseInt(Math.floor(color1.blue + (diffBlue * fade)), 10),
    };

    return 'rgb(' + gradient.red + ',' + gradient.green + ',' + gradient.blue + ')';
  }
}



