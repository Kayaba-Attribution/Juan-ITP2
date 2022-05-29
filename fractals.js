function Fractals() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Fractals: Math Visualization';
  
    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'fractals-math';

    // Set intial values
    this.min = 0;
    this.max = TWO_PI;
    this.default_value = PI/4;
    var state = "";
  
    this.setup = function() {
        

        // Add the extension title and general info
        document.getElementById("extension_title").innerHTML = "Fractals: Math Visualization"
        document.getElementById("extension_explanation").innerHTML = "Representation of a fractal tree, and a Sierpinski gasket. Choose the fractal with the buttons and move the slider to see the generation on real time "

        // Create the slider and buttons
        slider_default = createSlider(this.min, this.max, this.default_value, 0.0001);
        slider_default.style('width', '200px');

        btn_default = createButton('Fractal Tree');
        btn_default.position(400, 200).mousePressed(this.activateDefault);

        btn_triangle = createButton('Sierpinski Gasket');
        btn_triangle.position(510, 200).mousePressed(activateTriangle);

     
    
    };
  
    this.destroy = function() {
        slider_default.remove()
        btn_default.remove()
        btn_triangle.remove()
        state = "";
        value_t = ""
    };
    


    this.draw = function() {
        
        // draw the fractal indicated by the state

        if(state == "default"){

            this.fractal_default()
        }
        else if(state == "triangle"){
            fill(73,73,73)
            value_t = map(slider_default.value(), this.min, this.max, 1, 7)
            this.default_value = 1
            console.log(floor(value_t))
            this.fractal_trianle()

        }
        

    }


    // FRACTAL TREE //

    // set tree state on button press
    this.activateDefault = function() {

        state = "default"
    }

    // tree generation manager
    this.fractal_default = function (){
        background(73, 73, 73);
        angle = slider_default.value();
        stroke(255);
        translate(width/2, height);
        recursiveTree(200);
    }
    // tree recursive function
    function recursiveTree(len) {
        line(0, 0, 0, -len);
        translate(0, -len);
         if(len > 4) {
          push();
          rotate(angle);
          recursiveTree(len * 0.60);
          pop();
          push();
          rotate(-angle)
          recursiveTree(len * 0.60);
          pop();
        }
    }

    // Sierpinski Gasket //

    // fractal gasket variables
    var size = 640;
    var step = 1;
    var init_x = 200;
    var init_y = 560;
    // value_t is the mapped value for the Sierpinski Gasket
    var value_t = ""

    // set gasket state on button press
    function activateTriangle(){
        state = "triangle"
    }

    // gasket generation manager
    this.fractal_trianle = function (){
        clear()
        step = value_t
        recursiveTriangle(init_x, init_y, size, step)

    }

    // gasket recursive function
    function recursiveTriangle(x, y, size, step) {
        
        stroke(255)
        if (size > 4 && step > 0) {
            triangle(x, y, x + size, y, x + size / 2, y - (sqrt(3) * (size / 2)));
    
            // Left Triangle
            recursiveTriangle(x, y, size / 2, step - 1)
    
            // Right Triangle
            recursiveTriangle(x + size / 2, y, size / 2, step - 1)
    
            // Top Triangle
            recursiveTriangle(x + size / 4, y - (sqrt(3) * (size / 2) / 2), size / 2, step - 1)
        }
    }
    

  
  }
  
  
  
  