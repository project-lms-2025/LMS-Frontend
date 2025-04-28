// src/components/ZoomMeeting.jsx
import React, { useEffect, useRef, useState } from 'react'
import { ZoomMtg } from '@zoomus/websdk'
import '@zoomus/websdk/dist/css/bootstrap.css'
import '@zoomus/websdk/dist/css/react-select.css'

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av')  
ZoomMtg.preLoadWasm()
ZoomMtg.prepareJssdk()

export default function ZoomMeeting({ meetingNumber, userName, userEmail, passWord, apiKey, signatureEndpoint }) {
  const zoomContainer = useRef(null)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    if (!joined) {
      fetch(signatureEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingNumber, role: 0 })
      })
      .then(res => res.json())
      .then(({ signature }) => {
        ZoomMtg.init({
          leaveUrl: window.location.href,
          success: () => {
            ZoomMtg.join({
              meetingNumber,
              userName,
              signature,
              apiKey,
              userEmail,
              passWord,
              success: () => setJoined(true),
              error: console.error
            })
          },
          error: console.error
        })
      })
      .catch(console.error)
    }
  }, [joined, meetingNumber, userName, userEmail, passWord, apiKey, signatureEndpoint])

  return (
    <div>
      <div ref={zoomContainer} id="zmmtg-root"></div>
      {!joined && <p>Joining meeting…</p>}
    </div>
  )
}
