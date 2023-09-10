let userTab=document.querySelector("[userWeather]");
let searchTab=document.querySelector("[searchWeather]");
let userContainer=document.querySelector(".weather-container");
let grantAccessContainer=document.querySelector(".grant-accessContainer");
let searchFormContainer=document.querySelector(".search-form-container");
let loadingScreenContainer=document.querySelector(".loading-container");
let userInfoContainer=document.querySelector(".user-info-container");
let errorPage=document.querySelector(".errorPage");
let API_KEY="d1845658f92b31c64bd94f06f7188c9c";
let currentTab=userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();
function switchTab(clickedTab){
    if(currentTab!=clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchFormContainer.classList.contains("active")){
            // if search-form-container is invisible,then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            errorPage.classList.remove("active");
            searchFormContainer.classList.add("active");
        }
        else{
            // if search-form-container is visible then,make it invisible.
            searchFormContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorPage.classList.remove("active");
            // Now we are at user-weather tab.so, we have to display user-weather and for that 
            // we have to check whether we have stored the user coordinats in local storage or not.
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener('click',()=>{
    // pass clicked tab as input parameter
    switchTab(userTab)
});
searchTab.addEventListener('click',()=>{
    // pass clicked tab as input parameter
    switchTab(searchTab);
});
//check if coordinates are already present in sessionstorage of not
function getfromSessionStorage(){
    let localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
    // if user-coordinates are not present
    grantAccessContainer.classList.add("active");  
    }
    else{
    let coordinates=JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    let latitude=coordinates.lat;
    let longitude=coordinates.long;
    //make grantAccessContainer invisible
    grantAccessContainer.classList.remove("active");
    // make loadingScreenContainer visible
    loadingScreenContainer.classList.add("active");
    try{
    let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);//network call
    let data= await response.json(); // wait untill response get converted into json format
    loadingScreenContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}
catch(e){
    loadingScreenContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
    errorPage.classList.add("active");
}
}
function  renderWeatherInfo(weatherInfo){
   let cityName=document.querySelector("[cityName");
   let countryIcon=document.querySelector("[countryIcon]");
   let weatherDesc=document.querySelector("[weatherDesc]");
   let weatherIcon=document.querySelector("[weatherIcon]");
   let temp=document.querySelector("[temp]");
   let windSpeed=document.querySelector("[data-windSpeed]");
   let humidity=document.querySelector("[data-humidity]");
   let cloudiness=document.querySelector("[data-cloudiness]");
   // fetch values from weatherInfo object and put then in UI-elements
   cityName.innerText=weatherInfo?.name;
   countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   weatherDesc.innerText=weatherInfo?.weather?.[0]?.description;
   weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText=`${weatherInfo?.main?.temp}°C`;
   windSpeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText=`${weatherInfo?.main?.humidity}%`;
   cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
   }
function showPosition(position){
    let userCoordinates={
    lat:position.coords.latitude,
    long:position.coords.longitude
    }
    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
} 
function getLocation(){
    if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
    alert("Geolocation support is not available");
    }
}
let searchInput=document.querySelector('[searchInput]');
let grantAccessButton=document.querySelector("[grantAccess]");
grantAccessContainer.addEventListener("click",getLocation);
searchFormContainer.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="") return;
    fectchSearchWeatherInfo(cityName);
})
async function fectchSearchWeatherInfo(city){
    errorPage.classList.remove("active");
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    loadingScreenContainer.classList.add('active');
    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);//network call
        let data= await response.json(); // wait untill response get converted into json format
        loadingScreenContainer.classList.remove("active");
        if(data.cod==='404'){
        userInfoContainer.classList.remove('active');
        errorPage.classList.add('active');
        return;
        }
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreenContainer.classList.remove("active");
        userInfoContainer.classList.remove("active");
        errorPage.classList.add("active");
    }
}
