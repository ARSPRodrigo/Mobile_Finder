<?php

//print_r($_POST);

$manufacturer = $_REQUEST["manufacturer"];
$display_size = $_REQUEST["display_size"];
$memory = $_REQUEST["memory"];
$camera = $_REQUEST["camera"];
if (!empty($_REQUEST["bluetooth"])) {
    $bluetooth = 1;
} else {
    $bluetooth = 0;
}

$battery_life = $_REQUEST["battery_life"];

$con = mysql_connect("localhost", "root", "");
if (!$con) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db("mobilefinder", $con);
$query = "SELECT * FROM phones WHERE 1=1";
if ($manufacturer != 'All') {
    $query = $query . " AND manufacturer='" . $manufacturer . "'";
}
if ($display_size != '0') {
    $query = $query . " AND display_size LIKE '" . $display_size . "%%'";
}
if ($memory != '0') {
    $query = $query . " AND memory > " . $memory . "";
}
if ($camera != 'null') {
    $query = $query . " AND camera > " . $camera . "";
}
if ($bluetooth != '0') {
    $query = $query . " AND bluetooth = 1";
}
if ($battery_life != '0') {
    $query = $query . " AND battery_life > " . $battery_life . "";
}
//echo $query.'<br/>';

$result = mysql_query($query);
$i = 0;

$json = '{"phones":[';
while ($row = mysql_fetch_array($result)) {
    $i++;
    $json = $json . '{"model_no":"' . $row['model_no'] . '","manufacturer":"' . $row['manufacturer'] .
            '","brand_name":"' . $row['brand_name'] . '","image":"' . $row['image'] . '","prices":[';
    $idphones = $row['idphones'];
    $prices = mysql_query('SELECT p.price, p.shops_idshops, s.name, s.contact, s.address, s.map FROM prices p, shops s '
            . 'WHERE idshops=shops_idshops AND phones_idphones=' . $idphones . ' ORDER BY price ASC LIMIT 0,10;');
    $j = 0;
    while ($prrow = mysql_fetch_array($prices)) {
        $j++;
        $json = $json . '{"price":"' . $prrow['price'] . '","idshop":"' . $prrow['shops_idshops'] .
                '","shop":"' . $prrow['name'] . '","contact":"' . $prrow['contact'] . '","address":"' . $prrow['address'] . '","map":"' . $prrow['map'] . '"},';
    }
    if ($j != 0) {
        $json = substr($json, 0, -1);
    }
    $json = $json . '],"shops_count":' . $j . '},';
}
if ($i != 0) {
    $json = substr($json, 0, -1);
}
$json = $json . '],"phones_count":' . $i . '}';
echo $json;
$response = $json;
?>