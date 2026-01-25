<?php

$KEY = "sk_b6d3077f1bfe45146d0356d7d2b8be42f30f31d0b0cd0474";
$VOICE = "S9GPGBaMND8XWwwzxQXp";

$AUDIO = "audio.mp3";
$HASH = "audio.hash";

$data = json_decode(file_get_contents("php://input"), true);
$text = $data["text"] ?? "";

if(!$text) exit;

// hash text
$new = md5($text);

// if already generated → reuse
if(file_exists($AUDIO) && file_exists($HASH)){
  if(file_get_contents($HASH) === $new){
    header("Content-Type: audio/mpeg");
    readfile($AUDIO);
    exit;
  }
}

// generate new
$ch = curl_init("https://api.elevenlabs.io/v1/text-to-speech/$VOICE");

curl_setopt_array($ch,[
  CURLOPT_POST=>true,
  CURLOPT_RETURNTRANSFER=>true,
  CURLOPT_HTTPHEADER=>[
    "xi-api-key: $KEY",
    "Content-Type: application/json"
  ],
  CURLOPT_POSTFIELDS=>json_encode(["text"=>$text])
]);

$audio = curl_exec($ch);
curl_close($ch);

// save
file_put_contents($AUDIO,$audio);
file_put_contents($HASH,$new);

// output
header("Content-Type: audio/mpeg");
echo $audio;
