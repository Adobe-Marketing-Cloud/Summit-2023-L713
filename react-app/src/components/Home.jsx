/*
Copyright 2022 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from 'react';
import Adventures from './Adventures';
import Events from './Events';

/***
 * Displays a grid of current events & adventures
 */
 function Home() {
    return (
      <div className="Home">
        <Events />
        <hr/>
        <Adventures />
    </div>
    );
}

export default Home;
