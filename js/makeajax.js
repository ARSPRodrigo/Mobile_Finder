function showUser() {
  var e = document.getElementById("selectBrnd");
  var manufacturer = e.options[e.selectedIndex].value;
  var display = document.getElementById("dispbar").value;
  var memory = document.getElementById("memorybar").value;
  var camera = document.getElementById("camerabar").value;
  var batry = document.getElementById("batrybar").value;
  
  var b = document.getElementById("batrybar");
  var bloot=0;
  if(b.clicked){
      bloot = 1;
  }
  
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        //what happen data is here
        //alert(xmlhttp.responseText);
        updatePhoneInfo(xmlhttp.responseText)
      //document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
    }
  }
  xmlhttp.open("GET","server/Finder.php?manufacturer="+manufacturer+"&display_size="+display+"&memory="+memory+"&camera="+camera+"&battery_life="+batry+"&bluetooth="+bloot,true);
  xmlhttp.send();
}


function updatePhoneInfo(str){
    var obj = JSON.parse(str);
    var phoneSuggestion;
    var mapArray=[];
    var shopArray = [];
    var AddArray = [];
    var NumArray = [];
    if(obj.phones_count !="0"){
        phoneSuggestion = "<div>";
    for (var key in obj.phones) {
        if (obj.phones.hasOwnProperty(key)) {
            phoneSuggestion+="<div class='phone-dim'><div class='phone'><div class='phone-pic'><img src='images/";
            phoneSuggestion+=obj.phones[key].image;
            phoneSuggestion+="' class='phoneImg'/></div>";
            phoneSuggestion+=" <div class='phone-data'><span class='phone-name' id='manu_brand'>";
            phoneSuggestion+=(obj.phones[key].manufacturer + " " + obj.phones[key].brand_name);
            phoneSuggestion+="</span><br>";
            
            phoneSuggestion+="<div class='suggestedShops'>";
            for (var k in obj.phones[key].prices) {
                if (obj.phones[key].prices.hasOwnProperty(k)) {
                    phoneSuggestion+="<span class='phone-shop' id='shop'>";
                    phoneSuggestion+=obj.phones[key].prices[k].shop;
                    
                    
                    phoneSuggestion+=obj.phones[key].prices[k].address+"<br/>";
                    phoneSuggestion+=obj.phones[key].prices[k].contact;
                    phoneSuggestion+="</span><br/>";
                    
                    phoneSuggestion+="<span class='phone-price' id='price'>";
                    phoneSuggestion+=obj.phones[key].prices[k].price;
                    phoneSuggestion+=" LKR</span><br>";
                    mapArray.push(obj.phones[key].prices[k].map);
                    shopArray.push(obj.phones[key].prices[k].shop); 
                    AddArray.push(obj.phones[key].prices[k].address);
                    NumArray.push(obj.phones[key].prices[k].contact);
            }
            //alert(k);
            if(k > 1){
                break;
            }
        }
        phoneSuggestion+="</div></div></div></div>";
        initialize(mapArray,shopArray,AddArray,NumArray);    
            //alert(key + " -> " + obj.phones[key].brand_name);
        }
        phoneSuggestion+="<hr/>";
    }    
    phoneSuggestion+="</div>";
}
else{
    phoneSuggestion = "<div>No results found</div>";
    
}
     document.getElementById("suggestedPhones").innerHTML=phoneSuggestion;
    //alert(obj.results);
    
}


       function initialize(mapArray,shopArray,AddArray,NumArray) {
        

        var t = [];
        var x = [];
        var y = [];
        var h = [];
        
        for(var mapLocationTemp=0;mapLocationTemp < mapArray.length;mapLocationTemp++){
            var tempArr = mapArray[mapLocationTemp].split(",");
            var latitude = parseFloat(tempArr[0]);
            var longitute = parseFloat(tempArr[1]);
            t.push(shopArray[mapLocationTemp]);
            x.push(latitude);
            y.push(longitute);
            h.push('<p><strong>'+shopArray[mapLocationTemp]+'</strong><br/>'+AddArray[mapLocationTemp]+'<br/>'+NumArray[mapLocationTemp]+'</p>');
            
        }
        
        var map_options = {
            center: new google.maps.LatLng(latitude,longitute),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var google_map = new google.maps.Map(document.getElementById("map_canvas"), map_options);

        var info_window = new google.maps.InfoWindow({
            content: 'loading'
        });
        
        
/*
        t.push('Location Name 1');
        x.push(33.84659);
        y.push(-84.35686);
        h.push('<p><strong>Location Name 1</strong><br/>Address 1</p>');

        t.push('Location Name 2');
        x.push(33.846253);
        y.push(-84.362125);
        h.push('<p><strong>Location Name 2</strong><br/>Address 2</p>');
        
        
        t.push('Location Name 3');
        x.push(33.84665);
        y.push(-84.37212);
        h.push('<p><strong>Location Name 3</strong><br/>Address 3</p>');
*/
        var i = 0;
        for ( item in t ) {
            var m = new google.maps.Marker({
                map:       google_map,
                animation: google.maps.Animation.DROP,
                title:     t[i],
                position:  new google.maps.LatLng(x[i],y[i]),
                html:      h[i]
            });

            google.maps.event.addListener(m, 'click', function() {
                info_window.setContent(this.html);
                info_window.open(google_map, this);
            });
            i++;
        }
    }
