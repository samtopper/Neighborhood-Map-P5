
var map;

// Create a new array for all the listing markers.
var markers = [];

function initMap() {
  // This Map constructor creates a new Map.
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat:17.401481, lng:78.450091},
      zoom: 13,
      mapTypeControl: false
  });

  var fsquare_id = 'K3QM5R5HR0FLEUVDY2EU5PWVXL5TAGAC2EAKLVJ5UVZHSSDA';
  var fsquare_secret = 'BU5ATIO30ETMIMAUGWVCXLBZGIMDQJAZ1ASLKT5NVURXS01W';

  var requestTimeout = setTimeout(function(){
      // $wikiElem.text("failed to get wikipedia resources.");
      console.log("failed to get resources");
  }, 8000);

  locations.forEach(function(item){
      $.ajax({
          url: 'https://api.foursquare.com/v2/venues/explore',
          dataType: 'jsonp',
          type: "GET",
          cache: 'false',
          data: 'limit=1&ll=' + item.location.lat + ',' + item.location.lng + '&query=' + item.title + '&client_id=' + fsquare_id + '&client_secret=' + fsquare_secret + '&v=20140806&m=foursquare'
      }).done(function(data){
          item.rating = data.response.groups[0].items[0].venue.rating;
          console.log(item.rating);
          if (!item.rating) {
              item.rating = 'No rating in foursquare';
          }
          largeInfowindow.open(map, marker);
          marker.content = '<br><div class="labels">' + '<div class="title">' + item.title + '</div><div class="rating">Foursquare rating: ' + item.rating + '</div><p>' + item.description + '</p>' + '<a href=' + item.URL + '>' + item.URL + '</a>' + '</div>';


          clearTimeout(requestTimeout);
      });
  });


  var largeInfowindow = new google.maps.InfoWindow();
  var defaultIcon = makeMarkerIcon('1D97C4');
  // Highlighting the marker when the user mouses over.
  var highlightedIcon = makeMarkerIcon('AAE12C');

    // this for loop creates an array of markers on initialization.
  for (var i = 0, len = locations.length; i < len; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
     var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    // Two event listeners to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0, len = markers.length; i < len; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);

}

// This function populates the infowindow when the marker is clicked.
function populateInfoWindow(marker, infowindow) {
    // Checking the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');

      infowindow.open(map, marker);
      // clearing the marker property if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
}

// This function takes in a color, and then creates a new marker icon of that color.
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(22, 35),  // 22 px wide by 35 px high.
      new google.maps.Point(0, 0),   // origin to (0,0)
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

