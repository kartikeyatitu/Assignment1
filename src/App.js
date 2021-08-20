import React,{useRef,createRef} from "react";
import * as BABYLON from 'babylonjs';
//using react-babylon.js for various elements of 3-d mapping creating the scene and then maaping the screenshots of our map on the cuboid
import { Engine, Scene, FreeCamera, HemisphericLight, Sphere, Ground,Box,ArcRotateCamera,PointLight } from "react-babylonjs";
//antd for creating the modal
import 'antd/dist/antd.css';
import {Vector3} from 'babylonjs';
import SceneComponent from 'babylonjs-hook';
import {  Color3,Vector4 } from "@babylonjs/core";
//useScreenshot hook has been used to take screenshot and the existing state of that image is passed as picture to standard Material for wrapping with the texture
import { useScreenshot } from "use-screenshot-hook";
//import { FreeCamera, Vector3, HemisphericLight, MeshBuilder,Mesh} from "@babylonjs/core";
import { Modal, Button } from 'antd'; //using antd for making the Modal
//Link to react google maps api package used below  https://www.npmjs.com/package/@react-google-maps/api
import {GoogleMap,useLoadScript,Marker,InfoWindow,} from "@react-google-maps/api";
//Link to usePlacesAutocomplete package for managing the search box at the top  https://www.npmjs.com/package/use-places-autocomplete
import usePlacesAutocomplete, {getGeocode,  getLatLng,} from "use-places-autocomplete";
//Note Combobox is a package which is used usePlacesAuto Complete to get a better ui shown in the link of usePlacesAutocomplete
import { Combobox,  ComboboxInput, ComboboxPopover,ComboboxList,ComboboxOption,} from "@reach/combobox";
import "@reach/combobox/styles.css";


const libraries = ["places"];
//map container style it needs 100% height and width of the container it is displayed..
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
//Note-> The Default look of the google maps is shown here we can also change that by using snazzy maps and using there styles 

const center = {
  //As i am currently in Allahabad i have used coordinates of it so that it renders Allahabad on Map when page first render
  lat: 25.4358,
  lng: 81.8463,
};

let box;


export default function App() {
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
 
  const [markers, setMarkers] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  let box;

  const { image, takeScreenshot } = useScreenshot();
     

  
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onMapClick = React.useCallback((e) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);
  const mapRef = React.useRef();
   const imageRef=React.useRef();
 
var columns = 6; // 6 columns
var rows = 1; // 1 row
//alien sprite
var faceUV = new Array(6);

//set all faces to same
for (var i = 0; i < 6; i++) {
  faceUV[i] = new Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
}

 
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
   
  
  }, []);
  const SpinningBox = (props) => {
    const boxRef = useRef(null);
  
    return (
      <box
        name={props.name}
        ref={boxRef}
      size={2}
      position={props.position}
      height={7}
      width={2.75}
      depth={6.25}
      faceUV={faceUV}
        wrap
      > 
       <standardMaterial>
        <texture url={image} assignTo={"diffuseTexture"} />
      </standardMaterial>
         
      </box>
    );
  };

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);
  imageRef.current=image;
  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
       
      <h1>
     
      
        
        <button  className="btn btn-danger mx-2" onClick={showModal} >View </button>
        <button  className="btn btn-primary" onClick={() => takeScreenshot()}>screenshot</button>
        
        </h1>
      
        <Modal  title="3-D View of map(texture) on Cuboid " visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
       < Engine        canvasId="sample-canvas">
    <Scene    >
    <ArcRotateCamera target={ Vector3.Zero() } radius={10}
            alpha={-Math.PI / 2} beta={(Math.PI / 2)} minZ={0.001} wheelPrecision={50}
          />

<hemisphericLight
          name="light1"
          intensity={0.7}
          direction={Vector3.Up()}
        />

      <SpinningBox
          name="left"
          position={new Vector3(0, 0, 0)}
          color={Color3.FromHexString("#EEB5EB")}
        />
            
          
    </Scene>
  </Engine>
      </Modal>
      
    
    
      <Locate panTo={panTo} />
      
      <Search panTo={panTo} />
     
    
      


      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
           
          />
        ))}

       
      </GoogleMap>
      
  
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <React.Fragment>
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="/compass.svg" alt="compass" />
    
    </button>
     
      </React.Fragment>
  );
}
//Search the place and the map will be panned to that location 
//Note we can leave leave the usePlacesAutoComplete parameters empty but i have set the lat and long to allahabad so that it finds places which are near me 
function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 25.4358, lng: () => 81.8463 },
      radius: 100 * 1000,
      //how far from allahabad tou want to prefer locations for thats why radius
    },
  });

  // 
  // lat: 25.4358, lng: 81.8463,https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
// using the geocoding api to convert the place  selected from combolist to its lat and lang and render the new map
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      
    </div>
  );
}
