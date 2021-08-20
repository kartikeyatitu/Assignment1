## Details



- "@react-google-maps/api"; for loading the map Link to react google maps api package used below  https://www.npmjs.com/package/@react-google-maps/api
- useScreenshot hook has been used to take screenshot and the existing state of that map as image is  passed for wrapping the mesh box  
- Link to usePlacesAutocomplete package for managing the search box at the top  https://www.npmjs.com/package/use-places-autocomplete with the hellp of Combobox
- I have also taken reference from videos(Youtube) to learn Babylon.js  and  Babylon.js Documentation for Creating the 3-d Model Link-> https://playground.babylonjs.com/#ICLXQ8#1

- using react-babylon.js for various elements of 3-d mapping creating the scene and then mapping the screenshots of our map on the cuboid
- Tech Used -> Reactjs , Babylon.js , bootstrap 
- Please install all the dependecies when you clone the project first time -> npm install
- Runs the app in the development mode. Open http://localhost:3000 to view it in the browser.
- Open the app and type a place of your choice - the map of that place will pop with zoomed
- Press the screenshot button it will take the screenshot 
- Click On The View Button to see the 3-D effect

 ![Main Page](/img/snaptrude1.png)
 
 ![Search Place](/img/snaptrude2.png)
 
 ![3-D Modal](/img/snaptrude2.png)
 
 ![Ok](/img/snaptrude4.png)
 
 ![Ok1](/img/snaptrude5.png)
 

 Note-> Create .env file and add REACT_APP_GOOGLE_MAPS_API_KEY="Your Api Key"