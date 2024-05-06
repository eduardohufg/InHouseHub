import React from "react";
import Player from "@madzadev/audio-player";


const tracks = [
    {
      url: "../../public/more.mp3",
      title: "MORE - The Warning",
      tags: ["rock"],
    },
    {
      url: "https://audioplayer.madza.dev/Madza-Late_Night_Drive.mp3",
      title: "Madza - Late Nightzxczxc Drive",
      tags: ["dnb"],
    },
    {
      url: "https://audioplayer.madza.dev/Madza-Persistence.mp3",
      title: "Madza - Persistenczcxcze",
      tags: ["dubstep"],
    },
  ];


const Player1 = () => {
    return (
        <div>
            <Player trackList={tracks} />
        </div>
    )
}
export default Player1;