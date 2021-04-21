(function () {

    let last_click = "Select a country";
    let current_day ="";
    //------------------------------------------------------------------------------------------------------------------
    // At this functionHere we define only once the object that saves all the places in the program,
    // it is initialized once, and define listening
    //
    //Depending on the requirements we will hide the irrelevant information,
    // and present the one that is relevant
    //
    //Here we will set the SELECT of countries
    //
    //Here you set up the listening for all the cases that are needed in the exercise
    //
    //  returns:  None returning data, just updating :)
    //------------------------------------------------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {

        let queryString = location.search.substring(1); //The variable queryString now has the value "cityname|date".

        let a = queryString.split("|"); //To break these out into individual variables use split:


        //Once we arrive at the site without initializing the data (day and place)
        // we will send an error message to the user
        if(a[0] == undefined || a[1]==  undefined || a[2]==  undefined)
        {

            console.log("herer do somthing");
            document.getElementById("err_img").hidden = false;
            document.getElementById("errorimg").innerHTML  = "<div class=\"alert alert-danger font-weight-bold\"> Something is wrong, if this problem recurs - please contact our technical support.<br>Please go back to the main page (index), select country first, and from there select a specific day. :) <br> (To the programmer-Country and Date are Not Defined Yet.)</div>";

        }
        else
        {
            let replaced_title = a[0].replace("%20", " ");
            current_day = a[1];
            let headline = replaced_title +", "+ current_day ;//+ ", " + a[1]+ " code:" + a[2];
            document.getElementById("headline").innerText =headline;
            build_select();
            id_country =a[2];
            display_current_day_with_country(id_country);
            document.getElementById("coutriesSelect").addEventListener("click", showcity_day);

        }


    });

    function build_select()
    {


            daySelect = document.getElementById('coutriesSelect');
            // daySelect.options[daySelect.options.length] = new Option('NAME', 'ID');
            daySelect.options[daySelect.options.length] = new Option('New York', '2459115');
            daySelect.options[daySelect.options.length] = new Option('Los Angeles', '2442047');
            daySelect.options[daySelect.options.length] = new Option('Marseille', '610264');
            daySelect.options[daySelect.options.length] = new Option('Barcelona', '753692');
            daySelect.options[daySelect.options.length] = new Option('Rome', '721943');



    }
    function create_row(dataFiller,...data)
    {
        let html ="<tr>";
        for(index =0; index <data[0].length; index ++)
        {
            html += "<td>"
            html += dataFiller(index, data)  ;
            html += "</td>"
        }
        html += "</tr>"

        return html;
    }

    function showcity_day()
    {
       // console.log("im display the corrent day! :)")

        let CS = document.getElementById("coutriesSelect");
        let selectedCountry = CS.options[CS.selectedIndex].innerHTML;
        let selectedIdCountry = CS.value;

        //chang the geader to the corrent country
        if( selectedCountry != "Select a country")
        {
            let headline = selectedCountry +", "+ current_day;//+ ", " + a[1]+ " code:" + a[2];
            document.getElementById("headline").innerText =headline;
        }



        if( selectedIdCountry==last_click)
        {
                console.log("not pressed!");
            return;
        }
        //set the last_click to prevent double-click on the save country...
        last_click = selectedIdCountry;

        display_current_day_with_country(selectedIdCountry );


    }

    //this function , by getting the id of countey , now we fetch the information t get its countray cuurent day info...
    function display_current_day_with_country(selectedIdCountry)
    {


        //now edit the date in order to dend it to the fetch
        let date = current_day.split('-');
        console.log(date)


        function status(response) {
            if (response.status >= 200 && response.status < 300) {
                document.getElementById("err_img").hidden = true; //means no error to display

                return Promise.resolve(response)
            } else {

                document.getElementById("Show_city-btn").disabled = false;
                document.getElementById("Remove_cities-btn").disabled = false;
                return Promise.reject(new Error(response.statusText))
            }
        }

        function json(response) {
            //throw 'Parameter is not a number!';  this helped my cheak everything is ok!
            return response.json()
        }

        fetch("https://www.metaweather.com/api/location/" + selectedIdCountry +"/"+ date[0]+"/"+ date[1] + "/" + date[2]+"/",
            {
                //    method :'POST',
                mode:'cors',

            })
            .then(status)
            .then(json)
            .then(function (response)
            {
                console.log('Request succeeded with JSON response', response);

                let image = [];
                let image_desc = [];
                let max = [];
                let min = [];
                let wind_speed = [];

                let humidity = [];
                let visibility = [];

                let air_pressure = [];
                let predictability = []; //to confidance
                let temp_warm =[];
                let arrow_img =[];

                let j = 0;




                for(j=0; j < response.length; j++)
                {
                    image.push(response[j].weather_state_abbr);
                    image_desc.push(response[j].weather_state_name);
                    max.push(response[j].max_temp);
                    min.push(response[j].min_temp);
                    wind_speed.push(response[j].wind_speed);
                    humidity.push(response[j].humidity);
                    visibility.push(response[j].visibility);
                    air_pressure.push(response[j].air_pressure);
                    predictability.push(response[j].predictability);
                    arrow_img.push(response[j].wind_direction_compass);


                }

                //the day data
                html = "";
                document.querySelector("#dynamictable_one_day").innerHTML = html;

                let imagehtml   ="<img src=\"https://www.metaweather.com/static/img/weather/"+ image[0] + ".svg\" alt=\"weatherImage\" width=\"50\" height=\"50\">";
                html += "<tr>";
                html += "<td>"
                html +=  imagehtml;
                html += "</td>"
                html += "</tr>";


                html += "<tr>";
                    html += "<td>"
                    html += "MAX: ";
                    html +=  parseInt(max[0] , 10) ;
                    html +=   "°C" ;
                    html += "</td>"
                html += "</tr>";

                html += "<tr>";
                html += "<td>"
                html += "Min: ";
                html +=  parseInt(min[0] , 10) ;
                html +=   "°C" ;
                html += "</td>"
                html += "</tr>";

                html += "<tr>";
                html += "<td>";

                html +=  parseInt(wind_speed[0] , 10) + "mph"  ;
                html  += "</td>";
                html += "</tr>";

                html += "<tr>";
                html += "<td>";
                html +="<strong>Humidity</strong> <br>";
                let prs ="%";
                html += humidity[0] += prs+= "</td>";
                html += "</td>"
                html += "</tr>";

                html += "<tr>";
                html += "<td>";
                html +="<strong>Visibility</strong> <br>";

                //arr[0][i].toFixed(1) + " miles"
                let vi = visibility[0].toFixed(1) + " miles";

                html += vi += "</td>";
                html += "</td>";
                html += "</tr>";

                html += "<tr>";
                html += "<td>";
                html +="<strong>Pressure</strong> <br>";
                let pres =  parseInt(air_pressure[0], 10) + "mb";
                html += pres += "</td>";
                html += "</td>"
                html += "</tr>";

                html += "<tr>";
                    html += "<td>";
                html +="<strong>Confidence</strong> <br>";
                        html += predictability[0] += prs+= "</td>"; //for Confidence
                    html += "</td>";
                html += "</tr>";
                document.querySelector("#dynamictable_one_day").innerHTML += html;


                //the history data
                html = "";
                document.querySelector("#dynamictable").innerHTML = html;

                html+= create_row((i,arr)=>
                {

                    let imagehtml   ="<img src=\"https://www.metaweather.com/static/img/weather/"+ arr[0][i] + ".svg\" alt=\"weatherImage\" width=\"25\" height=\"25\">";


                    imagehtml += arr[1][i]  ;

                    return imagehtml;

                }, image,image_desc);
                html+= create_row((i,arr)=> "Max: " + parseInt(arr[0][i], 10) + "°C", max);
                html+= create_row((i,arr)=> "Min: " + parseInt(arr[0][i], 10) + "°C", min);

                html+= create_row((i,arr)=>       "<i class='fa fa-long-arrow-up "+arr[1][i]+"'></i>"+" "+ parseInt(arr[0][i], 10)+ "mph" , wind_speed, arrow_img);
               // html+= create_row((i,arr)=>       "<i class=\"fa fa-long-arrow-up \"></i>"+" "+ parseInt(arr[0][i], 10)+ "mph" , wind_speed);

                document.querySelector("#dynamictable").innerHTML += html;

            }).catch(function (error) {

            console.log(error);
            console.log("herer do somthing");
            document.getElementById("err_img").hidden = false;
            document.getElementById("errorimg").innerHTML  = "<div class=\"alert alert-danger font-weight-bold\"> The Weather forecast could not be loaded.</div>";

        });
    }

})();