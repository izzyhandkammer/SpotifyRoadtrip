import React from 'react'

export default function DisplayTrack({ track }) {

    return (
        <div 
            className='songCard' 
            style={{cursor: "poitner"}}
            onClick={() => console.log("Clicked!")}
        >
            <img src={track.albumUrl} style={{height: '64px', width: '64px'}} />
            <div className="songDesc">
                <div>{track.title}</div>
                <div className='text-muted'>{track.artist}</div>
            </div>
        </div>
    )
}