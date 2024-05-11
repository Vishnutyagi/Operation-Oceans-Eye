import MapComponent from './MapComponent';
import React, { useEffect, useRef, useState } from 'react';
import { MapDrawComponent } from './MapDrawComponet';

export const OceansEye = () => {

  return (
    <div>
      <div>
        <MapComponent/>
      </div>
      <div>
        {/* <MapDrawComponent/> */}
      </div>
    </div>
  );
}
