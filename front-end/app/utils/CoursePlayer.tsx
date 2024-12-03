import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: React.FC<Props> = ({ videoUrl, title }) => {
  const [videoData, setVideoData] = useState({
    otp: '',
    playbackInfo: '',
  });

  const [isRequesting, setIsRequesting] = useState(false); // State to track ongoing request
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    // Check if the videoUrl has changed and is not already being requested
    if (videoUrl && !isRequesting) {
      setIsRequesting(true); 
      setIsLoading(true); 

      axios
        .post('http://localhost:9000/api/v1/course/getVdoCipherOTP', {
          videoId: videoUrl,
        })
        .then((res: any) => {

          setVideoData(res.data);
          setIsRequesting(false); 
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsRequesting(false);
          setIsLoading(false); 
        });
    }
  }, [videoUrl]); // Only trigger if videoUrl changes

  return (
    <div className='pt-[41%] relative'>
      {isLoading && <div className="loading-spinner">Loading..</div>}

      {videoData?.otp && videoData?.playbackInfo !== '' && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData?.playbackInfo}&player=Oa6Rk15XIQRSwRW6`}
          style={{
            width: '90%',
            height: '100%',
            position: 'absolute',
            top: '0',
            left: '0',
            border: '0',
          }}
          allowFullScreen={true}
          allow='encrypted-media'
        />
      )}
    </div>
  );
};

export default CoursePlayer;
