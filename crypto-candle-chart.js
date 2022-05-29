function CryptoCandleChart() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Crypto Candle-Stick Chart';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'crypto-candlestisk';

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

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {

  };

  this.setup = function() {

    // Initializing the search bar and search button
    textField = createInput();
    textField.position(415, 140);
    textField.value(ticker);
    this.searchButton = createElement("button").id("searchButton_");
    this.searchButton.position(560, 140)

    // When the user enters a new coin ticker
    this.searchButton.mousePressed(getData)
    textField.changed(getData);
    
    //Add the extension title and general info
    document.getElementById("extension_title").innerHTML = "Crypto Candle-Stick Chart: Price movement of the last 15 days"
    document.getElementById("extension_explanation").innerHTML = "Enter a crypto coin ticker (Ie. BTC, BNB, ETH, DOT, SOL) on the input area and hit the search button, the data is pulled from AlphaVanatage's free API"



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

    // show_chart is only true when the API call is succesfull
    if(show_chart){
      // Draw the labels using the data from the Data constructor
      staticLabels(this.layout, data)
      // Draw the candles
      candles(this.layout, data)
      // Stop the draw loop
      noLoop()
      
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
    // Create a new Data Object
    data = new Data(ticker);
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
      count = 13;
      for (var i = 0; i < 7; i++) {
          text(data.dateLabels[count],
              layout.leftMargin + (i * x_intervals + x_intervals),
              layout.bottomMargin + 20);
          count -= 2;
      }
      
  
    }

    // Draw the candles
    function candles(layout, data){
      // number of candles: 16 lines - 2 borders = 14 candles
      var count = 14;
      strokeWeight(1);
      var candle_intervals = layout.plotWidth()/16;
      
      for (var i = 0; i < 15; i++) {
        // Get all the price parameters for each candle
        var high = dataJSON[data.timeSeries][data.dateKeys[count]]["2a. high (USD)"];
        var low = dataJSON[data.timeSeries][data.dateKeys[count]]["3a. low (USD)"];
        var open = dataJSON[data.timeSeries][data.dateKeys[count]]["1a. open (USD)"];
        var close = dataJSON[data.timeSeries][data.dateKeys[count]]["4a. close (USD)"];
        var innerWidth = layout.plotWidth()
        var x_coor = candle_intervals + candle_intervals * i

        // map the values to fit the layout
        low = map(low,data.priceRange[0], data.priceRange[1],
                  layout.bottomMargin, layout.topMargin);
                  
        high = map(high,data.priceRange[0], data.priceRange[1],
                  layout.bottomMargin, layout.topMargin);
        open = map(open,data.priceRange[0], data.priceRange[1],
                  layout.bottomMargin, layout.topMargin);
        close = map(close,data.priceRange[0], data.priceRange[1],
                  layout.bottomMargin, layout.topMargin);

        var direction = close - open;
        stroke(130);
        line(floor(x_coor), low, floor(x_coor), high);

          // Drawing open/close vertical line
          if (direction < 0) {
            // Positive candle open and close box
            fill("#2dc40b");
            stroke("black");
            rectMode(CENTER);
            rect(x_coor, (open+close)/2, innerWidth/40, open-close);
          }
          else {
              // Negative candle open and close box
              fill("#890e05");
              stroke("black");
              rectMode(CENTER);
              rect(x_coor, (open+close)/2, innerWidth/40, open-close);
          }
          count--;



      }

    }
    
}
