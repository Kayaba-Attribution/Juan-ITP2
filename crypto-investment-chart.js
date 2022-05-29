function dollar() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Crypto Investment: $1 a day';
  
    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'dollar';
  
      // Names for each axis.
    this.xAxisLabel = 'year';
    this.yAxisLabel = '%';
  
    var marginSize = 35;
  
    // Layout object to store all common plot layout parameters and
    // methods.
    this.layout = {
      marginSize: marginSize,
  
      // Locations of margin positions. Left and bottom have double margin
      // size due to axis and tick labels.
      leftMargin: 0,
      rightMargin: width - marginSize -40,
      topMargin: marginSize,
      bottomMargin: height - marginSize * 2,
      pad: 5,
  
      plotWidth: function() {
        return this.rightMargin - this.leftMargin;
      },
  
      plotHeight: function() {
        return this.bottomMargin - this.topMargin;
      },
  
    };
  
    // Global Variables
    var textField;
    var ticker;
    var data;
    var dataJSON;
    var ticker = "";
    var show_chart = false; 
    var frameCount = 0;

    // Global Balances Variables
    var token_balance = 0;
    var money_balance = 0;
    var invested = 1;
    var profit = 0;
    var end = false;

  
    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        fontspecial = loadFont('data/Heart Blues.otf');
    };
  
    this.setup = function() {
        // set the frame rate of the draw function
        // add more for faster animation and viceversa
        frameRate(30);
  
  
      // Initializing the search bar
      textField = createInput();
      textField.position(415, 140);
      textField.value(ticker);
      this.searchButton = createElement("button").id("searchButton_");
      this.searchButton.position(560, 140);
  
      // Test method to check input capture
      //textField.input(myInputEvent)
  
      // When the user enters a new coin ticker
      this.searchButton.mousePressed(getData)
      textField.changed(getData);
      
      //Add the extension title and general info
      document.getElementById("extension_title").innerHTML = "Crypto Investment Visualization: Gains after $1 a day for a year!"
      document.getElementById("extension_explanation").innerHTML = "Enter a crypto coin ticker (Ie. BTC, BNB, ETH, DOT, SOL) on the black input area and hit the search button, the data is pulled from AlphaVanatage's free API"
  
        
  
    };
  

  
    this.destroy = function() {
      textField.remove();
      this.searchButton.remove();
      show_chart = false;
      ticker = " ";
  
    };



  
    this.draw = function() {
  
      push();

      stroke(0);
      // draw an empty axis
      staticAxis(this.layout)
  
      if(show_chart){
        // Draw the labels using the data from the Data constructor
        staticLabels(this.layout, data)
        // Draw the line chart animation along with the info
        this.drawLineChart(this.layout, data)
      }

      pop(); 
  
  
    };
  
  
    async function getData() {
      if(ticker != ""){
        data = "";
        dataJSON = ""
        show_chart = false
      }
      // Save the ticker value to prevent unneccesary API calls
      ticker = textField.value().toUpperCase();
      console.log("The ticker is: ",ticker)
      // Create a new InvestementData Object
      data = new InvestementData(ticker);
      // Reset all the values on every ticker change
      frameCount = 0;
      token_balance = 0;
      money_balance = 0;
      invested = 1;
      profit = 0;
      end = false;
      console.log("Fetching info on ", ticker)
      // Await for the API and load the data
      dataJSON = await loadJSON(data.apiCall, gotData);
  
      
      // Stops if API response is invalid, pases the response to the data object
      function gotData() {
          if(dataJSON["Error Message"] != undefined){
            ticker = ""
            data = "";
            dataJSON = ""
            show_chart = false
            

            console.log("No API response for ", ticker, " execution aborted.")
            return
          }
          else{
            console.log("API response recieved")
          }
          data.parseData(dataJSON);  
          loop()
  
          show_chart = true;
  
      }
    } 
    // Draw the graph labels
    function staticLabels(layout, data){
        var x_intervals = layout.plotWidth()/8;
        var y_intervals = layout.plotHeight()/7;
        push()
    
        noStroke();
        textSize(16)
        fill(255);
        textAlign('center', 'center');
    
        // Y-axis text
        count = 0;
        for (var i = 0; i < 6; i++) {
            text(data.priceLabels[count],
                layout.rightMargin + 40,
                layout.bottomMargin + (i * y_intervals) - 400);
            count++;
        }
    
        // X-axis text Counting down the days
        count = 365;
        for (var i = 0; i < 7; i++) {
            text(data.dateLabels[count],
                layout.leftMargin + (i * x_intervals + x_intervals),
                layout.bottomMargin + 20);
            count -= 45;
        }
        pop()
        
    
    }

    this.drawLineChart = function (layout, data){

        // frmeCount increments on each draw loop
        // stop after a year, compute the profit and diplay it
        if(frameCount > 364){ 

            var percentage_gains = (profit / 365) * 100;

            stroke(0)
            fill(255)
            textSize(35)
            textFont(fontspecial)

            text("Day #  365 :",10,80)
            text("GAINS: " + round(percentage_gains) + "%",10,140)
            text("Profit: $" + round(profit) + " USD",10,200)

            // bool to decide to draw the standart info text
            end = true
            noLoop();
 
  
        }

        // Values needed to draw the lines
        this.minDate = data.dateKeys[364]
        this.maxDate = data.dateKeys[0]

        this.minPrice = data.lowest;
        this.maxPrice = data.highest;

        this.totalDays = 364;

        var previous= {
            'day': "",
            'price': ""
        }

        // reverse loop from 0 to framecont for all the 365 values
        for (var i = 365; i > (364-frameCount) && i >= 0; i--) {
            
            var price = dataJSON[data.timeSeries][data.dateKeys[i]]["2a. high (USD)"];
        
            // Set base case for previous object
            if(previous == null){
                previous.day = this.mapDateToWidth(i);
                previous.price = this.mapDateToHeight(price);
            }

            // Save current day info for further use
            var day_ = this.mapDateToWidth(i);
            var price_ = this.mapDateToHeight(price);
            var current = {
                'day': day_,
                'price': price_
            }

            // Draw the line from previous to current info
            if(previous != null){
                stroke(0);
                line(current.day,current.price,previous.day,previous.price); 
            }

            // Draw decoration circle
            stroke('rgb(0,255,0)');
            ellipse(this.mapDateToWidth(i),this.mapDateToHeight(price),5);

            // Update previous obeject for next day info
            previous = current;



        }
        // Only for positive indexes while framecount hasnt triggered end
        if ( i >= 0 && !end){

            // Compute the buys and upadate the global balances

            var current_price = dataJSON[data.timeSeries][data.dateKeys[i]]["2a. high (USD)"] 
            var tokens_bought = 1 / current_price
            token_balance = token_balance + tokens_bought
            money_balance = current_price * token_balance
            profit = (token_balance * current_price) - invested

            // Draw the info
        
            stroke(0)
            fill(255)
            textSize(12)
            textSize(20)
            text("Day # "+ invested + ":",10,80)
            text("$$ Invested: " + invested,10,110)
            text("Tokens Owned: " + token_balance.toFixed(2), 10,140)
            text("Money Balance: " + round(money_balance),10,170)
            text("Profit: " + round(profit),10,200)
        }


      frameCount++;
      invested++;
    }

    this.mapDateToWidth = function(value) {
        return map(value,
            this.totalDays,
                   0,
                   this.layout.leftMargin,   // Draw left-to-right from margin.
                   this.layout.rightMargin);
      };


    this.mapDateToHeight = function(value) {
        return map(value,
                   this.minPrice,
                   this.maxPrice,
                   this.layout.bottomMargin, // Lower temperature at bottom.
                   this.layout.topMargin);   // Higher temperature at top.
      };
  

  }
  