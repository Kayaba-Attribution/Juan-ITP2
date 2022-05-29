
function InvestementData(ticker) {
    var apiKey = "V5ZIBTPZOAWUU4DK";
    this.apiCall = "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol="+ticker+"&market=USD&apikey="+apiKey;
    //this.apiCall = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+ticker+"&apikey="+apiKey;
    this.parseData;
    this.dateLabels = []; // X-axis labels
    this.dateKeys = []; // Data Key values
    this.priceLabels = []; // Y-axis labels
    this.priceRange = []; // Array to map the relationship between price and pixels
    this.timeSeries = "Time Series (Digital Currency Daily)";
    this.volRange = [];

    // Prepares the data for graphing
    this.parseData = function(dataJSON) {
        // X - AXIS
 
        

            // Puts date data into a temporary array
            var dateTemp = [];
            for (var i in dataJSON) {

                for (var j in dataJSON[i]) {
                    dateTemp.push(j);
                }
            }

            // Removes metadata from both arrays
            for (var i = 7; i < dateTemp.length; i++) {
                this.dateKeys.push(dateTemp[i]);
                this.dateLabels.push(dateTemp[i]);
            }
            console.log("today", this.dateKeys[0])
            console.log("old", this.dateKeys[364])
            //console.log(this.dateLabels)




     

        // Y - AXIS
            // Getting the lowest price and highest price for the past 365 days
            this.lowest = Number.MAX_VALUE;
            this.highest = Number.MIN_VALUE;
            for (var i = 0; i < 365; i++) {
       
                //console.log(i)
                if (parseFloat(dataJSON[this.timeSeries][this.dateKeys[i]]["2a. high (USD)"]) < this.lowest) {
                    this.lowest = parseFloat(dataJSON[this.timeSeries][this.dateKeys[i]]["3b. low (USD)"]);
                }

                if (parseFloat(dataJSON[this.timeSeries][this.dateKeys[i]]["2b. high (USD)"]) > this.highest) {
                    this.highest = parseFloat(dataJSON[this.timeSeries][this.dateKeys[i]]["2b. high (USD)"]);
                }
                
            }
            //console.log("LOWEST HIGH: " , this.lowest)
            //console.log("HIGHEST HIGH: ", this.highest)

            console.log("Finished gathering and organizing data for 365 days")

            var rangeDiv = Math.ceil((this.highest - this.lowest)/6);
            this.priceLabels = [Math.floor(this.lowest + (rangeDiv * 5))+".00",
                                Math.floor(this.lowest + (rangeDiv * 4))+".00",
                                Math.floor(this.lowest + (rangeDiv * 3))+".00",
                                Math.floor(this.lowest + (rangeDiv * 2))+".00",
                                Math.floor(this.lowest + (rangeDiv))+".00",
                                Math.floor(this.lowest)+".00"];

            this.priceRange = [Math.floor(this.lowest - (rangeDiv)),
                               Math.floor(this.lowest + (rangeDiv * 6))];

        


    }
}
