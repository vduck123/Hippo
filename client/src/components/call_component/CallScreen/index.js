import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import RenderWithCondition from '../../RenderWithCondition';
import { MdCancel } from 'react-icons/md';
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { IoVideocamOffOutline } from "react-icons/io5";

import { FaMicrophone } from "react-icons/fa";
import { IoMicOff } from "react-icons/io5";

const CallScreen = forwardRef(({
  sender,
  receiver,
  onCloseCall
}, ref) => {
  const { my_account } = useSelector(state => state.account);
  const [time, setTime] = useState(0);
  const [isOnCam, setIsOnCam] = useState(false);
  const [isOnMic, setIsMic] = useState(true);
  const videoRef = useRef();



  let audioStream;

  useLayoutEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleTurnOnMic = async () => {
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone turned on");
      setIsMic(true);
    } catch (error) {
      console.error("Failed to access the microphone", error);
    }
  };

  const handleTurnOffMic = () => {
    if (audioStream) {
      const tracks = audioStream.getTracks();
      tracks.forEach(track => track.stop());
      console.log("Microphone turned off");
    }
    setIsMic(false);
  };

  const handleTurnOnCam = async () => {
    try {
      setIsOnCam(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      console.log("Camera turned on");
    } catch (error) {
      console.error("Failed to access the camera", error);
    }
  }

  const handleTurnOffCam = () => {
    setIsOnCam(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      console.log("Camera turned off");
    }
  }

  return (
    <div ref={ref} className="flex flex-col items-center justify-center h-screen">
      <div className='w-2/5  h-2/4 bg-white shadow-lg flex items-center justify-center rounded-lg relative'>
        {isOnCam &&
          <video ref={videoRef} className='w-[180px] h-[180px] absolute -top-[16px] left-10 rounded-3xl' autoPlay />
        }
        <div className='w-1/2 h-1/2 flex flex-col items-center'>
          <RenderWithCondition condition={sender?.acc_id === my_account?.acc_id}>
            <div className='h-20 w-20 rounded-full overflow-hidden'>
              <img
                src={my_account?.avatar}
                alt={my_account?.avatar}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </RenderWithCondition>

          <RenderWithCondition condition={sender?.acc_id !== my_account?.acc_id}>
            <div className='h-20 w-20 rounded-full overflow-hidden'>
              <img
                src={receiver?.avatar}
                alt={receiver?.avatar}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </RenderWithCondition>

          <p className='font-bold text-xl mt-5'>
            {receiver?.acc_id === my_account?.acc_id ? `${sender?.full_name} đang gọi bạn` : `Đang gọi với ${receiver?.full_name}`}
          </p>

          <p className="text-gray-500 text-lg">{formatTime(time)}</p>

          <div className='flex items-center gap-3 mt-10'>
            {isOnMic ? (
              <button onClick={handleTurnOffMic}>
                <FaMicrophone size={35} />
              </button>
            ) : (
              <button onClick={handleTurnOnMic}>
                <IoMicOff size={35} />
              </button>
            )}

            {isOnCam ? (
              <button onClick={handleTurnOffCam} className='hover:opacity-60'>
                <IoVideocamOffOutline size={45} />
              </button>
            ) : (
              <button onClick={handleTurnOnCam} className='hover:opacity-60'>
                <AiOutlineVideoCameraAdd size={45} />
              </button>
            )}

            <button className='hover:opacity-60'
              onClick={() => {
                onCloseCall();
              }}>
              <MdCancel size={45} color='red' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CallScreen;
