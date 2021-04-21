(function () {
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
        // console.log("im in!")
        build_select();

        document.getElementById("coutriesSelect").addEventListener("click", showcity)

    });

    let last_click = "Select a country"; // here we can save the last click on select, thus it can help us define if the mew click was on a new country or not.


    function build_select() {
        //dictionary of countires with id
        daySelect = document.getElementById('coutriesSelect');
        // daySelect.options[daySelect.options.length] = new Option('NAME', 'ID');
        daySelect.options[daySelect.options.length] = new Option('New York', '2459115');
        daySelect.options[daySelect.options.length] = new Option('Los Angeles', '2442047');
        daySelect.options[daySelect.options.length] = new Option('Marseille', '610264');
        daySelect.options[daySelect.options.length] = new Option('Barcelona', '753692');
        daySelect.options[daySelect.options.length] = new Option('Rome', '721943');

    }


    //this function help us to add new row ( lambda).
    //@param ...data consatins one or two arrays with data, def=pens on the current row
    function create_row(dataFiller, ...data) {
        let html = "<tr>";
        for (index = 0; index < 6; index++) {
            html += "<td>"
            html += dataFiller(index, data);
            html += "</td>"
        }
        html += "</tr>"

        return html;
    }


    //______showcity________________________________________________________
    //We will reach this function as soon as we press a from
    // the SELECT we come here and extract the data of that current selection.
    function showcity() {
        let CS = document.getElementById("coutriesSelect");
        let selectedCountry = CS.options[CS.selectedIndex].innerHTML;
        let selectedIdCountry = CS.value;

        //in case to prevent double-click:
        if (selectedIdCountry == last_click) {
            return;
        }
        //set the last_click to prevent double-click on the save country...
        last_click = selectedIdCountry;

        get_data_countries(selectedIdCountry);
    }


    async function get_data_countries(selectedIdCountry) {

        function status(response) {
            if (response.status >= 200 && response.status < 300) {
                document.getElementById("err_img").hidden = true; //means no error to display

                return Promise.resolve(response)
            } else {

                return Promise.reject(new Error(response.statusText))
            }
        }

        // const tokenKey = await getToken();

        function json(response) {
            //throw 'Parameter is not a number!';  this helped my cheak everything is ok!
            return response.json()
        }

        //with the corrnt city - fetch to server

        try {
            const responseFetchObj = await fetch("https://www.metaweather.com/api/location/" + selectedIdCountry,
                {
                    //    method :'POST',
                    mode: 'cors',
                });

            const response = await responseFetchObj.json();


            let headline = response.title + ", " + response.parent.title;
            document.getElementById("headline").innerText = headline;


            let time = response.time.valueOf().substring(11, 16) + "pm";
            let sunrise = response.sun_rise.valueOf().substring(11, 16) + "am";
            let sunset = response.sun_set.valueOf().substring(11, 16) + "pm";

            let DataHead = "Time:  " + time + "\n" +
                "      Sunrise:  " + sunrise + "\n" +
                "      Sunset:  " + sunset + "\n";
            document.getElementById("Dataheadline").innerText = DataHead;

            //the wanted data of the different kinds will be saved here:
            let date = [];
            let image = [];
            let image_desc = [];
            let max = [];
            let min = [];
            let humidity = [];
            let visibility = [];
            let air_pressure = [];
            let predictability = []; //to confidance
            let wind_speed = [];
            let arrow_img = [];
            let j = 0;

            //insert data to arrays from response
            for (j = 0; j < 6; j++) //6 for six days ...
            {

                date.push(response.consolidated_weather[j].applicable_date);
                image.push(response.consolidated_weather[j].weather_state_abbr);
                image_desc.push(response.consolidated_weather[j].weather_state_name);
                max.push(response.consolidated_weather[j].max_temp);
                min.push(response.consolidated_weather[j].min_temp);
                humidity.push(response.consolidated_weather[j].humidity);
                visibility.push(response.consolidated_weather[j].visibility);
                air_pressure.push(response.consolidated_weather[j].air_pressure);
                predictability.push(response.consolidated_weather[j].predictability);
                wind_speed.push(response.consolidated_weather[j].wind_speed);
                arrow_img.push(response.consolidated_weather[j].wind_direction_compass);
            }

            let index = 0;

            //build the new corrent table:
            html = "";
            document.querySelector("#dynamictable").innerHTML = html;


            html += create_row((i, arr) => {
                let display_date = "";
                if (i == 0) {
                    display_date = "Today";

                } else if (i == 1) {
                    display_date = "Tomorrow";
                } else {
                    const date = new Date(arr[0][i]);
                    let date_parts = new Intl.DateTimeFormat('en-US', {dateStyle: 'full'}).formatToParts(date);
                    console.log(date_parts[0].value.substring(0, 3) + " " + date_parts[4].value + " " + date_parts[2].value)
                    display_date = date_parts[0].value.substring(0, 3) + " " + date_parts[4].value + " " + date_parts[2].value;
                }
                return "<a href=\"displaySpeciifcDay.html?" + response.title + "|" + arr[0][i] + "|" + selectedIdCountry + "\">" + display_date + "</a>"
            }, date);

            html += create_row((i, arr) => {

                let imagehtml = "<img src=\"https://www.metaweather.com/static/img/weather/" + arr[0][i] + ".svg\" alt=\"weatherImage\" width=\"50\" height=\"50\">";
                imagehtml += arr[1][i];

                return imagehtml;

            }, image, image_desc);


            html += create_row((i, arr) => "Max: " + parseInt(arr[0][i], 10) + "°C", max);
            html += create_row((i, arr) => "Min: " + parseInt(arr[0][i], 10) + "°C", min);
            html += create_row((i, arr) => "<i class='fa fa-long-arrow-up " + arr[1][i] + "'></i>" + " " + parseInt(arr[0][i], 10) + "mph", wind_speed, arrow_img);
            html += create_row((i, arr) => "<strong>Humidity</strong> <br>" + arr[0][i] + "%", humidity);
            html += create_row((i, arr) => "<strong>Visibility</strong> <br>" + arr[0][i].toFixed(1) + " miles", visibility);
            html += create_row((i, arr) => "<strong>Pressure</strong> <br>" + parseInt(arr[0][i], 10) + "mb", air_pressure);
            html += create_row((i, arr) => "<strong>Confidence</strong> <br>" + arr[0][i] + "%", predictability);

            document.querySelector("#dynamictable").innerHTML += html;


            //-----------------tbody
            let tbody = '';
            //to build each col
            /*           for (var i = 1; i <= 6; i++) {
                           //to build each row
                          // for ()
                  /!*         tbody +=  "<tr> <td class='td col1'>" + 11 +" </td>"  ;
                           tbody += "<td class='td col2'>2</td>" ;
                           tbody +=  "<td class='td col3'> </div></td>" ;
                           tbody +=  "</tr>" ;*!/
                       }
                       document.getElementById("bodyCal").innerHTML  = tbody;*/

        } catch (error) {


            console.log(error);
            console.log("herer do somthing");
            document.getElementById("err_img").hidden = false;
            document.getElementById("errorimg").innerHTML = "<div class=\"alert alert-danger font-weight-bold\"> The Weather forecast could not be loaded :( .</div>";

        }
        ;
    }


})();