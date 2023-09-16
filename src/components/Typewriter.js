import React, { useState, useEffect, useRef } from 'react';

const Typewriter = ({ data, pausePeriod = 200 }) => {
  const [txt, setTxt] = useState('');

  const loopNumRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);

  useEffect(() => {
    const tick = () => {
      const i = loopNumRef.current % data.length;
      const fullTxt = data[i];
      let delta = 200; // Time between each character addition/removal

      if (isDeletingRef.current) {
        if (charIndexRef.current > 0) {
          setTxt(fullTxt.substring(0, charIndexRef.current - 1));
          charIndexRef.current = charIndexRef.current - 1;
        } else {
          isDeletingRef.current = false;
          loopNumRef.current = loopNumRef.current + 1;
          delta = 200;
        }
      } else {
        if (charIndexRef.current < fullTxt.length) {
          setTxt(fullTxt.substring(0, charIndexRef.current + 1));
          charIndexRef.current = charIndexRef.current + 1;
        } else {
          isDeletingRef.current = true;
          delta = pausePeriod;
        }
      }

      setTimeout(tick, delta);
    };

    tick();

    // Clean-up function to clear timeout if component is unmounted.
    return () => {
      if (tick) {
        clearTimeout(tick);
      }
    };
  }, [data, pausePeriod]);

  return <span className="">{txt}</span>;
};

export default function App() {
  return (
    <h1 className="md:text-4xl text-md md:h-16 h-6">
      <a href="#">
        <Typewriter
          data={["English", "Español", "中文 (繁體)", "한국"]}
        />
      </a>
    </h1>
  );
}
